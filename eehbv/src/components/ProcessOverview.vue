<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6"><h2>{{process.view_name}}</h2></v-col>

        <v-col cols="6">
          <v-btn :to="{ name: 'Optimization', params: { type: process.api_name, process: process, variants: variants, infoTexts: infoTexts } }">{{ $t('process_overview.labels.define_opt') }}</v-btn>
          <v-btn :to="{ name: 'Process' }">{{ $t('process_overview.labels.process_list') }}</v-btn>
        </v-col>
      </v-row>


      <v-container>
        <v-row>
          <v-col cols="12" >
            <ParameterList :parameters="process.parameters" :show-dep="true" :show-delete="false" :show-add="false" :show-edit="false"></ParameterList>
          </v-col>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <v-col cols="12" >
            <v-card>
              <v-card-title>{{ $t('process_creation.titles.variants_definition') }}</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item v-for="variant in variants" :key="variant.id">{{ variant.name }}</v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-row v-if="userRole > 2">
        <v-col cols="10"></v-col>
        <v-col cols="2">
          <v-tooltip top color="red">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="red" @click="dialogDeleteProcess = true" v-bind="attrs" v-on="on"><v-icon>mdi-delete</v-icon></v-btn>
            </template>
            <v-icon>mdi-alert-outline</v-icon>
            <span>Prozesstyp löschen. Achtung: Kann nicht rückgängig gemacht werden!</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>

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
      this.$http.delete('procceses/' + this.process.id).
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