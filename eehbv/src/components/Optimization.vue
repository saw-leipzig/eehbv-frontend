<template>
  <v-container>
    <v-row>
      <v-col cols="12"><h2>{{ $t('optimization.titles.definition') }} {{process.view_name}}</h2></v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-stepper v-model="def_step">
          <v-stepper-header>
            <v-stepper-step :complete="def_step > 1" color="green" step="1">
              {{ $t('process_definition.titles.parameters') }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 2" color="green" step="2">
              {{ $t('process_definition.titles.profiles') }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 3" color="green" step="3">
              {{ $t('process_creation.labels.variant_selection_definition') }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 4" step="4" color="green">
              {{ $t('optimization.titles.constraints') }}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5" color="green">
              {{ $t('optimization.titles.result_settings') }}
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <optimization-parameters v-model="general_parameters" :process="process" :info-texts="infoTexts" @continue="continueOne" @abort="abort"></optimization-parameters>
            </v-stepper-content>

            <v-stepper-content step="2">
              <optimization-profiles v-model="profiles" :process="process" :variants="variants" :info-texts="infoTexts" @continue="continueTwo" @abort="abort"></optimization-profiles>
            </v-stepper-content>

            <v-stepper-content step="3">
              <variant-picklist v-if="variant_select_type === 0" :process="process" :variants="variants" @continue="continueThree" @abort="abort"></variant-picklist>
              <variant-question-selection v-else :process="process" :variants="variants" @continue="continueThree" @abort="abort"></variant-question-selection>
            </v-stepper-content>

            <v-stepper-content step="4">
              <restrictions :parameters="process.parameters" :variants="variants" :variant_selection="selection" @continue="continueFour" @abort="abort"></restrictions>
            </v-stepper-content>

            <v-stepper-content step="5">
              <optimization-result-settings :value="result_settings" @continue="continueFive" @abort="abort"></optimization-result-settings>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <DialogCardEditor v-model="dialogDescription" max-width="500px" :title="$t('optimization.titles.send')" @save="startOptimization" :cancel="false">
      <v-text-field :label="$t('variants_definition.labels.description')" v-model="description" counter="60"></v-text-field>
    </DialogCardEditor>

  </v-container>
</template>

<script>
import OptimizationProfiles from "./OptimizationProfiles";
import VariantPicklist from "./VariantPicklist";
import VariantQuestionSelection from "./VariantQuestionSelection";
import Restrictions from "./Restrictions";
import DialogCardEditor from "./DialogCardEditor";
import OptimizationParameters from "./OptimizationParameters";
import OptimizationResultSettings from "./OptimizationResultSettings";
export default {
  name: "Optimization",
  components: {
    OptimizationResultSettings,
    OptimizationParameters,
    DialogCardEditor, Restrictions, VariantQuestionSelection, VariantPicklist, OptimizationProfiles},
  data () {
    return {
      def_step: 1,
      variant_select_type: 0,
      profiles: [],
      general_parameters: {},
      selection: [],
      variants_conditions: [],
      result_settings: {
        n_list: 10,
        costs_opt: {
          exec: false,
          price_kwh: 0.23,
          amortisation_time: 2,
          assembly_costs: 10000
        }
      },
      description: '',
      dialogDescription: false
    }
  },

  props: {
    process: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    infoTexts: {
      type: Array,
      required: true
    }
  },

  computed: {
    genericName() {
      return this.process.view_name + ' - ' + new Date().toLocaleString();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      let defItem = {};
      this.process.parameters.forEach(p => { if (p.general) {
        defItem[p.variable_name] = p.defaults === '' ? 0 : p.defaults.split(',')[0];
      } });
      this.general_parameters = Object.assign({}, defItem);
      if (Object.keys(this.general_parameters).length === 0) {
        this.def_step = 2;
      }
    },
    abort() {
      this.$router.push({ name: 'ProcessOverview', params: { type: this.process.api_name, process: this.process } });
    },
    continueOne() {
      this.def_step = 2;
    },
    continueTwo(select_type) {
      this.variant_select_type = select_type;
      if (this.variants.length > 1) {
        this.def_step = 3;
      } else {
        this.selection.push(this.variants[0].id);
        this.def_step = 4;
      }
    },
    continueThree(param) {
      if (param) {
        this.selection = [...param];
      }
      this.def_step = 4;
    },
    continueFour(param) {
      if (param) {
        this.variants_conditions = [...param];
      }
      this.def_step = 5;
    },
    continueFive() {
      this.description = this.genericName;
      this.dialogDescription = true;
    },
    startOptimization() {
      this.dialogDescription = false;
      let requestData = {
        description: this.description,
        result_settings: this.result_settings,
        process: {
          id: this.process.id,
          api_name: this.process.api_name,
          view_name: this.process.view_name
        },
        general_parameters: this.general_parameters,
        process_profiles: this.profiles,
        variants_conditions: this.variants_conditions
      };
      this.$http.post('problems/' + this.process.id, requestData).
          then((response) => {
            if (response.status < 400) {
              this.$router.push({
                name: 'OptimizationResult',
                params: {type: this.process.api_name, process: this.process, timestamp: response.data, request: requestData }
              });
            } else {
              this.$router.push({
                name: 'OptimizationResult',
                params: {type: this.process.api_name, process: this.process, timestamp: response.data, result: response.statusText, request: requestData }
              });
            }
          }
      ).catch((error) => {
        let msg = error.response ? `<p>${error.response.status}</p><p>${error.response.data}</p>` :
            (error.request ? error.request : error.message);
        this.$router.push({
          name: 'OptimizationResult',
          params: {type: this.process.api_name, timestamp: 'ERROR', result: msg, request: requestData}
        });
      });
    }
  }
}
</script>

<style scoped>

</style>