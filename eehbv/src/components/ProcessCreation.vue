<template>
  <v-container>
    <v-row>
      <v-col cols="12"><h2>{{$t("process_creation.titles.new_process")}}</h2></v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-stepper v-model="def_step">
          <v-stepper-header>
            <v-stepper-step :complete="def_step > 1" color="green" step="1">
              {{$t("process_creation.labels.process_definition")}}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 2" color="green" step="2">
              {{$t("process_creation.labels.functions")}}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 3" color="green" step="3">
              {{$t("process_creation.labels.variants_definition")}}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 4" step="4" color="green">
              {{$t("process_creation.labels.variant_selection_definition")}}
            </v-stepper-step>

            <v-divider></v-divider>

<!--            <v-stepper-step :complete="def_step > 5" step="5" color="green">
              {{$t("process_creation.labels.parameters")}}
            </v-stepper-step>

            <v-divider></v-divider>-->

            <v-stepper-step :complete="def_step > 6" step="6" color="green">
              {{$t("process_creation.labels.solver_definition")}}
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="7" color="green">
              {{$t("process_creation.labels.info_texts_definition")}}
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <EditNewWrapper :context-new="true" :info-text="info[0]" :disabled="disabledProcess"
                              :title="$t('process_creation.titles.process_definition')" @ok="continueOne" @abort="abort">
                <ProcessDefinition v-model="process" :processes="processes"></ProcessDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="2">
              <EditNewWrapper :context-new="true" :info-text="info[1]" :disabled="disabledFunctions"
                              :title="$t('process_creation.labels.functions')" @ok="continueTwo" @abort="abort">
                <FunctionsDefinition v-model="functions"></FunctionsDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="3">
              <EditNewWrapper :context-new="true" :info-text="info[2]" :disabled="disabledVariants"
                              :title="$t('process_creation.titles.variants_definition')" @ok="continueThree" @abort="abort">
                <VariantsDefinition v-model="variants" :process="process" :loss_functions="functions"></VariantsDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="4">
              <EditNewWrapper :context-new="true" :info-text="info[3]"
                              :title="process.variant_tree ? $t('process_creation.titles.variant_selection_definition_tree') : $t('process_creation.titles.variant_selection_definition_list')"
                              @ok="continueFour" @abort="abort">
                <VariantSelectionDefinition v-model="variant_selection" :variants="variants" :process="process"></VariantSelectionDefinition>
              </EditNewWrapper>
            </v-stepper-content>

<!--            <v-stepper-content step="5">
              <EditNewWrapper :context-new="true" :info-text="info[4]" :title="$t('process_definition.titles.parameters')"
                              @ok="continueFive" @abort="abort">
                <ParameterDependencyDefinition v-model="process.process_parameters" :variants="variants"></ParameterDependencyDefinition>
              </EditNewWrapper>
            </v-stepper-content>-->

            <v-stepper-content step="6">
              <EditNewWrapper :context-new="true" :info-text="info[5]" @ok="continueSix" @abort="abort">
                <SolverDefinition v-model="solver"></SolverDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="7">
              <EditNewWrapper :context-new="true" :info-text="info[6]"
                              :title="$t('process_creation.titles.info_texts_definition')"
                              @ok="continueSeven" @abort="abort">
                <InfoTextsDefinition v-model="infoTexts"></InfoTextsDefinition>
              </EditNewWrapper>
            </v-stepper-content>

          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EditNewWrapper from "./EditNewWrapper";
import ProcessDefinition from "./ProcessDefinition";
import VariantsDefinition from "./VariantsDefinition";
import VariantSelectionDefinition from "./VariantSelectionDefinition";
import SolverDefinition from "./SolverDefinition";
import InfoTextsDefinition from "./InfoTextsDefinition";
import ParameterDependencyDefinition from "./ParameterDependencyDefinition";
import FunctionsDefinition from "./FunctionsDefinition";
import {mapGetters} from "vuex";
const snake = /^[a-z_]*$/;

