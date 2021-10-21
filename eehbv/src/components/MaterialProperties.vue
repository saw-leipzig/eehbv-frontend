<template>
  <v-container>
    <v-data-table :headers="headers" :items="values" :items-per-page="10">

      <template v-slot:top>
        <v-toolbar flat>
          <v-overflow-btn :items="propOptions" v-model="currentPropertyId"></v-overflow-btn>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" @click="dialogProp = true" v-bind="attrs" v-on="on"><v-icon>mdi-plus</v-icon></v-btn>
            </template>
            <span>{{$t('material_properties.tooltips.add_property')}}</span>
          </v-tooltip>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-spacer></v-spacer>
          <v-btn :disabled="disabledAdd" color="green" dark class="mb-2" @click="dialogValue = true">
            {{$t('general.editing.new')}}
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="refreshData">
          Reset
        </v-btn>
      </template>

    </v-data-table>

    <DialogCardEditor v-model="dialogValue" max-width="500px" :title="editTitle" @save="save" @close="close">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-combobox v-model="editedItem.material" :items="materialProposals"
                        :label="$t('material_properties.material')" :error-messages="materialErrors"
                        @input="$v.editedItem.material.$touch" @blur="$v.editedItem.material.$touch"></v-combobox>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.value" :label="currentPropLabel" type="number" :error-messages="valueErrors"
                        @input="$v.editedItem.value.$touch" @blur="$v.editedItem.value.$touch"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </DialogCardEditor>

    <DialogDelete v-model="dialogValueDelete" @abort="closeDelete" @delete="deleteValueConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogProp" max-width="400px" :title="$t('material_properties.titles.new_property')"
                      @save="saveProp" @close="closeProp">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="newProp.property" :label="$t('general.domain.property')" type="text" :error-messages="propertyErrors"
                        @input="$v.newProp.property.$touch" @blur="$v.newProp.property.$touch"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="newProp.unit" :label="$t('general.domain.unit')" type="text" :error-messages="unitErrors"
                        @input="$v.newProp.unit.$touch" @blur="$v.newProp.unit.$touch"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </DialogCardEditor>

  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import DialogCardEditor from "./DialogCardEditor";
