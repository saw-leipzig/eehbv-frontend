<template>
  <v-container>
    <v-row>
      <v-col cols="6"><h2>{{process.view_name}}</h2></v-col>

      <v-col cols="6">
        <v-dialog v-model="dialog" width="400">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on">Optimierung definieren</v-btn>
          </template>

          <v-card>
            <v-card-title>Variantenauswahl</v-card-title>
            <v-card-actions>
              <v-btn :to="{ name: 'VariantPicklist', params: { type: process.api_name, process: process, variants: variants } }">Pickliste</v-btn>
              <v-btn :to="{ name: 'VariantQuestionSelection', params: { type: process.api_name, process: process, variants: variants } }">Fragen</v-btn>
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-col>
    </v-row>

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
    dialog: false
  }),

  props: {
    process: {
      type: Object,
      required: true
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$http.get('/api/v1/processes/' + this.process.id + '/variants').
              then((response) => {
                  this.variants = [...response.data.variants];
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