export default {
  data: () => ({
    dialogEditParam: false,
    dialogDeleteParam: false,
    editedParamIndex: -1,
    editedParam: { name: '', variable_name: '', unit: '', material_properties_id: null, restricting: false,
             dependent: false, derived_parameter: null, min_column: null, max_column: null, dependency: null }
  }),

  methods: {
    closeEditParam() {
      this.editedIndex = -1;
      //this.$v.editedParam.$reset();
      this.dialogEditParam = false;
    }
  }
}