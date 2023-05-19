<template>
  <div>
    <v-card>
      <v-card-title class="headline">{{$t('components.titles.new_type')}}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="component_type.view_name" :label="$t('components.labels.view_name')" counter="40"
                        :error-messages="viewErrors"
                        @input="$v.component_type.view_name.$touch" @blur="$v.component_type.view_name.$touch"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="component_type.api_name" :label="$t('components.labels.api_name')" counter="20"
                        :hint="$t('components.hints.api_convention')" :error-messages="apiErrors"
                        @input="$v.component_type.api_name.$touch" @blur="$v.component_type.api_name.$touch"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-switch v-model="component_type.is_aggregate" color="green" :label="$t('components.labels.is_aggregate')"></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>{{$t('components.titles.columns')}}</v-card-title>
              <v-card-text>
                <v-row v-for="(column, index) in component_type.columns" :key="index">
                  <v-col cols="3">{{column.view_name}}</v-col>
                  <v-col cols="3">{{column.column_name}}</v-col>
                  <v-col cols="3">{{column.unit}}</v-col>
                  <v-col cols="3" v-if="column.position > 3">
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
import { mapGetters } from 'vuex'
import { required, maxLength, helpers } from 'vuelidate/lib/validators'
const snake = helpers.regex('snake', /^[a-z_]*$/);

export default {
  name: "ComponentCreation",
  components: {DialogDelete, DialogCardEditor},

  validations: {
    component_type: {
      view_name: { required, maxLength: maxLength(40),
        viewNameTaken(view_name) { return !this.componentTypes.map(t => t.view_name).includes(view_name); }
      },
      api_name: { required, maxLength: maxLength(20), snake,
        apiNameTaken(api_name) { return !this.componentTypes.map(t => t.api_name).includes(api_name); }
      }
    }
  },

  data() {
    return {
      component_type: {
        view_name: '',
        api_name: '',
        is_aggregate: false,
        columns: [
          {
            column_name: 'name',
            view_name: this.$t('components.domain.model'),
            type: 'VARCHAR',
            position: 1,
            unit: null
          },
          {
            column_name: 'manufacturer',
            view_name: this.$t('components.domain.manufacturer'),
            type: 'VARCHAR',
            position: 2,
            unit: null
          },
          {
            column_name: 'price',
            view_name: this.$t('components.domain.price'),
            type: 'DOUBLE',
            position: 2,
            unit: 'Euro'
          }
        ]
      },
      currentColumn: {},
      currentColumnIndex: -1,
      dialogEditColumn: false,
      dialogDeleteColumn: false,
      typeItems: [
        {text: 'DOUBLE', value: 'DOUBLE'},
        {text: 'BOOL', value: 'BOOL'},
        {text: 'VARCHAR', value: 'VARCHAR'},
      ]
    }
  },

  computed: {
    ...mapGetters(['componentTypes']),
    disabledSave() {
      return this.component_type.table_name === '' || this.component_type.view_name === '' ||
          this.component_type.api_name === '' || this.component_type.columns.length < 1;
    },
    viewErrors() {
      let errors = [];
      if (!this.$v.component_type.view_name.$dirty) return errors;
      !this.$v.component_type.view_name.required && errors.push(this.$t('general.validation.required'));
      !this.$v.component_type.view_name.maxLength && errors.push(this.$t('general.validation.max40'));
      !this.$v.component_type.view_name.viewNameTaken && errors.push(this.$t('general.validation.present'));
      return errors;
    },
    apiErrors() {
      let errors = [];
      if (!this.$v.component_type.api_name.$dirty) return errors;
      !this.$v.component_type.api_name.required && errors.push(this.$t('general.validation.required'));
      !this.$v.component_type.api_name.maxLength && errors.push(this.$t('general.validation.max20'));
      !this.$v.component_type.api_name.apiNameTaken && errors.push(this.$t('general.validation.present'));
      !this.$v.component_type.api_name.snake && errors.push(this.$t('general.validation.snake'));
      return errors;
    }
  },

  methods: {
    save() {
      this.$v.component_type.$touch();
      if (this.$v.component_type.$invalid) {
        return;
      }
      let new_component_type = this.component_type;
      new_component_type['table_name'] = 'component_' + this.component_type.api_name;
      this.$http.post('components', new_component_type).
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