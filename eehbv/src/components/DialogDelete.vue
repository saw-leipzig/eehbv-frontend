<template>
  <v-dialog v-model="value" max-width="400px">
    <v-card>
      <v-card-title class="headline">Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('abort')">Abbrechen</v-btn>
        <v-btn color="green darken-1" text @click="$emit('delete')">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogDelete",

  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>

</style>