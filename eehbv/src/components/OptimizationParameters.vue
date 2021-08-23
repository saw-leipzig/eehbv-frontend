<template>
  <div>
    <v-card class="mb-12" color="grey lighten-1" height="300px"></v-card>
    <v-dialog v-model="dialog" width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" v-bind="attrs" v-on="on">Weiter</v-btn>
      </template>

      <v-card>
        <v-card-title>Variantenauswahl</v-card-title>
        <v-card-actions>
          <v-btn @click="continueOne(0);">Pickliste</v-btn>
          <v-btn @click="continueOne(1);">Fragen</v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>

    <v-btn text @click="$emit('abort')">
      Abbruch
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "OptimizationParameters",

  data: () => ({
    dialog: false
  }),

  methods: {
    log() {
      //console.log(this.selection);
    },
    continueOne(select_type) {
      this.dialog = false;
      this.$emit('continue', select_type);
    }
  }
}
</script>

<style scoped>

</style>