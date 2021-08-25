<template>
  <v-container>
    <v-row>
      <v-col cols="12"><h2>Optimierungsdefinition {{process.view_name}}</h2></v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-stepper v-model="def_step">
          <v-stepper-header>
            <v-stepper-step :complete="def_step > 1" color="green" step="1">
              Prozessparameter
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 2" color="green" step="2">
              Variantenauswahl
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" color="green">
              Nebenbedingungen
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <optimization-parameters v-model="parameters" :process="process" :info-texts="infoTexts" @continue="continueOne" @abort="abort"></optimization-parameters>
            </v-stepper-content>

            <v-stepper-content step="2">
              <variant-picklist v-if="variant_select_type === 0" :process="process" :variants="variants" @continue="continueTwo" @abort="abort"></variant-picklist>
              <variant-question-selection v-else :process="process" :variants="variants" @continue="continueTwo" @abort="abort"></variant-question-selection>
            </v-stepper-content>

            <v-stepper-content step="3">
              <restrictions :process="process" :variants="variants" :variant_selection="selection" @continue="continueThree" @abort="abort"></restrictions>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OptimizationParameters from "./OptimizationParameters";
import VariantPicklist from "./VariantPicklist";
import VariantQuestionSelection from "./VariantQuestionSelection";
import Restrictions from "./Restrictions";
export default {
  name: "Optimization",
  components: {Restrictions, VariantQuestionSelection, VariantPicklist, OptimizationParameters},
  data () {
    return {
      def_step: 1,
      variant_select_type: 0,
      parameters: [],
      selection: []
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

  methods: {
    log() {
      //console.log(this.selection);
    },
    abort() {
      this.$router.push({ name: 'ProcessOverview', params: { type: this.process.api_name, process: this.process } });
    },
    continueOne(select_type) {
      this.variant_select_type = select_type;
      this.def_step = 2;
    },
    continueTwo(param) {
      if (param) {
        this.selection = [...param];
      }
      this.def_step = 3;
    },
    continueThree() {
      this.def_step = 1;
      // ToDo: post problem definition and load result...
    }
  }
}
</script>

<style scoped>

</style>