import DialogDelete from "./DialogDelete";
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: "MaterialProperties",
  components: {DialogDelete, DialogCardEditor},

  validations: {
    editedItem: {
      material: { required, maxLength: maxLength(40),
        singularMaterial(material) {
          return (this.editedIndex > 0 && material === this.prop_values[this.editedIndex].material) ||  // editing existing entry
              !this.usedMaterials.includes(material);
        }
      },
      value: { required },
    },
    newProp: {
      property: { required, maxLength: maxLength(40),
        singularProperty(property) {
          return this.properties.findIndex(p => p.property === property) === -1;
        }
      },
      unit: { required, maxLength: maxLength(20) }
    }
  },

  data: () => ({
    dialogValue: false,
    dialogValueDelete: false,
    dialogProp: false,
    editedIndex: -1,
    editedItem: {},
    defaultItem: { material: '', value: 0.0, material_properties_id: null },
    currentPropertyId: 0,
    newProp: {},
    defaultProp: { property: '', unit: '' }
  }),

  computed: {
    ...mapGetters(['valuesOfProp', 'properties', 'prop_values']),
    headers() {
      return [
        { text: this.$t('material_properties.material'), align: 'start', sortable: true, value: 'material' },
        { text: this.currentPropLabel, align: 'end', sortable: true, value: 'value' },
        { text: this.$t('general.editing.actions'), value: 'actions', sortable: false }
      ];
    },
    propOptions() {
      return [
        { text: '???', value: 0 },
          ...this.properties.map(p => { return { text: p.property, value: p.id } })
      ]
    },
    currentProp() {
      return this.propertiesNotPresent ?
          '???' :
          this.properties.find(p => p.id === this.currentPropertyId).property;
    },
    currentUnit() {
      return this.propertiesNotPresent ?
          '???' :
          this.properties.find(p => p.id === this.currentPropertyId).unit;
    },
    values() {
      return this.propertiesNotPresent ?
          this.prop_values :
          this.valuesOfProp(this.currentPropertyId);
    },
    propertiesNotPresent() {
      return this.currentPropertyId === 0 || this.properties.length < 1;
    },
    currentPropLabel() {
      return this.currentProp + ' [' + this.currentUnit + ']';
    },
    editTitle() {
      return this.editedIndex < 0 ? this.$t('general.editing.create') : this.$t('general.editing.edit');
    },
    disabledAdd() {
      return this.currentPropertyId < 1;
    },
    materialProposals() {
      return [... new Set(this.prop_values.map(v => v.material))].
          filter(v => !this.usedMaterials.includes(v));
    },
    usedMaterials() {
      return this.prop_values.
          filter(v => this.currentPropertyId === v.material_properties_id).map(v => v.material);
    },
    valueErrors() {
      let errors = [];
      if (!this.$v.editedItem.value.$dirty) return errors;
      !this.$v.editedItem.value.required && errors.push(this.$t('general.validation.required'));
      return errors;
    },
    materialErrors() {
      let errors = [];
      if (!this.$v.editedItem.material.$dirty) return errors;
      !this.$v.editedItem.material.required && errors.push(this.$t('general.validation.required'));
      !this.$v.editedItem.material.maxLength && errors.push(this.$t('general.validation.max40'));
      !this.$v.editedItem.material.singularMaterial && errors.push(this.$t('general.validation.present'));
      return errors;
    },
    unitErrors() {
      let errors = [];
      if (!this.$v.newProp.unit.$dirty) return errors;
      !this.$v.newProp.unit.required && errors.push(this.$t('general.validation.required'));
      !this.$v.newProp.unit.maxLength && errors.push(this.$t('general.validation.max20'));
      return errors;
    },
    propertyErrors() {
      let errors = [];
      if (!this.$v.newProp.property.$dirty) return errors;
      !this.$v.newProp.property.required && errors.push(this.$t('general.validation.required'));
      !this.$v.newProp.property.maxLength && errors.push(this.$t('general.validation.max40'));
      !this.$v.newProp.property.singularProperty && errors.push(this.$t('general.validation.present'));
      return errors;
    }
  },

  async created() {
    this.newProp = Object.assign({}, this.defaultProp);
    this.resetEditedItem();
    if (this.properties.length < 1) {
      try {
        await this.$store.dispatch('initProperties');
        if (this.properties.length > 0) {
          this.currentPropertyId = 1;
        }
      } catch  {}
    } else {
      this.currentPropertyId = 1;
    }
  },

  methods: {
    refreshData() {
      this.$store.dispatch('initProperties');
    },
    resetEditedItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    assignItem(item) {
      this.editedIndex = this.prop_values.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    editItem(item) {
      this.assignItem(item);
      this.dialogValue = true;
    },
    deleteItem(item) {
      this.assignItem(item);
      this.dialogValueDelete = true;
    },
    deleteValueConfirm() {
      this.$http.delete('properties/values/' + this.editedItem.id).
          then((response) => {
            if (response.data.status === 'ok') {
              this.$store.commit('DELETE_PROPERTY_VALUE', this.editedItem);
            } else {
              // ToDo:
            }
      });
      // ToDo: error handling
      this.closeDelete();
    },
    closeDelete() {
      this.resetEditedItem();
      this.dialogValueDelete = false;
    },
    save() {
      this.$v.editedItem.$touch();
      if (this.$v.editedItem.$invalid) {
        return;
      }
      if (this.editedIndex > -1) {
        this.$http.put('properties/values/' + this.editedItem.id, this.editedItem).
            then((response) => {
              this.$store.commit('UPDATE_PROPERTY_VALUE', response.data);
        });   // ToDo: error handling
      } else {
        this.$set(this.editedItem, 'material_properties_id', this.currentPropertyId);
        this.$http.post('properties/values', this.editedItem).
            then((response) => {
              this.$store.commit('ADD_PROPERTY_VALUE', response.data);
        });   // ToDo: error handling
      }
      this.close();
    },
    close() {
      this.resetEditedItem();
      this.$v.editedItem.$reset();
      this.dialogValue = false;
    },
    saveProp() {
      this.$v.newProp.$touch();
      if (this.$v.newProp.$invalid) {
        return;
      }
      this.$http.post('properties', this.newProp).
          then((response) => {
            this.$store.commit('ADD_PROPERTY', response.data);   // ToDo: error handling
      });
      this.closeProp();
    },
    closeProp() {
      this.newProp = Object.assign({}, this.defaultProp);
      this.$v.newProp.$reset();
      this.dialogProp = false;
    }
  }
}
</script>

<style scoped>

</style>