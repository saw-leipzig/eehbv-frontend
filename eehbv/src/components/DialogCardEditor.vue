<template>
  <v-dialog v-model="value" :max-width="maxWidth">
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="$emit('save')" :disabled="disabledSave">Speichern</v-btn>
        <v-btn color="green darken-1" text @click="$emit('close')">Abbrechen</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogCardEditor",

  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    maxWidth: {
      type: String,
      required: false,
      default: 'none'
    },
    disabledSave: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>

</style>