<template>
  <div>
    <h2>{{$t('info_texts_definition.labels.help_process_parameters')}}</h2>
    <v-textarea v-model="value[0].text"></v-textarea>
    <h2>{{$t('info_texts_definition.labels.help_constraints')}}</h2>
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