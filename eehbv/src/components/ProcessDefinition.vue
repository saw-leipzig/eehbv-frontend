<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field label="Name" v-model="value.view_name" counter="40"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field label="API-Name" v-model="value.api_name" counter="40" :rules="api_name_rules"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select :items="selectionOptions" v-model="value.variant_tree" label="Variantenfrageschema"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Prozessparameter</v-card-title>
            <v-card-text>
              <v-row v-for="(param, index) in value.process_parameters" :key="index">
                <v-col cols="3">Name: {{param.name}}</v-col>
                <v-col cols="2">Einheit: {{param.unit}}</v-col>
                <v-col cols="3">Variablenname: {{param.variable_name}}</v-col>
                <v-col cols="2">Materialkonstante: {{propertyById(param.material_properties_id)}}</v-col>
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
        <v-col cols="6"><v-text-field label="Name" v-model="editedParam.name" counter="40"></v-text-field></v-col>
        <v-col cols="6"><v-text-field label="Einheit" v-model="editedParam.unit" counter="40"></v-text-field></v-col>
      </v-row>
      <v-row>
        <v-col cols="6"><v-text-field label="Variablenname" v-model="editedParam.variable_name" counter="40"></v-text-field></v-col>
        <v-col cols="6"><v-select :items="propOptions" label="Materialkonstante" v-model="editedParam.material_properties_id"></v-select></v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteParam" @abort="closeDeleteParam" @delete="deleteParamConfirm"></DialogDelete>

  </div>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import {mapGetters} from "vuex";
export default {
  name: "ProcessDefinition",
  components: {DialogCardEditor, DialogDelete},
  data: () => ({
    dialogEditParam: false,
    dialogDeleteParam: false,
    selectionOptions: [
      { text: 'Liste', value: false },
      { text: 'Baum', value: true }
    ],
    api_name_rules: [ v => v.length <= 40 || 'Max 40 Zeichen', v => v.length > 0 || 'erforderlich' ],
    editedParamIndex: -1,
    editedParam: {}
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
      if (this.editedParamIndex < 0) {
        this.value.process_parameters.push(this.editedParam);
      } else {
        this.value.process_parameters.splice(this.editedParamIndex, 1, this.editedParam);
      }
      this.closeEditParam();
    },
    closeEditParam() {
      this.editedIndex = -1;
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