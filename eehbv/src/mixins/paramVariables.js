export default {
  props: {
    process: {
      type: Object,
      required: true
    }
  },

  methods: {
    parameterByVarName(varName) {
      return this.process.parameters.find(p => p.variable_name === varName);
    }
  }
}