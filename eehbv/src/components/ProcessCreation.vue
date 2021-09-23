<template>
  <v-container>
    <v-row>
      <v-col cols="12"><h2>Neuer Prozess</h2></v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-stepper v-model="def_step">
          <v-stepper-header>
            <v-stepper-step :complete="def_step > 1" color="green" step="1">
              Prozess
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="def_step > 2" color="green" step="2">
              Varianten
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" color="green">
              Variantenauswahl
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="4" color="green">
              Solver
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <EditNewWrapper :context-new="true" :info-text="infoTexts[0]" @ok="continueOne" @abort="abort">
                <ProcessDefinition v-model="process"></ProcessDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="2">
              <EditNewWrapper :context-new="true" :info-text="infoTexts[1]" @ok="continueTwo" @abort="abort">
                <VariantsDefinition v-model="variants" :process="process"></VariantsDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="3">
              <EditNewWrapper :context-new="true" :info-text="infoTexts[2]" @ok="continueThree" @abort="abort">
                <VariantSelectionDefinition v-model="variants"></VariantSelectionDefinition>
              </EditNewWrapper>
            </v-stepper-content>

            <v-stepper-content step="4">
              <EditNewWrapper :context-new="true" :info-text="infoTexts[3]" @ok="continueFour" @abort="abort">
                <SolverDefinition v-model="solver"></SolverDefinition>
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
export default {
  name: "ProcessCreation",
  components: {VariantSelectionDefinition, SolverDefinition, VariantsDefinition, ProcessDefinition, EditNewWrapper},
  data () {
    return {
      def_step: 1,
      process: {
        view_name: '',
        api_name: '',
        variant_tree: false,
        process_parameters: []
      },
      variants: [],
      solver: '',
      infoTexts: [
        '<p>Infotext <em>Prozessdefinition</em><p>',
        '<p>Infotext <em>Varientendefintion</em><p>',
        '<p>Infotext <em>Variantenauswahldefinition</em><p>',
        '<p>Infotext <em>Solver</em><p>'
      ]
    }
  },

  created() {
    //
  },

  methods: {
    continueOne() {
      this.def_step = 2;
    },
    continueTwo() {
      this.def_step = 3;
    },
    continueThree() {
      this.def_step = 4;
    },
    continueFour() {
      this.def_step = 1;
    },
    abort() {
      this.$router.push({ name: 'Process' });
    }
  }
}
</script>

<style scoped>

</style>