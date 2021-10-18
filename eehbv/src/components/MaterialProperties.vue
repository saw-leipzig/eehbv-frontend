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
            <span>Materialeigenschaft hinzufügen</span>
          </v-tooltip>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-spacer></v-spacer>
          <v-btn :disabled="disabledAdd" color="green" dark class="mb-2" @click="dialogValue = true">Neuer Eintrag</v-btn>
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
            <v-text-field v-model="editedItem.material" label="Material" type="text"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.value" :label="currentPropLabel" type="number"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </DialogCardEditor>

    <DialogDelete v-model="dialogValueDelete" @abort="closeDelete" @delete="deleteValueConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogProp" max-width="400px" title="Neue Materialeigenschaft" @save="saveProp" @close="closeProp">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="newProp.property" label="Eigenschaft" type="text"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="newProp.unit" label="Einheit" type="text"></v-text-field>
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

export default {
  name: "MaterialProperties",
  components: {DialogDelete, DialogCardEditor},
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
        { text: 'Material', align: 'start', sortable: true, value: 'material' },
        { text: this.currentPropLabel, align: 'end', sortable: true, value: 'value' },
        { text: 'Aktionen', value: 'actions', sortable: false }
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
      return 'Eintrag ' + (this.editedIndex < 0 ? 'erstellen' : 'bearbeiten');
    },
    disabledAdd() {
      return this.currentPropertyId < 1;
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
      if (this.editedIndex > -1) {
        this.$http.put('properties/values/' + this.editedItem.id, this.editedItem).
            then((response) => {
              this.$store.commit('UPDATE_PROPERTY_VALUE', response.data);
        });   // ToDo: error handling
      } else {
        this.editedItem.material_properties_id = this.currentPropertyId;
        this.$http.post('properties/values', this.editedItem).
            then((response) => {
              this.$store.commit('ADD_PROPERTY_VALUE', response.data);
        });   // ToDo: error handling
      }
      this.close();
    },
    close() {
      this.resetEditedItem();
      this.dialogValue = false;
    },
    saveProp() {
      this.$http.post('properties', this.newProp).
          then((response) => {
            this.$store.commit('ADD_PROPERTY', response.data);   // ToDo: error handling
      });
      this.closeProp();
    },
    closeProp() {
      this.newProp = Object.assign({}, this.defaultProp);
      this.dialogProp = false;
    }
  }
}
</script>

<style scoped>

</style>