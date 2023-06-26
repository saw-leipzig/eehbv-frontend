<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="9"></v-col>
        <v-col cols="3">
          <v-btn :to="{ name: 'Process' }">{{ $t('process_overview.labels.process_list') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-card>
      <v-card-title>
        <v-container>
          <v-row>
            <v-col cols="8">{{process.view_name}}</v-col>
            <v-col cols="4">
              <v-btn :to="{ name: 'Optimization', params: { type: process.api_name, process: process, variants: variants, infoTexts: infoTexts } }">
                {{ $t('process_overview.labels.define_opt') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>

      <v-card-text>

        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('process_definition.titles.parameters')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <ParameterList :parameters="process.parameters" :show-dep="true" :show-delete="false" :show-add="false"
                             :show-edit="false" :show-title="false"></ParameterList>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>{{ $t('process_creation.titles.variants_definition') }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <!--<v-list>
                <v-list-item v-for="variant in variants" :key="variant.id">{{ variant.name }}</v-list-item>
              </v-list>-->

              <v-card v-for="(variant, index) in variants" :key="index">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">{{ $t('variants_definition.labels.description') }}: {{ variant.name }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12"><b>{{ $t('components.titles.components') }}:</b> {{ componentList(variant) }}</v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-card>

            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-container>
          <v-row v-if="userRole > 1">
            <v-col cols="9"></v-col>
            <v-col cols="3">
              <v-btn color="green" :to="{ name: 'ProcessEdit', params: { id: process.id } }"><v-icon>mdi-pencil</v-icon></v-btn>

              <v-tooltip top color="red">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="red" @click="dialogDeleteProcess = true" v-bind="attrs" v-on="on"><v-icon>mdi-delete</v-icon></v-btn>
                </template>
                <v-icon>mdi-alert-outline</v-icon>
                <span>{{ $t('process_overview.tooltip.delete') }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>

      </v-card-text>
    </v-card>

    <DialogDelete v-model="dialogDeleteProcess" @abort="closeDeleteProcess" @delete="deleteProcessConfirm"></DialogDelete>
  </div>
</template>

<script>
import ParameterList from "./ParameterList";
import DialogDelete from "./DialogDelete";
import {mapGetters} from "vuex";

export default {
  name: "ProcessOverview",
  components: {DialogDelete, ParameterList},
  data: () => ({
    variants: [],
    infoTexts: [],
    panel: [0, 1],
    dialog: false,
    dialogDeleteProcess: false
  }),

  props: {
    process: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['userRole'])
  },

  created() {
    if (!this.process) {
      this.$router.push({ name: 'Process' });
    }
    this.initialize();
  },

  methods: {
    componentList(variant) {
      return variant.components.map(c => c.description).join(' ');
    },
    initialize() {
      this.$http.get('processes/' + this.process.id + '/variants').
              then((response) => {
                  this.variants = [...response.data.variants];
          });
      this.$http.get('processes/' + this.process.id + '/info_texts').
              then((response) => {
                  this.infoTexts = [...response.data.info_texts];
          });
    },
    deleteProcessConfirm() {
      this.$http.delete('processes/' + this.process.id).
        then(() => {
          this.closeDeleteProcess();
          this.$router.push({ name: 'Process' });
      });
    },
    closeDeleteProcess() {
      this.dialogDeleteProcess = false;
    },
    log: function (val) {
      console.log(val);
    }
  }
}
</script>

<style scoped>

</style>