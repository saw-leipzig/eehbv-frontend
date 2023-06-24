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
                    <v-icon small class="mr-2" @click="editVariant(index, false)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteVariant(index)">mdi-delete</v-icon>
                    <v-icon small @click="editVariant(index, true)">mdi-content-copy</v-icon>
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
        <v-btn color="green" @click="editVariant(-1, false)"><v-icon>mdi-plus</v-icon></v-btn>
      </v-row>
    </v-container>

    <DialogDelete v-model="dialogDeleteVariant" @abort="closeDeleteVariant" @delete="deleteVariantConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogEditVariant" :title="variantEditTitle" :disabled-save="disabledSaveVariant"
                      @save="saveVariant" @close="closeEditVariant">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="currentVariant.name" :label="$t('variants_definition.labels.description')"
                        counter="255"></v-text-field>
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
                  <v-icon small @click="deleteComponent(component.position)" :disabled="disabledDeleteComp(component.position)">mdi-delete</v-icon>
                  <v-icon small @click="componentUp(component.position)" :disabled="component.position === 0">mdi-arrow-up-thin</v-icon>
                  <v-icon small @click="componentDown(component.position)"
                          :disabled="component.position === currentVariant.variant_components.length - 1">mdi-arrow-down-thin</v-icon>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="editComponent(-1)" :disabled="disabledEditComp"><v-icon>mdi-plus</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('variants_definition.labels.function_calls') }}</v-card-title>
            <v-card-text>
                <v-row v-for="func in currentVariant.variant_functions" :key="func.position">
                  <v-col cols="9">{{ $t('variants_definition.labels.function') }}: {{func.description}}</v-col>
                  <v-col cols="3">
                    <v-icon small class="mr-2" @click="editFunction(func.position)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteFunction(func.position)">mdi-delete</v-icon>
                    <v-icon small @click="functionUp(func.position)" :disabled="func.position === 0">mdi-arrow-up-thin</v-icon>
                    <v-icon small @click="functionDown(func.position)"
                            :disabled="func.position === currentVariant.variant_functions.length - 1">mdi-arrow-down-thin</v-icon>
                  </v-col>
                </v-row>
            </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="editFunction(-1)" :disabled="disabledEditFunc"><v-icon>mdi-plus</v-icon></v-btn>
              </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('variants_definition.labels.restrictions') }}</v-card-title>
            <v-card-text>
                <v-row v-for="(restriction, index) in currentVariant.variant_restrictions" :key="index">
                  <v-col cols="9">{{ $t('variants_definition.labels.restriction') }}: {{restriction.description}}</v-col>
                  <v-col cols="3">
                    <v-icon small class="mr-2" @click="editRestriction(index)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteRestriction(index)">mdi-delete</v-icon>
                    <v-icon small @click="restrictionUp(index)" :disabled="index === 0">mdi-arrow-up-thin</v-icon>
                    <v-icon small @click="restrictionDown(index)"
                            :disabled="index === currentVariant.variant_restrictions.length - 1">mdi-arrow-down-thin</v-icon>
                  </v-col>
                </v-row>
            </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="editRestriction(-1)" :disabled="disabledEditRestr"><v-icon>mdi-plus</v-icon></v-btn>
              </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogCardEditor v-model="dialogEditComponent" @save="saveComponent" @close="closeEditComponent">
      <v-row>
        <v-col cols="3">
          <v-select v-model="currentComponent.component_api_name" :items="componentSelection" counter="40"
                    :label="$t('variants_definition.labels.component_type')" :error-messages="compApiErrors"
                    @input="$v.currentComponent.component_api_name.$touch" @blur="$v.currentComponent.component_api_name.$touch"></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="currentComponent.description" :label="$t('variants_definition.labels.description')"
                        counter="40" :error-messages="compDescErrors"
                        @input="$v.currentComponent.description.$touch" @blur="$v.currentComponent.description.$touch"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="currentComponent.variable_name" placeholder="c_xyz" counter="30"
                        :disabled="currentComponentIndex !== -1 && componentUsed(currentComponentIndex)"
                        :label="$t('variants_definition.labels.variable_name')" :error-messages="compVarErrors"
                        @input="$v.currentComponent.variable_name.$touch" @blur="$v.currentComponent.variable_name.$touch"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-combobox v-model="currentComponent.aggregate" counter="30"
                      :items="aggregateOptions"
                      :label="$t('variants_definition.labels.aggregate_name')"
                      :error-messages="compAggErrors" @input="$v.currentComponent.aggregate.$touch" @blur="$v.currentComponent.aggregate.$touch"
                      type="text"
          ></v-combobox>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteComponent" @abort="closeDeleteComponent" @delete="deleteComponentConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogEditFunction" @save="saveFunction" @close="closeEditFunction"
                      :info-button="true" @info="infoFunctionOverlay = true" :disabled-save="disabledSaveFunc">
      <v-row>
        <v-col cols="3">
          <v-text-field v-model="currentFunction.description" :label="$t('variants_definition.labels.description')"
                        counter="40" :error-messages="funcDescErrors"
                        @input="$v.currentFunction.description.$touch" @blur="$v.currentFunction.description.$touch"></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select v-model="currentFunction.eval_after_position" :items="evalAfterSelection"
                    :label="$t('variants_definition.labels.eval_after')"></v-select>
        </v-col>
        <v-col cols="3">
          <v-combobox v-model="currentFunction.aggregate" counter="30"
                      :items="aggregateOptions"
                      :label="$t('variants_definition.labels.aggregate_name')"
                      :error-messages="funcAggErrors" @input="$v.currentFunction.aggregate.$touch" @blur="$v.currentFunction.aggregate.$touch"
                      type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="3">
          <v-switch v-model="currentFunction.is_loss" :label="$t('variants_definition.labels.target_function')"></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-select v-model="currentFunction.loss_function_description" :items="functionSelection"
                    :label="$t('variants_definition.labels.function')" :error-messages="funcLfDescErrors"
                    @input="$v.currentFunction.loss_function_description.$touch"
                    @blur="$v.currentFunction.loss_function_description.$touch"></v-select>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="currentFunction.variable_name" :label="$t('variants_definition.labels.variable_name')"
                        counter="20" placeholder="l_xyz" :error-messages="funcVarErrors"
                        @input="$v.currentFunction.variable_name.$touch" @blur="$v.currentFunction.variable_name.$touch"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn color="green" @click="dialogEditParams = true" :disabled="disabledEditParams">Parameter bearbeiten</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea rows="3" v-model="functionCall" :label="$t('variants_definition.labels.call')" :disabled="true"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea rows="3" v-model="functionCallView" :label="$t('variants_definition.labels.call')" :disabled="true"></v-textarea>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteFunction" @abort="closeDeleteFunction" @delete="deleteFunctionConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogEditParams" title="Parameter bearbeiten" @save="setParams" @close="dismissParams">
      <v-row>
        <v-col cols="12">
          <v-textarea rows="5" v-model="selectedFunctionDoc" :label="$t('variants_definition.labels.function_doc')" :disabled="true"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          Parameter hinzufügen
        </v-col>
        <v-col cols="3">
          <ParameterButton :params="functionParams" :tick="true" @click="addParam"></ParameterButton>
        </v-col>
        <v-col cols="3">
          <FunctionButton :boolVals="true" @click="addBoolParam"></FunctionButton>
        </v-col>
        <v-col cols="3">
          <v-text-field type="number" v-model="paramNumber" append-icon="mdi-check" @click:append="addNumberParam"></v-text-field>
        </v-col>
      </v-row>
      <v-row v-for="(param, index) in currentFunction.parameter_list_model" :key="index">
        <v-col cols="5">
          <v-text-field v-model="param.name" :disabled="true"></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="param.value" :disabled="true"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-icon small @click="deleteParam(index)">mdi-delete</v-icon>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogCardEditor v-model="dialogEditRestriction" @save="saveRestriction" @close="closeEditRestriction" :disabled-save="disabledSaveRestr">
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="currentRestriction.description" :label="$t('variants_definition.labels.description')"
                        counter="40" :error-messages="restrDescErrors"
                        @input="$v.currentRestriction.description.$touch" @blur="$v.currentRestriction.description.$touch"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select v-model="currentRestriction.eval_after_position" :items="evalAfterSelection" :label="$t('variants_definition.labels.eval_after')"></v-select>
        </v-col>
        <v-col cols="2">
          <v-btn color="green" @click="dialogRestrictionFormula = true">Bedingung bearbeiten</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="conditionView" :label="$t('variants_definition.labels.restriction')"
                        :disabled="true"></v-text-field>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteRestriction" @abort="closeDeleteRestriction" @delete="deleteRestrictionConfirm"></DialogDelete>

    <v-dialog v-model="dialogRestrictionFormula" max-width="600px">
      <FormulaEditor :title="$t('variants_definition.labels.restriction')" v-model="currentRestriction.restriction_model"
                     :parameters="functionParams" :inequality="true" @closeDialog="closeRestrictionFormula"></FormulaEditor>
    </v-dialog>

    <v-overlay :opacity="0.9" :value="infoFunctionOverlay" z-index="3000">
      <v-container>
        <div v-html="$t('process_creation.info.function_call')"></div>
      </v-container>
      <v-btn color="orange lighten-2" @click="infoFunctionOverlay = false">{{$t('general.dialog.close')}}</v-btn>
    </v-overlay>

  </div>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import FunctionButton from "./FunctionButton";
