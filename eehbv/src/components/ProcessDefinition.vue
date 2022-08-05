<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field :label="$t('process_definition.labels.view_name')" v-model="value.view_name" counter="40"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field :label="$t('process_definition.labels.api_name')" v-model="value.api_name" counter="40" :rules="api_name_rules"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select :items="selectionOptions" v-model="value.variant_tree" :label="$t('process_definition.labels.variant_tree')"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ParameterList :parameters="value.process_parameters" @edit="editParam" @delete="deleteParam"></ParameterList>
        </v-col>
      </v-row>
    </v-container>

    <DialogCardEditor v-model="dialogEditParam" max-width="600px" :title="parameterEditTitle" @save="saveParam" @close="closeEditParam">
      <v-row>
        <v-col cols="6">
          <v-text-field :label="$t('process_definition.labels.name')" v-model="editedParam.name" counter="40" :error-messages="nameErrors"
                        @input="$v.editedParam.name.$touch" @blur="$v.editedParam.name.$touch"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field :label="$t('process_definition.labels.unit')" v-model="editedParam.unit" counter="40" :error-messages="unitErrors"
                        @input="$v.editedParam.unit.$touch" @blur="$v.editedParam.unit.$touch"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field :label="$t('process_definition.labels.variable_name')" v-model="editedParam.variable_name"
                        counter="40" :error-messages="varErrors" @input="$v.editedParam.variable_name.$touch"
                        @blur="$v.editedParam.variable_name.$touch"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select :items="propOptions" :label="$t('process_definition.labels.material_property')" v-model="editedParam.material_properties_id"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field :label="$t('process_definition.labels.defaults')" v-model="editedParam.defaults"
                        :disabled="editedParam.material_properties_id !== null"
                        counter="30" :error-messages="defaultsErrors" @input="$v.editedParam.defaults.$touch"
                        @blur="$v.editedParam.defaults.$touch"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <!-- ToDo: Tooltips -->
        <v-col cols="6">
          <v-switch v-model="editedParam.general" :label="$t('process_definition.labels.general')"></v-switch>
        </v-col>
        <v-col cols="6">
          <v-switch v-model="editedParam.dependent" :label="$t('process_definition.labels.dependent')"></v-switch>
        </v-col>
      </v-row>
      <v-row v-if="editedParam.dependent">
        <v-col cols="6">
          <v-text-field v-model="editedParam.derived_parameter" :label="$t('process_definition.labels.derived_param')"
                        counter="20" :error-messages="derivedErrors" @input="$v.editedParam.derived_parameter.$touch"
                        @blur="$v.editedParam.derived_parameter.$touch"></v-text-field>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteParam" @abort="closeDeleteParam" @delete="deleteParamConfirm"></DialogDelete>

  </div>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import ParameterList from "./ParameterList";
import {mapGetters} from "vuex";
import { required, maxLength, helpers } from 'vuelidate/lib/validators'
const snake = helpers.regex('snake', /^[a-z_]*$/);
const numbers = helpers.regex('numbers', /^(?!,$)[\d,.]+$/);

