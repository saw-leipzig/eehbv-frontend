<template>
  <div>
    <v-container>
      <v-row>
        <v-card v-for="(variant, index) in value" :key="index">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="10">Beschreibung: {{variant.name}}</v-col>
                <v-col cols="2">
                  <v-icon small class="mr-2" @click="editVariant(index)">mdi-pencil</v-icon>
                  <v-icon small @click="deleteVariant(index)">mdi-delete</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12"><b>Komponenten:</b> {{componentList(variant)}}</v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="editVariant(-1)"><v-icon>mdi-plus</v-icon></v-btn>
      </v-row>
    </v-container>

    <DialogDelete v-model="dialogDeleteVariant" @abort="closeDeleteVariant" @delete="deleteVariantConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogEditVariant" @save="saveVariant" @close="closeEditVariant" :disabled-save="disabledSaveVariant">
      <v-row>
        <v-col cols="12"><v-text-field v-model="currentVariant.name" label="Beschreibung" counter="60"></v-text-field></v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>Komponenten</v-card-title>
            <v-card-text>
              <v-row v-for="component in currentVariant.variant_components" :key="component.position">
                <v-col cols="3">Bezeichner: {{component.description}}</v-col>
                <v-col cols="3">Komponententyp: {{componentViewName(component.component_api_name)}}</v-col>
                <v-col cols="3">Variablenname: {{component.variable_name}}</v-col>
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
            <v-card-title>Zielfunktion</v-card-title>
            <v-card-text>
              <v-textarea v-model="currentVariant.target_func" :disabled="true"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" :disabled="disabledEditFunc" @click="editTargetFunc">Bearbeiten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogCardEditor v-model="dialogEditComponent" @save="saveComponent" @close="closeEditComponent">
      <v-row>
        <v-col cols="4">
          <v-select v-model="currentComponent.component_api_name" :items="componentSelection"></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="currentComponent.description" label="Bezeichner"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="currentComponent.variable_name" label="Variablenname"></v-text-field>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteComponent" @abort="closeDeleteComponent" @delete="deleteComponentConfirm"></DialogDelete>

    <!-- ToDo: Choice for math style or Python style -->
    <v-dialog v-model="dialogEditTargetFunc" max-width="600px">
      <FormulaEditor title="Zielfunktion" v-model="currentTargetFunc" :parameters="functionParams" :inequality="false"
                     @closeDialog="closeTargetFunc"></FormulaEditor>
    </v-dialog>
  </div>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import {mapGetters} from "vuex";
import FormulaEditor from "./FormulaEditor";
export default {
  name: "VariantsDefinition",
  components: {FormulaEditor, DialogCardEditor, DialogDelete},

  data: () => ({
    dialogEditVariant: false,
    dialogDeleteVariant: false,
    dialogEditComponent: false,
    dialogDeleteComponent: false,
    dialogEditTargetFunc: false,
    currentVariant: { name: '', target_func: '', variant_components: [] },
    currentVariantIndex: -1,
    currentComponent: { position: 0, component_api_name: '', variable_name: '', description: '' },
    currentComponentIndex: -1,
    currentTargetFunc: [],
    targetFunctions: []
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
      return this.currentVariant.name === '' || this.currentVariant.target_func === '' ||
          this.currentVariant.variant_components.length < 1;
    },
    disabledEditFunc() {
      return this.currentVariant.name === '' || this.currentVariant.variant_components.length < 1;
    },
    functionParams() {
      return [ this.process.process_parameters.map(p => { return { formula: p.variable_name, view: p.name }}),
        this.currentVariant.variant_components.map(c => {
          return { formula: c.variable_name, view: c.description,
            parameters: this.componentTypes.filter(t => t.api_name === c.component_api_name).
                map(t => t.infos.filter(i => i.column_name !== 'name' && i.column_name !== 'manufacturer').
                            map(i => {return {formula: i.column_name, view: i.view_name}})
                )[0]
          }
        })
      ];
    },
    componentSelection() {
      return this.componentTypes.map(c => { return { text: c.view_name, value: c.api_name } });
    }
  },

  methods: {
    componentList(variant) {
      return variant.variant_components.map(c => c.description).join(' ');
    },
    editVariant(index) {
      this.currentVariant = Object.assign({},
          index < 0 ?
              { name: '', target_func: '', variant_components: [] } :
              this.value[index]);
      this.dialogEditVariant = true;
    },
    saveVariant() {
      if (this.currentVariantIndex < 0) {
        this.value.push(this.currentVariant);
        this.targetFunctions.push(JSON.parse(JSON.stringify(this.currentTargetFunc)));
      } else {
        this.value.splice(this.currentVariantIndex, 1, this.currentVariant);
        this.targetFunctions.splice(this.currentVariantIndex, 1, JSON.parse(JSON.stringify(this.currentTargetFunc)));
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
      if (this.currentTargetFunc.length < 1 && this.currentVariantIndex < this.targetFunctions.length) {
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
    }
  }
}
</script>

<style scoped>

</style>