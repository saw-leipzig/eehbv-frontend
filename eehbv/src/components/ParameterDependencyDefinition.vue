<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <ParameterList :parameters="value" :show-dep="true" :show-delete="false" :show-add="false" :show-title="false"
                         @edit="editParam"></ParameterList>
        </v-col>
      </v-row>
    </v-container>

    <DialogCardEditor v-model="dialogEditParam" max-width="700px" :title="$t('general.editing.edit')" @save="saveParam"
                      @close="closeEditParam">
      <v-row>
        <v-col cols="6">
          <v-text-field :label="$t('process_definition.labels.name')" v-model="editedParam.name" counter="40" :disabled="true"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field :label="$t('process_definition.labels.variable_name')" v-model="editedParam.variable_name" :disabled="true"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-switch v-model="editedParam.restricting" :label="$t('process_definition.labels.restricting')" :disabled="true"></v-switch>
        </v-col>
        <v-col cols="6">
          <v-switch v-model="editedParam.dependent" :label="$t('process_definition.labels.dependent')" :disabled="true"></v-switch>
        </v-col>
      </v-row>
      <v-row v-if="editedParam.restricting">
        <v-col cols="4">
          <v-text-field v-model="editedParam.min_column" :label="$t('process_definition.labels.column_lower')" counter="40"></v-text-field>
        </v-col>
        <v-col cols="2">
          <br/><ParameterButton :params="componentParams" @click="addMinCol"></ParameterButton>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="editedParam.max_column" :label="$t('process_definition.labels.column_upper')" counter="40"></v-text-field>
        </v-col>
        <v-col cols="2">
          <br/><ParameterButton :params="componentParams" @click="addMaxCol"></ParameterButton>
        </v-col>
      </v-row>
      <v-row v-if="editedParam.dependent">
        <v-col cols="4">
          <v-text-field v-model="editedParam.derived_parameter" :label="$t('process_definition.labels.derived_param')" :disabled="true"></v-text-field>
        </v-col>
        <v-col cols="1"><br/>=</v-col>
        <v-col cols="6">
          <v-text-field v-model="editedParam.dependency" :label="$t('process_definition.labels.dependency')"></v-text-field>
        </v-col>
<!--        <v-col cols="2"><v-btn @click="editDependencyFunc"><v-icon>mdi-pencil</v-icon></v-btn></v-col>-->
        <v-col cols="1"><br/><v-icon small class="mr-2" @click="editDependencyFunc">mdi-pencil</v-icon></v-col>
      </v-row>
    </DialogCardEditor>

    <v-dialog v-model="dialogEditDependencyFunc" max-width="600px">
      <FormulaEditor :title="$t('process_definition.labels.dependency')" v-model="currentDependencyFunc" :inequality="false"
                   :parameters="dependencyParams" :signature="editedParam.derived_parameter + ' ='"
                   @closeDialog="closeDependencyFunc"></FormulaEditor>
    </v-dialog>
  </div>
</template>

<script>
import paramEditMixin from "../mixins/paramEditMixin";
import ParameterList from "./ParameterList";
import DialogCardEditor from "./DialogCardEditor";
import ParameterButton from "./ParameterButton";
import FormulaEditor from "./FormulaEditor";
import {mapGetters} from "vuex";

export default {
  name: "ParameterDependencyDefinition",
  components: {FormulaEditor, ParameterButton, DialogCardEditor, ParameterList},
  mixins: [paramEditMixin],

  data: () => ({
    dialogEditDependencyFunc: false,
    currentDependencyFunc: [],
    dependencyFunctions: []
  }),

  props: {
    value: {
      type: Array,
      required: true
    },
    variants: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters(['componentTypes']),
    componentParams() {
      return [ [],
        this.variants.map(v => v.variant_components).flat().
          filter((v, i, a) => a.findIndex(av => av.variable_name === v.variable_name) === i).   // distinct values of variable_name
          map(c => {
            return { formula: c.variable_name, view: c.description,
              parameters: this.componentTypes.filter(t => t.api_name === c.component_api_name).
                  map(t => t.infos.filter(i => i.column_name !== 'name' && i.column_name !== 'manufacturer').
                              map(i => {return { formula: i.column_name, view: i.view_name }})
                  )[0]
            }
          })
      ];
    },
    dependencyParams() {
      return [ [
          { formula: this.editedParam.variable_name,
            view: this.editedParam.name + (this.editedParam.unit ? ' [' + this.editedParam.unit + ']' : '') }
        ], []
      ];
    }
  },

  methods: {
    editParam(index) {
      this.editedParam = Object.assign({}, this.value[index]);
      this.editedParamIndex = index;
      this.dialogEditParam = true;
    },
    saveParam() {
/*      this.$v.editedParam.$touch();
      if (this.$v.editedParam.$invalid) {
        return;
      }*/
      if (this.editedParamIndex < 0) {
        this.value.push(this.editedParam);
      } else {
        this.value.splice(this.editedParamIndex, 1, this.editedParam);
      }
      this.closeEditParam();
    },
    addMinCol(val) {
      this.editedParam.min_column = val.formula;
    },
    addMaxCol(val) {
      this.editedParam.max_column = val.formula;
    },

    editDependencyFunc() {
      if (this.dependencyFunctions.length < 1) {
        for (let p = 0; p < this.value.length; p++) {
          this.dependencyFunctions.push([]);
        }
      }
      // ToDo: check condition
      if (this.currentDependencyFunc.length < 1 && this.editedParamIndex < this.dependencyFunctions.length && this.editedParamIndex > -1) {
        this.currentDependencyFunc.push(...JSON.parse(JSON.stringify(this.dependencyFunctions[this.editedParamIndex])));
      }
      this.dialogEditDependencyFunc = true;
    },
    closeDependencyFunc(save) {
      if (save) {
        this.editedParam.dependency = this.currentDependencyFunc.map(t => t.formula).join(' ');
      }
      this.dialogEditDependencyFunc = false;
    }
  }
}
</script>

<style scoped>

</style>