export default {
  name: "ProcessDefinition",
  components: {ParameterList, DialogCardEditor, DialogDelete},

  validations: {
    editedParam: {
      name: { required, maxLength: maxLength(40) },
      unit: { maxLength: maxLength(40) },
      variable_name: { required, maxLength: maxLength(40), snake,
        varConvention(variable_name) { return variable_name.startsWith('p_'); }
      },
      material_properties_id: {},
      defaults: { maxLength: maxLength(30), numbers },
      dependent: {},
      derived_parameter: { maxLength: maxLength(40), snake,
        derConvention(derived_parameter) { return !this.editedParam.dependent ||
            (derived_parameter !== null && derived_parameter.startsWith('d_'));
      }
      }
    }
  },

  data() {
    return {
      dialogEditParam: false,
      dialogDeleteParam: false,
      selectionOptions: [
        {text: this.$t('process_definition.selects.list'), value: false},
        {text: this.$t('process_definition.selects.tree'), value: true}
      ],
      api_name_rules: [
        v => v.length <= 40 || this.$t("general.validation.max40"),
        v => v.length > 0 || this.$t("general.validation.required")
      ],
      editedParamIndex: -1,
      editedParam: {
        name: '', variable_name: '', unit: '', material_properties_id: null,
        dependent: false, derived_parameter: null, dependency: null
      }
    }
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['properties'/*, 'propertyById'*/]),
    parameterEditTitle() {
      return this.editedParamIndex < 0 ? this.$t('general.editing.create') : this.$t('general.editing.edit');
    },
    propOptions() {
      return [{ text: ' ---', value: null }, ...this.properties.map(p => { return { text: p.property, value: p.id } })];
    },
    nameErrors() {
      let errors = [];
      if (!this.$v.editedParam.name.$dirty) return errors;
      !this.$v.editedParam.name.required && errors.push(this.$t('general.validation.required'));
      !this.$v.editedParam.name.maxLength && errors.push(this.$t('general.validation.max40'));
      return errors;
    },
    varErrors() {
      let errors = [];
      if (!this.$v.editedParam.variable_name.$dirty) return errors;
      !this.$v.editedParam.variable_name.required && errors.push(this.$t('general.validation.required'));
      !this.$v.editedParam.variable_name.maxLength && errors.push(this.$t('general.validation.max20'));
      !this.$v.editedParam.variable_name.snake && errors.push(this.$t('general.validation.snake'));
      !this.$v.editedParam.variable_name.varConvention && errors.push(this.$t('process_definition.validation.startsWithPLowDash'));
      return errors;
    },
    defaultsErrors() {
      let errors = [];
      if (!this.$v.editedParam.defaults.$dirty) return errors;
      !this.$v.editedParam.defaults.maxLength && errors.push(this.$t('general.validation.max30'));
      !this.$v.editedParam.defaults.numbers && errors.push(this.$t('general.validation.numbers'));
      return errors;
    },
    derivedErrors() {
      let errors = [];
      if (!this.$v.editedParam.derived_parameter.$dirty) return errors;
      !this.$v.editedParam.derived_parameter.maxLength && errors.push(this.$t('general.validation.max20'));
      !this.$v.editedParam.derived_parameter.snake && errors.push(this.$t('general.validation.snake'));
      !this.$v.editedParam.derived_parameter.derConvention && errors.push(this.$t('process_definition.validation.startsWithDLowDash'));
      return errors;
    },
    unitErrors() {
      let errors = [];
      if (!this.$v.editedParam.name.$dirty) return errors;
      !this.$v.editedParam.name.maxLength && errors.push(this.$t('general.validation.max40'));
      return errors;
    }
  },

  created() {
    if (this.properties.length < 1) {
      this.$store.dispatch('initProperties');
    }
  },

  methods: {
    editParam(index) {
      this.editedParam = Object.assign({},
          index < 0 ?
                { name: '', variable_name: '', unit: '', material_properties_id: null, restricting: false,
                  dependent: false, derived_parameter: null, min_column: null, max_column: null, dependency: null } :
                this.value.process_parameters[index]);
      this.editedParamIndex = index;
      this.dialogEditParam = true;
    },
    saveParam() {
      // ToDo: check for inconsistencies - material property can't be restricted
      this.$v.editedParam.$touch();
      if (this.$v.editedParam.$invalid) {
        return;
      }
      if (this.editedParamIndex < 0) {
        this.value.process_parameters.push(this.editedParam);
      } else {
        this.value.process_parameters.splice(this.editedParamIndex, 1, this.editedParam);
      }
      this.closeEditParam();
    },
    closeEditParam() {
      this.editedIndex = -1;
      this.$v.editedParam.$reset();
      this.dialogEditParam = false;
    },
    deleteParam(index) {
      this.editedParamIndex = index;
      this.dialogDeleteParam = true;
    },
    deleteParamConfirm() {
      this.value.process_parameters.splice(this.editedParamIndex, 1);
      this.closeDeleteParam();
    },
    closeDeleteParam() {
      this.editedIndex = -1;
      this.dialogDeleteParam = false;
    }
  }
}
</script>

<style scoped>

</style>