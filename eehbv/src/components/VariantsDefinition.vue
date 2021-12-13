<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card v-for="(variant, index) in value" :key="index">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="10">{{ $t('variants_definition.labels.description') }}: {{ variant.name }}</v-col>
                  <v-col cols="2">
                    <v-icon small class="mr-2" @click="editVariant(index)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteVariant(index)">mdi-delete</v-icon>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12"><b>{{ $t('components.titles.components') }}:</b> {{ componentList(variant) }}</v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="editVariant(-1)"><v-icon>mdi-plus</v-icon></v-btn>
      </v-row>
    </v-container>

    <DialogDelete v-model="dialogDeleteVariant" @abort="closeDeleteVariant" @delete="deleteVariantConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogEditVariant" :title="variantEditTitle" :disabled-save="disabledSaveVariant"
                      @save="saveVariant" @close="closeEditVariant">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="currentVariant.name" :label="$t('variants_definition.labels.description')" counter="60"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('components.titles.components') }}</v-card-title>
            <v-card-text>
              <v-row v-for="component in currentVariant.variant_components" :key="component.position">
                <v-col cols="3">{{ $t('variants_definition.labels.description') }}: {{component.description}}</v-col>
                <v-col cols="3">{{ $t('variants_definition.labels.component_type') }}: {{componentViewName(component.component_api_name)}}</v-col>
                <v-col cols="3">{{ $t('variants_definition.labels.variable_name') }}: {{component.variable_name}}</v-col>
                <v-col cols="3">
                  <v-icon small class="mr-2" @click="editComponent(component.position)">mdi-pencil</v-icon>
                  <v-icon small @click="deleteComponent(component.position)">mdi-delete</v-icon>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="editComponent(-1)"><v-icon>mdi-plus</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('variants_definition.labels.target_function') }}</v-card-title>
            <v-card-text>
              <v-textarea v-if="currentTargetPythonStyle" v-model="currentVariant.target_func_python" :disabled="disabledEditFunc"></v-textarea>
              <v-textarea v-else v-model="currentVariant.target_func" :disabled="true"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col cols="3">
                  <v-switch v-model="currentTargetPythonStyle" color="green" :label="$t('variants_definition.labels.python_function')"></v-switch>
                </v-col>
                <v-col cols="3">
                  <v-btn color="green" :disabled="disabledEditFunc || !currentTargetPythonStyle" text @click="insertSignature">
                    {{ $t('variants_definition.labels.signature') }}
                  </v-btn>
                </v-col>
                <v-col cols="3">
                  <ParameterButton :disabled="disabledEditFunc || !currentTargetPythonStyle"
                                   :params="functionParams" @click="addParameter"></ParameterButton>
                </v-col>
                <v-col cols="3">
                  <v-btn color="green" :disabled="disabledEditFunc || currentTargetPythonStyle" text @click="editTargetFunc">
                    {{ $t('general.editing.do') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogCardEditor v-model="dialogEditComponent" @save="saveComponent" @close="closeEditComponent">
      <v-row>
        <v-col cols="4">
          <v-select v-model="currentComponent.component_api_name" :items="componentSelection" :label="$t('variants_definition.labels.component_type')"></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="currentComponent.description" :label="$t('variants_definition.labels.description')"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="currentComponent.variable_name" :label="$t('variants_definition.labels.variable_name')"></v-text-field>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteComponent" @abort="closeDeleteComponent" @delete="deleteComponentConfirm"></DialogDelete>

    <v-dialog v-model="dialogEditTargetFunc" max-width="600px">
      <FormulaEditor :title="$t('variants_definition.labels.target_function')" v-model="currentTargetFunc" :inequality="false"
                     :parameters="functionParams" :signature="'f' + signature + ' ='" @closeDialog="closeTargetFunc"></FormulaEditor>
    </v-dialog>
  </div>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import {mapGetters} from "vuex";
import FormulaEditor from "./FormulaEditor";
import ParameterButton from "./ParameterButton";
export default {
  name: "VariantsDefinition",
  components: {ParameterButton, FormulaEditor, DialogCardEditor, DialogDelete},

  data: () => ({
    dialogEditVariant: false,
    dialogDeleteVariant: false,
    dialogEditComponent: false,
    dialogDeleteComponent: false,
    dialogEditTargetFunc: false,
    currentVariant: { name: '', target_func: '', target_func_python: '', variant_components: [] },
    currentVariantIndex: -1,
    currentComponent: { position: 0, component_api_name: '', variable_name: '', description: '' },
    currentComponentIndex: -1,
    currentTargetFunc: [],
    targetFunctions: [],
    targetPythonStyle: [],
    currentTargetPythonStyle: false
  }),

  props: {
    value: {
      type: Array,
      required: true
    },
    process: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['componentTypes']),
    disabledSaveVariant() {
      return (this.currentVariant.target_func === '' && this.currentVariant.target_func_python === '') ||
          this.currentVariant.name === '' ||  this.currentVariant.variant_components.length < 1;
    },
    disabledEditFunc() {
      return this.currentVariant.name === '' || this.currentVariant.variant_components.length < 1;
    },
    functionParams() {
      return [ this.process.process_parameters.map(p => { return { formula: p.variable_name, view: p.name + ' [' + p.unit + ']' }}),
        this.currentVariant.variant_components.map(c => {
          return { formula: c.variable_name, view: c.description,
            parameters: this.componentTypes.filter(t => t.api_name === c.component_api_name).
                map(t => t.infos.filter(i => i.column_name !== 'name' && i.column_name !== 'manufacturer').
                            map(i => {return { formula: i.column_name, view: i.view_name + (i.unit ? ' [' + i.unit + ']' : '') }})
                )[0]
          }
        })
      ];
    },
    componentSelection() {
      return this.componentTypes.map(c => { return { text: c.view_name, value: c.api_name } });
    },
    variantEditTitle() {
      return this.currentVariantIndex < 0 ? this.$t('general.editing.create') : this.$t('general.editing.edit');
    },
    signature() {
      return '(' + this.process.process_parameters.map(p => p.variable_name).join(', ') + ', ' +
          this.currentVariant.variant_components.map(c => c.variable_name).join(', ') + ')'
    }
  },

  methods: {
    componentList(variant) {
      return variant.variant_components.map(c => c.description).join(' ');
    },
    editVariant(index) {
      this.currentVariant = Object.assign({},
          index < 0 ?
              { name: '', target_func: '', target_func_python: '', variant_components: [] } :
              this.value[index]);
      this.dialogEditVariant = true;
    },
    saveVariant() {
      if (this.currentVariantIndex < 0) {
        this.value.push(this.currentVariant);
        this.targetFunctions.push(JSON.parse(JSON.stringify(this.currentTargetFunc)));
        this.targetPythonStyle.push(this.currentTargetPythonStyle);
      } else {
        this.value.splice(this.currentVariantIndex, 1, this.currentVariant);
        this.targetFunctions.splice(this.currentVariantIndex, 1, JSON.parse(JSON.stringify(this.currentTargetFunc)));
        this.targetPythonStyle.splice(this.currentVariantIndex, 1, this.currentTargetPythonStyle);
      }
      this.closeEditVariant();
    },
    closeEditVariant() {
      this.currentTargetFunc.splice(0);
      this.dialogEditVariant = false;
    },
    deleteVariant(index) {
      this.currentVariantIndex = index;
      this.dialogDeleteVariant = true;
    },
    deleteVariantConfirm() {
      this.value.splice(this.currentVariantIndex, 1);
      this.targetFunctions.splice(this.currentVariantIndex, 1);
      this.targetPythonStyle.splice(this.currentVariantIndex, 1);
      this.closeDeleteVariant();
    },
    closeDeleteVariant() {
      this.dialogDeleteVariant = false;
    },

    editComponent(index) {
      this.currentComponent = Object.assign({},
          index < 0 ?
              { position: this.currentVariant.variant_components.length, component_api_name: '', variable_name: '', description: '' } :
              this.currentVariant.variant_components[index]);
      this.dialogEditComponent = true;
    },
    saveComponent() {
      if (this.currentComponentIndex < 0) {
        this.currentVariant.variant_components.push(this.currentComponent);
      } else {
        this.currentVariant.variant_components.splice(this.currentComponentIndex, 1, this.currentComponent);
      }
      this.closeEditComponent();
    },
    closeEditComponent() {
      this.dialogEditComponent = false;
    },
    deleteComponent(index) {
      this.currentComponentIndex = index;
      this.dialogDeleteComponent = true;
    },
    deleteComponentConfirm() {
      this.value.splice(this.currentVariantIndex, 1);
      this.adjustPositions();
      this.closeDeleteComponent();
    },
    closeDeleteComponent() {
      this.dialogDeleteComponent = false;
    },
    adjustPositions() {
      this.currentVariant.variant_components.forEach((c, i) => {
        if (i > this.currentComponentIndex) c.position = this.currentComponentIndex;
      } );
    },

    editTargetFunc() {
      // ToDo: check condition
      if (this.currentTargetFunc.length < 1 && this.currentVariantIndex < this.targetFunctions.length && this.currentVariantIndex > -1) {
        this.currentTargetFunc.push(...JSON.parse(JSON.stringify(this.targetFunctions[this.currentVariantIndex])));
      }
      this.dialogEditTargetFunc = true;
    },
    closeTargetFunc(save) {
      if (save) {
        this.currentVariant.target_func = this.currentTargetFunc.map(t => t.formula).join(' ');
      }
      this.dialogEditTargetFunc = false;
    },
    componentViewName(api_name) {
      return this.componentTypes.find(c => c.api_name === api_name).view_name;
    },
    addParameter(val) {
      this.currentVariant.target_func_python += val.formula;
    },
    insertSignature() {
      console.log('SIG - ' + this.currentVariant.target_func_python);
      this.currentVariant.target_func_python += 'def target_func' + this.signature + ':';
    }
  }
}
</script>

<style scoped>

</style>