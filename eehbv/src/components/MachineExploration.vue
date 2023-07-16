<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12"><h2 v-text="'Maschinenexploration ' + process.view_name + ' - ' + variant.name"></h2></v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>{{ machineDefinition.name }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-expansion-panels>
                  <v-expansion-panel v-for="comp in Object.keys(machineDefinition.components)" :key="comp">
                    <v-expansion-panel-header>{{ comp }}</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div><b>Hersteller: </b>{{ machineDefinition.components[comp].manufacturer }}</div>
                      <div><b>Modell: </b> {{ machineDefinition.components[comp].name }}</div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-tabs>
            <v-tab>Parameterbereiche</v-tab>
            <v-tab>Optimierung</v-tab>

            <v-tab-item>
              <v-row>
                <v-col cols="4">
                  <v-card class="overflow-y-auto" max-height="400" v-scroll.self="none">
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>Prozessparameter</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div v-for="param in process.parameters" v-if="!param.general" :key="param.name">
                            <v-combobox v-if="param.material_properties_id != null"
                                        v-model="parameters[param.variable_name]"
                                        :items="parameterPropOptions(param.material_properties_id)"
                                        :label="param.name + ' [' + param.unit + ']'"
                                        type="text"
                                        @change="explore"
                            ></v-combobox>
                            <v-combobox v-else-if="param.defaults.includes(',')"
                                        v-model="parameters[param.variable_name]"
                                        :items="parameterOptions(param.defaults)"
                                        :label="param.name + ' [' + param.unit + ']'"
                                        type="text"
                                        @change="explore"
                            ></v-combobox>
                            <v-text-field v-else
                                          v-model="parameters[param.variable_name]"
                                          :label="param.name + ' [' + param.unit + ']'"
                                          type="number"
                                          @change="explore"
                            ></v-text-field>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel>
                        <v-expansion-panel-header>Generelle Prozessparameter</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div v-for="param in process.parameters" v-if="param.general" :key="param.name">
                            <v-combobox v-if="param.material_properties_id != null"
                                        v-model="parameters[param.variable_name]"
                                        :items="parameterPropOptions(param.material_properties_id)"
                                        :label="param.name + ' [' + param.unit + ']'"
                                        type="text"
                                        @change="explore"
                            ></v-combobox>
                            <v-combobox v-else-if="param.defaults.includes(',')"
                                        v-model="parameters[param.variable_name]"
                                        :items="parameterOptions(param.defaults)"
                                        :label="param.name + ' [' + param.unit + ']'"
                                        type="text"
                                        @change="explore"
                            ></v-combobox>
                            <v-text-field v-else
                                          v-model="parameters[param.variable_name]"
                                          :label="param.name + ' [' + param.unit + ']'"
                                          type="number"
                                          @change="explore"
                            ></v-text-field>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </v-col>
                <v-col cols="8">
                  <div>Ergebnisanzeige</div>
                  <div v-if="!explorationResult">
                    <span color="red">Parameter nicht möglich: </span>
                    <span>{{failureMessage}}</span>
                  </div>
                  <div v-else>
                    <span>Leistung Total [Watt]: </span>
                    <span>{{explorationTotal}}</span>
                  </div>
                </v-col>
              </v-row>
            </v-tab-item>

            <v-tab-item></v-tab-item>

          </v-tabs>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import paramValues from "../mixins/paramValues";
import {mapGetters} from "vuex";

export default {
  name: "MachineExploration",
  mixins: [ paramValues ],

  data() {
    return {
      variant: {},
      process: {},
      parameters: {},
      explorationResult: true,
      explorationTotal: 0,
      explorationLosses: [],
      failureMessage: ''
    }
  },

  props: {
    machineDefinition: {
      type: Object,
      required: true
    },
    processId: {
      type: Number,
      required: true
    },
    variantId: {
      type: Number,
      required: true
    },
    variantName: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters(['prop_values'])
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      if (!this.machineDefinition) {
        this.$router.push({ name: 'History' });
      }
      if (this.prop_values.length < 1) {
        this.$store.dispatch('initProperties');
      }
      this.$http.get('variants/' + this.variantId).
              then((response) => {
                  this.variant = Object.assign({}, response.data);
          });
      this.$http.get('processes/' + this.processId).
              then((response) => {
                  this.process = Object.assign({}, response.data);
                  let defItem = {};
                  this.process.parameters.forEach(p => {
                    defItem[p.variable_name] = p.defaults === '' ? 0 : p.defaults.split(',')[0];
                  });
                  this.parameters = Object.assign({}, defItem);
          });
    },
    explore() {
      let params = JSON.parse(JSON.stringify(this.parameters));
      Object.keys(params).forEach(key => {
        if (typeof params[key] === 'object') {
          params[key] = params[key].value;
        } else if (typeof params[key] === 'string') {
          params[key] = parseFloat(params[key]);
        }
        //params[key] = Number(params[key])
      });
      let model = {
        variant: this.variantId,
        machine: this.machineDefinition.components,
        parameters: params
      };
      this.$http.post('machines/' + this.variantId + '/explore', model).
          then((response) => {
            this.explorationResult = response.data.success;
            if (this.explorationResult) {
              this.explorationTotal = response.data.total;
              this.explorationLosses = response.data.losses;
            } else {
              this.failureMessage = response.data.msg;
            }
      })
    },
    optimize() {
/*      let params = JSON.parse(JSON.stringify(this.parameters));
      Object.keys(params).forEach(key => params[key] = Number(params[key]));
      let model = {
        variant: this.variantId,
        machine: this.machineDefinition.components,
        parameters: params
      };
      this.$http.post('machines/' + this.variantId + '/explore', model).
          then((response) => {
            this.explorationResult = response.data.success;
            if (this.explorationResult) {
              this.explorationTotal = response.data.total;
              this.explorationLosses = response.data.losses;
            }
      })*/
    }
  }
}
</script>

<style scoped>

</style>