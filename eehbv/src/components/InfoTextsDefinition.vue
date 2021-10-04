<template>
  <div>
    <h2>Hilfetext für Prozessparameter</h2>
    <v-textarea v-model="value[0].text"></v-textarea>
    <h2>Hilfetext für Nebenbedingungen</h2>
    <v-textarea v-model="value[1].text"></v-textarea>
  </div>
</template>

<script>
export default {
  name: "InfoTextsDefinition",

  props: {
    value: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>