<template>
  <div>
    <h2>{{$t('solver_definition.labels.code')}}</h2>
    <v-row>
      <v-col cols="12">
        <v-switch v-model="value.use_solver" :label="$t('solver_definition.labels.custom')"></v-switch>
      </v-col>
    </v-row>
    <v-textarea v-model="value.code"></v-textarea>
  </div>
</template>

<script>
export default {
  name: "SolverDefinition",

  data: () => ({
  }),

  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>