export default {
  name: "ProcessCreation",
  components: {
    FunctionsDefinition,
    ParameterDependencyDefinition,
    InfoTextsDefinition,
    VariantSelectionDefinition, SolverDefinition, VariantsDefinition, ProcessDefinition, EditNewWrapper},
  data () {
    return {
      def_step: 1,
      process: {
        view_name: '',
        api_name: '',
        variant_tree: false,
        process_parameters: []
      },
      functions: [],
      variants: [],
      variant_selection: {
        list: [],
        tree: [{
          id: 'root',
          question: '',
          info: '',
          excludes: [],
          exclude_choices: [],
          answers: [
              { response: 'yes', question: '', excludes: [], exclude_choices: [], id: 'y', answers: [] },
              { response: 'no', question: '', excludes: [], exclude_choices: [], id: 'n', answers: []}
          ]
        }]
      },
      solver: { code: '', use_solver: false },
      infoTexts: [ {type: 1, type_id: null, position: 3, text: ''}, {type: 1, type_id: null, position: 4, text: ''} ],
      info: [
          this.$t("process_creation.info.definition"),
          this.$t("process_creation.info.functions"),
          this.$t("process_creation.info.variants"),
          this.$t("process_creation.info.selection"),
          this.$t("process_creation.info.parameters"),
          this.$t("process_creation.info.solver"),
          this.$t("process_creation.info.infoTexts")
      ],
      varTesting: false
    }
  },

  created() {
    if (this.process.length < 1) {
      this.$store.dispatch('initProcesses');
    }

    if (this.varTesting) {  // Test variant selection settings, predefined data
      this.process = Object.assign({},{
        api_name: 'edge_banding_test', variant_tree: false, view_name: 'Kantenanleimmaschine_Test',
        process_parameters:[
            { name: 'Fräsbreite', variable_name: 'p_milling_width', unit: 'mm', material_properties_id: null }//,
//             dependent: false, derived_parameter: null, dependency: null }
        ]
      });
      this.variants.push(...[
          { name: 'Variante 1', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'},
            {position: 1, description: 'Grindermotor', variable_name: 'v_grinding_motor', component_api_name: 'motors'}] },
          { name: 'Variante 2', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'},
            {position: 1, description: 'Antriebsmotor', variable_name: 'v_forward_motor', component_api_name: 'motors'}] },
          { name: 'Variante 3', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 4', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 5', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 6', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 7', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 8', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 9', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 10', variant_functions: [], variant_restrictions: [],
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
      ]);
/*      this.variants.push(...[
          { name: 'Variante 1', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'},
            {position: 1, description: 'Grindermotor', variable_name: 'v_grinding_motor', component_api_name: 'motors'}] },
          { name: 'Variante 2', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'},
            {position: 1, description: 'Antriebsmotor', variable_name: 'v_forward_motor', component_api_name: 'motors'}] },
          { name: 'Variante 3', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 4', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 5', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 6', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 7', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 8', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 9', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
          { name: 'Variante 10', target_func: 'x', target_func_python: 'x',
            variant_components: [{position: 0, description: 'Fräsmotor', variable_name: 'v_milling_motor', component_api_name: 'motors'}] },
      ]);*/
    }
  },

  computed: {
    ...mapGetters(['processes']),
    disabledProcess() {
      return this.process.view_name === '' || this.process.api_name === '' || typeof this.process.variant_tree === 'undefined' ||
          !snake.test(this.process.api_name) || this.processes.map(t => t.api_name).includes(this.process.api_name) ||
          this.processes.map(t => t.view_name).includes(this.process.view_name) || this.process.view_name.length > 40 ||
          this.process.api_name.length > 30;
    },
    disabledFunctions() {
      return this.functions.length < 1;
    },
    disabledVariants() {
      return this.variants.length < 1;
    }
  },

  methods: {
    specialParametersPresent() {
      return this.process.process_parameters.some(p => p.dependent || p.restricting);
    },
    continueOne() {
      this.def_step = 2;
    },
    continueTwo() {
      this.def_step = 3;
    },
    continueThree() {
      this.def_step = this.variants.length > 1
          ? 4
          : 6;// (this.specialParametersPresent() ? 5 : 6);
    },
    continueFour() {
      this.def_step = 6;// this.specialParametersPresent() ? 5 : 6;
    },
    continueFive() {
      this.def_step = 6;
    },
    continueSix() {
      this.def_step = 7;
    },
    continueSeven() {
      let requestData = {
        process: this.process,
        functions: this.functions,
        //variants: this.variants,
        variants: this.variants.map(v => { return { name: v.name, variant_components: v.variant_components,
          variant_restrictions: v.variant_restrictions,
          variant_functions: v.variant_functions.map(f => { return {position: f.position, is_loss: f.is_loss,
            loss_function_description: f.loss_function_description, variable_name: f.variable_name, description: f.description,
            eval_after_position: f.eval_after_position, aggregate: f.aggregate,
            parameter_list: '(' + f.parameter_list.map(p => p.value).join(', ') + ')'}})
        }; }),
        variant_selection: {
          list: this.variant_selection.list,
          tree: this.process.variant_tree ? this.dbTree() : this.variant_selection.tree
        },
        solver: this.solver,
        infoTexts: this.infoTexts
      };
      this.$http.post('processes', requestData).
          then((response) => {
            if (response.status < 400) {
              this.$router.push({ name: 'Process' });
            } else {
              // ToDo: error handling
            }
          }
      ).catch((error) => {
        // ToDo: error handling
      });
      this.def_step = 1;
    },
    abort() {
      this.$router.push({ name: 'Process' });
    },
    dbTree() {
      return {
        question: this.variant_selection.tree[0].question,
        yes: this.treeQuestionBranch(this.variant_selection.tree[0].answers[0]),
        no: this.treeQuestionBranch(this.variant_selection.tree[0].answers[1])
      };
    },
    treeQuestionBranch(node) {
      return {
        excludes: [...node.excludes],
        question: node.question === '' ? null : node.question,
        yes: node.answers.length < 1 ? null : this.treeQuestionBranch(node.answers[0]),
        no: node.answers.length < 1 ? null : this.treeQuestionBranch(node.answers[1])
      };
    }
  }
}
</script>

<style scoped>

</style>