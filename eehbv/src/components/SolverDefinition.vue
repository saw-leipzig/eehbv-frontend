<template>
  <div>
    <h2>Solver-Code</h2>
    <v-textarea v-model="value"></v-textarea>
  </div>
</template>

<script>
export default {
  name: "SolverDefinition",

  data: () => ({
  }),

  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>