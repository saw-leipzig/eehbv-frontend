<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12"><h2 v-text="$t('machines.titles.exploration') + ' ' + process.view_name + ' - ' + variant.name"></h2></v-col>
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
                      <div><b>{{$t('components.domain.manufacturer')}}: </b>{{ machineDefinition.components[comp].manufacturer }}</div>
                      <div><b>{{$t('components.domain.model')}}: </b> {{ machineDefinition.components[comp].name }}</div>
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
            <v-tab>{{$t('machines.titles.parameter_ranges')}}</v-tab>
            <v-tab>{{$t('machines.titles.optimization')}}</v-tab>

            <v-tab-item>
              <v-row>
                <v-col cols="4">
                  <v-card class="overflow-y-auto" max-height="400" v-scroll.self="none">
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>{{$t('machines.labels.process_parameters')}}</v-expansion-panel-header>
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
                        <v-expansion-panel-header>{{$t('machines.labels.general_parameters')}}</v-expansion-panel-header>
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
                  <div>{{$t('machines.labels.result')}}: </div>
                  <div v-if="!explorationResult">
                    <span color="red">{{$t('machines.labels.invalid_parameters')}}: </span>
                    <span>{{failureMessage}}</span>
                  </div>
                  <div v-else>
                    <span>{{$t('machines.labels.total_energy')}}: </span>
                    <span>{{explorationTotal}}</span>
                  </div>
                </v-col>
              </v-row>
            </v-tab-item>

            <v-tab-item>
              <v-row>
                <v-col cols="6">


                  <v-card class="overflow-y-auto" max-height="400" v-scroll.self="none">
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>{{$t('machines.labels.process_parameters')}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div v-for="(param, index) in process.parameters" v-if="!param.general" :key="param.name" v-bind:class="{ 'bg-light': oddParam(false, index) }">
                            <v-row>
                              <v-col cols="4">
                                <v-switch v-model="ranges[param.variable_name].vary" :label="$t('machines.labels.range')"></v-switch>
                              </v-col>
                              <v-col cols="8">
                              <v-combobox v-if="param.material_properties_id != null"
                                          v-model="ranges[param.variable_name].min"
                                          :items="parameterPropOptions(param.material_properties_id)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (min)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-combobox v-else-if="param.defaults.includes(',')"
                                          v-model="ranges[param.variable_name].min"
                                          :items="parameterOptions(param.defaults)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (min)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-text-field v-else
                                            v-model="ranges[param.variable_name].min"
                                            :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (min)' : '')"
                                            type="number"
                              ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row v-if="ranges[param.variable_name].vary">
                              <v-col cols="4">
                                <v-switch v-model="ranges[param.variable_name].discrete" :label="$t('machines.labels.discrete')"></v-switch>
                              </v-col>
                              <v-col cols="8">
                              <v-combobox v-if="param.material_properties_id != null"
                                          v-model="ranges[param.variable_name].max"
                                          :items="parameterPropOptions(param.material_properties_id)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (max)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-combobox v-else-if="param.defaults.includes(',')"
                                          v-model="ranges[param.variable_name].max"
                                          :items="parameterOptions(param.defaults)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (max)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-text-field v-else
                                            v-model="ranges[param.variable_name].max"
                                            :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (max)' : '')"
                                            type="number"
                              ></v-text-field>
                              </v-col>
                            </v-row>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                      <v-expansion-panel>
                        <v-expansion-panel-header>{{$t('machines.labels.general_parameters')}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div v-for="(param, index) in process.parameters" v-if="param.general" :key="param.name" v-bind:class="{ 'bg-light': oddParam(true, index) }">
                            <v-row>
                              <v-col cols="4">
                                <v-switch v-model="ranges[param.variable_name].vary" :label="$t('machines.labels.range')"></v-switch>
                              </v-col>
                              <v-col cols="8">
                              <v-combobox v-if="param.material_properties_id != null"
                                          v-model="ranges[param.variable_name].min"
                                          :items="parameterPropOptions(param.material_properties_id)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (min)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-combobox v-else-if="param.defaults.includes(',')"
                                          v-model="ranges[param.variable_name].min"
                                          :items="parameterOptions(param.defaults)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (min)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-text-field v-else
                                            v-model="ranges[param.variable_name].min"
                                            :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (min)' : '')"
                                            type="number"
                              ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row v-if="ranges[param.variable_name].vary">
                              <v-col cols="4">
                                <v-switch v-model="ranges[param.variable_name].discrete" :label="$t('machines.labels.discrete')"></v-switch>
                              </v-col>
                              <v-col cols="8">
                              <v-combobox v-if="param.material_properties_id != null"
                                          v-model="ranges[param.variable_name].max"
                                          :items="parameterPropOptions(param.material_properties_id)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (max)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-combobox v-else-if="param.defaults.includes(',')"
                                          v-model="ranges[param.variable_name].max"
                                          :items="parameterOptions(param.defaults)"
                                          :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (max)' : '')"
                                          type="text"
                              ></v-combobox>
                              <v-text-field v-else
                                            v-model="ranges[param.variable_name].max"
                                            :label="param.name + ' [' + param.unit + ']' + (ranges[param.variable_name].vary ? ' (max)' : '')"
                                            type="number"
                              ></v-text-field>
                              </v-col>
                            </v-row>
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>

                </v-col>
                <v-col cols="6">
                  <v-container>
                    <v-rows>
                      <v-row>
                        <v-btn @click="optimize">{{$t('machines.labels.optimize')}}</v-btn>
                      </v-row>
                      <v-row></v-row>
                      <v-row>
                        <span>{{$t('machines.labels.result')}}</span>
                      </v-row>
                      <div v-if="optRunning">
                        <v-row>
                          <v-progress-circular indeterminate color="green" size="70" width="7"></v-progress-circular>
                        </v-row>
                      </div>
                      <div v-else>
                        <v-row>{{optMessage}}</v-row>
                        <v-row>
                          <span>{{$t('machines.labels.best_result')}}: </span>
                          <span>{{bestValue}}</span>
                        </v-row>
                        <v-row v-for="param in process.parameters" v-if="ranges[param.variable_name].vary" :key="param.name">
                          <span>{{param.name + ' [' + param.unit + ']: '}}</span>
                          <span>{{optimalParameters[param.variable_name]}}</span>
                        </v-row>
                      </div>
                    </v-rows>
                  </v-container>
                </v-col>
              </v-row>
            </v-tab-item>

          </v-tabs>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
import paramValues from "../mixins/paramValues";
import {mapGetters} from "vuex";
import messageHandling from "../mixins/messageHandling";

export default {
  name: "MachineExploration",
  mixins: [ paramValues, messageHandling ],

  data() {
    return {
      variant: {},
      process: {},
      parameters: {},
      ranges: {},
      explorationResult: true,
      explorationTotal: 0,
      explorationLosses: [],
      failureMessage: '',
      optimalParameters: {},
      optRunning: false,
      optMessage: '',
      optHistory: []
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
    ...mapGetters(['prop_values']),
    bestValue() {
      return this.optHistory.length > 0 ? this.optHistory[this.optHistory.length - 1] : '';
    },
    generalOdds() {
      let odds = [];
      let c = 0;
      for (let i = 0; i < this.process.parameters.length; i++) {
        if (this.process.parameters[i].general) {
          c++;
          if (c % 2 === 0) {
            odds.push(i);
          }
        }
      }
      return odds;
    },
    odds() {
      let odds = [];
      let c = 0;
      for (let i = 0; i < this.process.parameters.length; i++) {
        if (!this.process.parameters[i].general) {
          c++;
          if (c % 2 === 0) {
            odds.push(i);
          }
        }
      }
      return odds;
    }
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
                  let defRange = {};
                  this.process.parameters.forEach(p => {
                    let val = p.defaults === '' ? 0 : p.defaults.split(',')[0];
                    defItem[p.variable_name] = val;
                    defRange[p.variable_name] = { min: val, max: val, vary: false, discrete: false};
                  });
                  this.parameters = Object.assign({}, defItem);
                  this.ranges = Object.assign({}, defRange);
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
      let params = JSON.parse(JSON.stringify(this.ranges));
      let breakMsg = '';
      Object.keys(params).forEach(key => {
        if (typeof params[key].min === 'object') {
          params[key].min = params[key].min.value;
        } else if (typeof params[key].min === 'string') {
          params[key].min = parseFloat(params[key].min);
        }
        if (params[key].vary) {
          if (typeof params[key].max === 'object') {
            params[key].max = params[key].max.value;
          } else if (typeof params[key].max === 'string') {
            params[key].max = parseFloat(params[key].max);
          }
        }
        if (params[key].vary && params[key].max < params[key].min) {
          breakMsg = $t('machines.validation.min_max') + key;
        }
      });
      if (breakMsg !== '') {
        this.notify(breakMsg);
        return;
      }
      let model = {
        variant: this.variantId,
        machine: this.machineDefinition.components,
        parameters: params
      };
      this.optRunning = true;
      this.optimalParameters = Object.assign({}, {});
      this.$http.post('machines/' + this.variantId + '/optimize', model).
          then((response) => {
            this.optimalParameters = Object.assign({}, response.data.parameters);
            this.optMessage = response.data.msg;
            this.optHistory = response.data.history;
            this.optRunning = false;
      }).catch(() => {
        this.optRunning = false;
      });
    },
    oddParam(general, index) {
      return (general)
          ? this.generalOdds.includes(index)
          : this.odds.includes(index);
    }
  }
}
</script>

<style scoped>
  .bg-light {
    background-color: lightgrey;
  }
</style>