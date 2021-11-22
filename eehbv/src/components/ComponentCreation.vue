<template>
  <div>
    <v-card>
      <v-card-title class="headline">{{$t('components.titles.new_type')}}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field v-model="component_type.view_name" :label="$t('components.labels.view_name')" counter="40"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="component_type.table_name" :label="$t('components.labels.table_name')" counter="40"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="component_type.api_name" :label="$t('components.labels.api_name')" counter="20"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-switch v-model="component_type.is_aggregate" color="green" :label="$t('components.labels.is_aggregate')"></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>Spalten</v-card-title>
              <v-card-text>
                <v-row v-for="(column, index) in component_type.columns" :key="column.position">
                  <v-col cols="3">{{column.view_name}}</v-col>
                  <v-col cols="3">{{column.column_name}}</v-col>
                  <v-col cols="3">{{column.unit}}</v-col>
                  <v-col cols="3" v-if="column.position > 2">
                    <v-icon small class="mr-2" @click="editColumn(index)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteColumn(index)">mdi-delete</v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="editColumn(-1)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="save" :disabled="disabledSave">{{$t('general.dialog.save')}}</v-btn>
        <v-btn color="green darken-1" text :to="{ name: 'Component' }">{{$t('general.dialog.abort')}}</v-btn>
      </v-card-actions>
    </v-card>

    <DialogCardEditor v-model="dialogEditColumn" @save="saveColumn" @close="closeEditColumn">
      <v-row>
        <v-col cols="3"><v-text-field v-model="currentColumn.view_name" :label="$t('components.labels.view_name')" counter="40"></v-text-field></v-col>
        <v-col cols="3"><v-text-field v-model="currentColumn.column_name" :label="$t('components.labels.column_name')" counter="30"></v-text-field></v-col>
        <v-col cols="3"><v-text-field v-model="currentColumn.unit" :label="$t('general.domain.unit')" counter="20"></v-text-field></v-col>
        <v-col cols="3"><v-select :items="typeItems" v-model="currentColumn.type" :label="$t('components.labels.data_type')"></v-select></v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteColumn" @abort="closeDeleteColumn" @delete="deleteColumnConfirm"></DialogDelete>
  </div>
</template>

<script>
import DialogCardEditor from "./DialogCardEditor";
import DialogDelete from "./DialogDelete";

export default {
  name: "ComponentCreation",
  components: {DialogDelete, DialogCardEditor},
  data: () => ({
    component_type: {
      table_name: '',
      view_name: '',
      api_name: '',
      is_aggregate: false,
      columns: [
          { column_name: 'name', view_name: this.$t('components.domain.model'), type: 'VARCHAR', position: 1, unit: null },
          { column_name: 'manufacturer', view_name: this.$t('components.domain.manufacturer'), type: 'VARCHAR', position: 2, unit: null }
      ]
    },
    currentColumn: {},
    currentColumnIndex: -1,
    dialogEditColumn: false,
    dialogDeleteColumn: false,
    typeItems: [
      { text: 'DOUBLE', value: 'DOUBLE' },
      { text: 'BOOL', value: 'BOOL' },
      { text: 'VARCHAR', value: 'VARCHAR' },
    ]
  }),

  computed: {
    disabledSave() {
      return this.component_type.table_name === '' || this.component_type.view_name === '' ||
          this.component_type.api_name === '' || this.component_type.columns.length < 1;
    }
  },

  methods: {
    save() {
      // ToDo: check new view_name/api_name against existing, validate conventions (all lower-case, component_* for table names)
      this.$http.post('components', this.component_type).
          then((response) => {
            this.$store.commit('ADD_COMPONENT', response.data);
            this.$router.push({ name: 'Component' });
          }).catch((error)  => {
            // ToDo:
      });
    },
    editColumn(index) {
      this.currentColumn = Object.assign({},
          this.currentColumnIndex < 0 ?
              { column_name: '', view_name: '', type: '', position: this.component_type.columns.length + 1, unit: '' } :
              this.component_type.columns[index]);
      this.currentColumnIndex = index;
      this.dialogEditColumn = true;
    },
    saveColumn() {
      if (this.currentColumnIndex < 0) {
        this.component_type.columns.push(this.currentColumn);
      } else {
        this.component_type.columns.splice(this.currentColumnIndex, 1, this.currentColumn);
      }
      this.closeEditColumn();
    },
    closeEditColumn() {
      this.dialogEditColumn = false;
    },
    deleteColumn(index) {
      this.currentColumnIndex = index;
      this.dialogDeleteColumn = true;
    },
    deleteColumnConfirm() {
      this.component_type.columns.splice(this.currentColumnIndex, 1);
      this.component_type.columns.forEach((c, i) => c.position = i + 1);
      this.closeDeleteColumn();
    },
    closeDeleteColumn() {
      this.dialogDeleteColumn = false;
    }
  }
}
</script>

<style scoped>

</style>