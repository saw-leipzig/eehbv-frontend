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
          <v-card>
            <v-card-title>Prozessparameter</v-card-title>
            <v-card-text>
              <v-row v-for="(param, index) in value.process_parameters" :key="index">
                <v-col cols="3">{{$t('process_definition.labels.name')}}: {{param.name}}</v-col>
                <v-col cols="2">{{$t('process_definition.labels.unit')}}: {{param.unit}}</v-col>
                <v-col cols="3">{{$t('process_definition.labels.variable_name')}}: {{param.variable_name}}</v-col>
                <v-col cols="2">{{$t('process_definition.labels.material_property')}}: {{propertyById(param.material_properties_id)}}</v-col>
                <v-col cols="1">
                  <v-icon small class="mr-2" @click="editParam(index)">mdi-pencil</v-icon>
                  <v-icon small @click="deleteParam(index)">mdi-delete</v-icon>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green" @click="editParam(-1)"><v-icon>mdi-plus</v-icon></v-btn>
            </v-card-actions>
          </v-card>
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
          <v-text-field :label="$t('process_definition.labels.variable_name')" v-model="editedParam.variable_name" counter="40" :error-messages="varErrors"
                        @input="$v.editedParam.variable_name.$touch" @blur="$v.editedParam.variable_name.$touch"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select :items="propOptions" :label="$t('process_definition.labels.material_property')" v-model="editedParam.material_properties_id"></v-select>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteParam" @abort="closeDeleteParam" @delete="deleteParamConfirm"></DialogDelete>

  </div>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import {mapGetters} from "vuex";
import { required, maxLength, helpers } from 'vuelidate/lib/validators'
const snake = helpers.regex('snake', /^[a-z_]*$/);

export default {
  name: "ProcessDefinition",
  components: {DialogCardEditor, DialogDelete},

  validations: {
    editedParam: {
      name: { required, maxLength: maxLength(40) },
      unit: { maxLength: maxLength(40) },
      variable_name: { required, maxLength: maxLength(40), snake,
        varConvention(variable_name) { return variable_name.startsWith('p_'); }
      },
      material_properties_id: {}
    }
  },

  data: () => ({
    dialogEditParam: false,
    dialogDeleteParam: false,
    selectionOptions: [
      { text: 'Liste', value: false },
      { text: 'Baum', value: true }
    ],
    api_name_rules: [ v => v.length <= 40 || 'Max 40 Zeichen', v => v.length > 0 || 'erforderlich' ],
    editedParamIndex: -1,
    editedParam: { name: '', variable_name: '', unit: '', material_properties_id: null }
  }),

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['properties', 'propertyById']),
    parameterEditTitle() {
      return this.editedParamIndex < 0 ? 'Prozessparameter anlegen' : 'Prozessparameter bearbeiten';
    },
    propOptions() {
      return [{ text: ' ---', value: null }, ...this.properties.map(p => { return { text: p.property, value: p.id } })];
    },
    nameErrors() {
      let errors = [];
      if (!this.$v.editedParam.name.$dirty) return errors;
      !this.$v.editedParam.name.required && errors.push(this.$t("general.validation.required"));
      !this.$v.editedParam.name.maxLength && errors.push(this.$t("general.validation.max40"));
      return errors;
    },
    varErrors() {
      let errors = [];
      if (!this.$v.editedParam.variable_name.$dirty) return errors;
      !this.$v.editedParam.variable_name.required && errors.push(this.$t("general.validation.required"));
      !this.$v.editedParam.variable_name.maxLength && errors.push(this.$t("general.validation.max40"));
      !this.$v.editedParam.variable_name.snake && errors.push(this.$t("general.validation.snake"));
      !this.$v.editedParam.variable_name.varConvention && errors.push(this.$t("process_definition.validation.startsWithPLowDash"));
      return errors;
    },
    unitErrors() {
      let errors = [];
      if (!this.$v.editedParam.name.$dirty) return errors;
      !this.$v.editedParam.name.maxLength && errors.push(this.$t("general.validation.max40"));
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
                { name: '', variable_name: '', unit: '', material_properties_id: null }:
                this.value.process_parameters[index]);
      this.editedParamIndex = index;
      this.dialogEditParam = true;
    },
    saveParam() {
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