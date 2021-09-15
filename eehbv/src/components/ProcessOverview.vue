<template>
  <v-container>
    <v-row>
      <v-col cols="6"><h2>{{process.view_name}}</h2></v-col>

      <v-col cols="6">
        <v-btn :to="{ name: 'Optimization', params: { type: process.api_name, process: process, variants: variants, infoTexts: infoTexts } }">Optimierung definieren</v-btn>
        <v-btn :to="{ name: 'Process' }">Prozessliste</v-btn>
      </v-col>
    </v-row>

    <v-container>
      <v-row>
        <v-col cols="12" >
          <v-card>
            <v-card-title>Prozessparameter</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="param in process.parameters" :key="param.id">{{param.name}} / {{param.unit}}</v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" >
          <v-card>
            <v-card-title>Varianten</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="variant in variants" :key="variant.id">{{variant.name}}</v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "ProcessOverview",

  data: () => ({
    variants: [],
    infoTexts: [],
    dialog: false
  }),

  props: {
    process: {
      type: Object,
      required: true
    }
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
    log: function (val) {
      console.log(val);
    }
  }
}
</script>

<style scoped>

</style>