import {mapGetters} from "vuex";
import FormulaEditor from "./FormulaEditor";
import ParameterButton from "./ParameterButton";
import {helpers, maxLength, required} from "vuelidate/lib/validators";
const snake = helpers.regex('snake', /^[a-z_]*$/);

export default {
  name: "VariantsDefinition",
  components: {FunctionButton, ParameterButton, FormulaEditor, DialogCardEditor, DialogDelete},

  validations: {
    currentComponent: {
      component_api_name: { required },
      variable_name: { required, maxLength: maxLength(30), snake,
        varConvention(variable_name) { return variable_name.startsWith('c_'); }
      },
      description: { required, maxLength: maxLength(40) },
      aggregate: { required, maxLength: maxLength(30) }
    },
    currentFunction: {
      loss_function_description: { required },
      variable_name: { required, maxLength: maxLength(20), snake },
      description: { required, maxLength: maxLength(40) },
//      parameter_list: { required },
      aggregate: { required, maxLength: maxLength(30) }
    },
    currentRestriction: {
      description: { required, maxLength: maxLength(40) },
      restriction: { required }
    }
  },

  data: () => ({
    dialogEditVariant: false,
    dialogDeleteVariant: false,
    dialogEditComponent: false,
    dialogDeleteComponent: false,
    dialogEditFunction: false,
    dialogDeleteFunction: false,
    dialogEditRestriction: false,
    dialogDeleteRestriction: false,
    dialogEditParams: false,
    dialogRestrictionFormula: false,
    currentVariant: { name: '', variant_components: [], variant_functions: [], variant_restrictions: [] },
    currentVariantIndex: -1,
    currentComponent: { position: 0, component_api_name: '', variable_name: '', description: '', aggregate: '' },
    currentComponentIndex: -1,
    currentFunction: { position: 0, loss_function_description: '', variable_name: '', description: '',
                parameter_list: '', parameter_list_model: [], eval_after_position: 0, aggregate: '', is_loss: true },
    currentFunctionIndex: -1,
    currentRestriction: { description: '', restriction: '', restriction_model: [] },
    currentRestrictionIndex:-1,
    currentTargetFunc: [],
    paramNumber: 0,
    infoFunctionOverlay: false,
  }),

  props: {
    value: {
      type: Array,
      required: true
    },
    process: {
      type: Object,
      required: true
    },
    loss_functions: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters(['componentTypes']),
    disabledSaveVariant() {
      return this.currentVariant.name === '' ||  this.currentVariant.variant_components.length < 1
          ||  this.currentVariant.variant_functions.length < 1;
    },
    disabledEditComp() {
      return this.currentVariant.name === '';
    },
    disabledEditFunc() {
      return this.currentVariant.name === '' || this.currentVariant.variant_components.length < 1;
    },
    disabledEditRestr() {
      return this.currentVariant.name === '' || this.currentVariant.variant_components.length < 1
          || this.currentVariant.variant_functions.length < 1;
    },
    disabledSaveFunc() {
      return this.currentFunction.description === '' || this.currentFunction.aggregate === '' ||
          this.currentFunction.loss_function_description === '' || this.currentFunction.variable_name === '' ||
          this.currentFunction.parameter_list_model.length < 1;
    },
    disabledEditParams() {
      return this.currentFunction.loss_function_description === '';
    },
    disabledSaveRestr() {
      return this.currentRestriction.description === '' || this.currentRestriction.restriction_model.length < 1;
    },
    functionParams() {
      return [ [this.currentVariant.variant_functions.map(f => { return { formula: f.variable_name, view: f.description }}),
          this.process.process_parameters.map(p => { return { formula: p.variable_name, view: p.name + ' [' + p.unit + ']' }})].flat(),
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
    functionSelection() {
      return this.loss_functions.map(f => { return { text: f.description, value: f.description} });
    },
    evalAfterSelection() {
      return [ { text: '-', value: 0 }, ...this.currentVariant.variant_components.map((c, i) => { return { text: c.description, value: i+1 } })];
    },
    selectedFunctionDoc() {
      return this.currentFunction.loss_function_description === '' ?
          '' :
          this.loss_functions.filter(f => this.currentFunction.loss_function_description === f.description)[0].doc;
    },
    aggregateOptions() {
      return [...new Set(
          [...this.currentVariant.variant_functions.map(f => f.aggregate),
            ...this.value.map(v => v.variant_functions.map(vf => vf.aggregate)).flat(2),
            ...this.currentVariant.variant_components.map(c => c.aggregate),
            ...this.value.map(v => v.variant_components.map(vc => vc.aggregate)).flat(2)
          ]
      )];
    },
    variantEditTitle() {
      return this.currentVariantIndex < 0 ? this.$t('general.editing.create') : this.$t('general.editing.edit');
    },
    functionCallView() {
      return this.currentFunction.description + ' = ' + this.currentFunction.loss_function_description +
          '(' + this.currentFunction.parameter_list_model.map(p => p.name).join(', ') + ')';
    },
    functionCall() {
      return this.currentFunction.variable_name + ' = target_func' + this.signatureView;
    },
    signatureView() {
      return '(' + this.currentFunction.parameter_list_model.map(p => p.value).join(', ') + ')';
    },
    conditionView() {
      return '0 ' + this.currentRestriction.restriction_model.map(p => p.formula).join(' ');
    },
    compDescErrors() {
      let errors = [];
      if (!this.$v.currentComponent.description.$dirty) return errors;
      !this.$v.currentComponent.description.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentComponent.description.maxLength && errors.push(this.$t('general.validation.max40'));
      return errors;
    },
    compApiErrors() {
      let errors = [];
      if (!this.$v.currentComponent.component_api_name.$dirty) return errors;
      !this.$v.currentComponent.description.required && errors.push(this.$t('general.validation.required'));
      return errors;
    },
    compVarErrors() {
      let errors = [];
      if (!this.$v.currentComponent.variable_name.$dirty) return errors;
      !this.$v.currentComponent.variable_name.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentComponent.variable_name.maxLength && errors.push(this.$t('general.validation.max30'));
      !this.$v.currentComponent.variable_name.snake && errors.push(this.$t('general.validation.snake'));
      !this.$v.currentComponent.variable_name.varConvention && errors.push(this.$t('process_definition.validation.startsWithCLowDash'));
      return errors;
    },
    compAggErrors() {
      let errors = [];
      if (!this.$v.currentComponent.aggregate.$dirty) return errors;
      !this.$v.currentComponent.aggregate.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentComponent.aggregate.maxLength && errors.push(this.$t('general.validation.max30'));
      return errors;
    },
    funcDescErrors() {
      let errors = [];
      if (!this.$v.currentFunction.description.$dirty) return errors;
      !this.$v.currentFunction.description.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentFunction.description.maxLength && errors.push(this.$t('general.validation.max40'));
      return errors;
    },
    funcLfDescErrors() {
      let errors = [];
      if (!this.$v.currentFunction.loss_function_description.$dirty) return errors;
      !this.$v.currentFunction.loss_function_description.required && errors.push(this.$t('general.validation.required'));
      return errors;
    },
    funcVarErrors() {
      let errors = [];
      if (!this.$v.currentFunction.variable_name.$dirty) return errors;
      !this.$v.currentFunction.variable_name.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentFunction.variable_name.maxLength && errors.push(this.$t('general.validation.max20'));
      !this.$v.currentFunction.variable_name.snake && errors.push(this.$t('general.validation.snake'));
      return errors;
    },
    funcAggErrors() {
      let errors = [];
      if (!this.$v.currentFunction.aggregate.$dirty) return errors;
      !this.$v.currentFunction.aggregate.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentFunction.aggregate.maxLength && errors.push(this.$t('general.validation.max30'));
      return errors;
    },
    restrDescErrors() {
      let errors = [];
      if (!this.$v.currentRestriction.description.$dirty) return errors;
      !this.$v.currentRestriction.description.required && errors.push(this.$t('general.validation.required'));
      !this.$v.currentRestriction.description.maxLength && errors.push(this.$t('general.validation.max40'));
      return errors;
    },
    restrRestrErrors() {
      let errors = [];
      if (!this.$v.currentRestriction.restriction.$dirty) return errors;
      !this.$v.currentRestriction.restriction.required && errors.push(this.$t('general.validation.required'));
      return errors;
    }
  },

  methods: {
    componentList(variant) {
      return variant.variant_components.map(c => c.description).join(' ');
    },
    editVariant(index, copy) {
      this.currentVariantIndex = copy ? -1 : index;
      this.currentVariant = Object.assign({},
          index < 0 ?
              { name: '', variant_components: [], variant_functions: [], variant_restrictions: [] } :
              this.value[index]);
      if (copy) {
        this.currentVariant.name = '';
      }
      this.dialogEditVariant = true;
    },
    saveVariant() {
      if (this.currentVariantIndex < 0) {
        this.value.push(this.currentVariant);
      } else {
        this.value.splice(this.currentVariantIndex, 1, this.currentVariant);
      }
      this.closeEditVariant();
    },
    closeEditVariant() {
      this.currentVariantIndex = -1;
      this.dialogEditVariant = false;
    },
    deleteVariant(index) {
      this.currentVariantIndex = index;
      this.dialogDeleteVariant = true;
    },
    deleteVariantConfirm() {
      this.value.splice(this.currentVariantIndex, 1);
      this.closeDeleteVariant();
    },
    closeDeleteVariant() {
      this.dialogDeleteVariant = false;
    },

    editComponent(index) {
      this.currentComponentIndex = index;
      this.currentComponent = Object.assign({},
          index < 0
              ? { position: this.currentVariant.variant_components.length, component_api_name: '', variable_name: '',
                description: '', aggregate: '' }
              : this.currentVariant.variant_components[index]);
      this.dialogEditComponent = true;
    },
    saveComponent() {
      this.$v.currentComponent.$touch();
      if (this.$v.currentComponent.$invalid) {
        return;
      }
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
      this.currentVariant.variant_components.splice(this.currentVariantIndex, 1);
      this.adjustComponentPositions();
      this.closeDeleteComponent();
    },
    closeDeleteComponent() {
      this.currentComponentIndex = -1;
      this.dialogDeleteComponent = false;
    },
    adjustComponentPositions() {
      this.currentVariant.variant_components.forEach((c, i) => {
        if (i > this.currentComponentIndex) c.position = this.currentComponentIndex;
      } );
      this.currentVariant.variant_functions.forEach((f) => {
        if (f.eval_after_position > this.currentComponentIndex) f.eval_after_position -= 1;
      } );
      this.currentVariant.variant_restrictions.forEach((r) => {
        if (r.eval_after_position > this.currentComponentIndex) r.eval_after_position -= 1;
      } );
    },
    disabledDeleteComp(index) {
      return this.currentVariant.variant_functions.some(f => f.eval_after_position === index + 1) ||
          this.currentVariant.variant_restrictions.some(r => r.eval_after_position === index + 1) ||
          this.componentUsed(index);
    },
    componentUsed(index) {
      return this.currentVariant.variant_functions.
            some(f => f.parameter_list_model.map(p => (typeof p.value === 'string') && p.value.split('[')[0]).
                      includes(this.currentVariant.variant_components[index].variable_name)) ||
          this.currentVariant.variant_restrictions.
            some(r => r.restriction_model.map(r => (typeof r.value === 'string') && r.value.split('[')[0]).
                      includes(this.currentVariant.variant_components[index].variable_name))
    },
    componentUp(index) {
      this.currentVariant.variant_components[index - 1].position += 1;
      this.currentVariant.variant_components[index].position -= 1;
      this.currentVariant.variant_functions.forEach((f) => {
        if (f.eval_after_position === index) f.eval_after_position += 1;
        if (f.eval_after_position === index + 1) f.eval_after_position -= 1;
      } );
      this.currentVariant.variant_restrictions.forEach((r) => {
        if (r.eval_after_position === index) r.eval_after_position += 1;
        if (r.eval_after_position === index + 1) r.eval_after_position -= 1;
      } );
      let moved = this.currentVariant.variant_components.splice(index, 1);
      this.currentVariant.variant_components.splice(index - 1, 0, ...moved);
    },
    componentDown(index) {
      this.currentVariant.variant_components[index + 1].position -= 1;
      this.currentVariant.variant_components[index].position += 1;
      this.currentVariant.variant_functions.forEach((f) => {
        if (f.eval_after_position === index + 2) f.eval_after_position -= 1;
        if (f.eval_after_position === index + 1) f.eval_after_position += 1;
      } );
      this.currentVariant.variant_restrictions.forEach((r) => {
        if (r.eval_after_position === index + 2) r.eval_after_position -= 1;
        if (r.eval_after_position === index + 1) r.eval_after_position += 1;
      } );
      let moved = this.currentVariant.variant_components.splice(index, 1);
      this.currentVariant.variant_components.splice(index + 1, 0, ...moved);
    },

    editFunction(index) {
      this.currentFunctionIndex = index;
      this.currentFunction = Object.assign({},
          index < 0 ?
              { position: this.currentVariant.variant_functions.length, loss_function_description: '', variable_name: '',
                description: '', parameter_list: '', parameter_list_model: [], eval_after_position: 0, aggregate: '', is_loss: true } :
              this.currentVariant.variant_functions[index]);
      this.dialogEditFunction = true;
    },
    saveFunction() {
      this.$v.currentFunction.$touch();
      if (this.$v.currentFunction.$invalid) {
        return;
      }
      if (typeof this.currentFunction.aggregate === 'object') {
        this.currentFunction.aggregate = this.currentFunction.aggregate.value;
      }
      if (this.currentFunctionIndex < 0) {
        this.currentVariant.variant_functions.push(this.currentFunction);
      } else {
        this.currentVariant.variant_functions.splice(this.currentFunctionIndex, 1, this.currentFunction);
      }
      this.closeEditFunction();
    },
    closeEditFunction() {
      this.currentFunctionIndex = -1;
      this.dialogEditFunction = false;
    },
    deleteFunction(index) {
      this.currentFunctionIndex = index;
      this.dialogDeleteFunction = true;
    },
    deleteFunctionConfirm() {
      this.currentVariant.variant_functions.splice(this.currentFunctionIndex, 1);
      this.adjustFunctionPositions();
      this.closeDeleteFunction();
    },
    closeDeleteFunction() {
      this.dialogDeleteFunction = false;
    },
    adjustFunctionPositions() {
      this.currentVariant.variant_functions.forEach((f, i) => {
        if (i > this.currentFunctionIndex) f.position = this.currentFunctionIndex;
      } );
    },
    functionUp(index) {
      this.currentVariant.variant_functions[index - 1].position += 1;
      this.currentVariant.variant_functions[index].position -= 1;
      let moved = this.currentVariant.variant_functions.splice(index, 1);
      this.currentVariant.variant_functions.splice(index - 1, 0, ...moved);
    },
    functionDown(index) {
      this.currentVariant.variant_functions[index + 1].position -= 1;
      this.currentVariant.variant_functions[index].position += 1;
      let moved = this.currentVariant.variant_functions.splice(index, 1);
      this.currentVariant.variant_functions.splice(index + 1, 0, ...moved);
    },

    addParam(val) {
      this.currentFunction.parameter_list_model.push({ name: val.view, value: val.formula });
    },
    addNumberParam() {
      this.currentFunction.parameter_list_model.push({ name: this.paramNumber, value: this.paramNumber });
      this.paramNumber = 0;
    },
    addBoolParam(val) {
      this.currentFunction.parameter_list_model.push({ name: val.view, value: val.formula });
    },
    deleteParam(index) {
      this.currentFunction.parameter_list_model.splice(index, 1);
    },
    setParams() {
      this.currentFunction.parameter_list = this.signatureView
      this.dialogEditParams = false;
    },
    dismissParams() {
      this.currentFunction.parameter_list_model.splice(0, this.currentFunction.parameter_list_model.length);
      this.dialogEditParams = false;
    },

    editRestriction(index) {
      this.currentRestrictionIndex = index;
      this.currentRestriction = Object.assign({},
          index < 0 ?
              { restriction: '', eval_after_position: 0, description: '', restriction_model: [] } :
              this.currentVariant.variant_restrictions[index]);
      this.dialogEditRestriction = true;
    },
    saveRestriction() {
      this.$v.currentRestriction.$touch();
      if (this.$v.currentRestriction.$invalid) {
        return;
      }
      if (this.currentRestrictionIndex < 0) {
        this.currentVariant.variant_restrictions.push(this.currentRestriction);
      } else {
        this.currentVariant.variant_restrictions.splice(this.currentRestrictionIndex, 1, this.currentRestriction);
      }
      this.closeEditRestriction();
    },
    closeEditRestriction() {
      this.currentRestrictionIndex = -1;
      this.dialogEditRestriction = false;
    },
    deleteRestriction(index) {
      this.currentRestrictionIndex = index;
      this.dialogDeleteRestriction = true;
    },
    deleteRestrictionConfirm() {
      this.currentVariant.variant_restrictions.splice(this.currentRestrictionIndex, 1);
      this.closeDeleteRestriction();
    },
    closeDeleteRestriction() {
      this.dialogDeleteRestriction = false;
    },
    closeRestrictionFormula(val) {
      if (val) {
        this.currentRestriction.restriction = this.conditionView;
            //JSON.parse(JSON.stringify(this.currentCondition));
      }
      this.dialogRestrictionFormula = false;
    },
    restrictionUp(index) {
      this.currentVariant.variant_restrictions[index - 1].position += 1;
      this.currentVariant.variant_restrictions[index].position -= 1;
      let moved = this.currentVariant.variant_restrictions.splice(index, 1);
      this.currentVariant.variant_restrictions.splice(index - 1, 0, ...moved);
    },
    restrictionDown(index) {
      this.currentVariant.variant_restrictions[index + 1].position -= 1;
      this.currentVariant.variant_restrictions[index].position += 1;
      let moved = this.currentVariant.variant_restrictions.splice(index, 1);
      this.currentVariant.variant_restrictions.splice(index + 1, 0, ...moved);
    },
    componentViewName(api_name) {
      return this.componentTypes.find(c => c.api_name === api_name).view_name;
    }
  }
}
</script>

<style scoped>

</style>