<template>
  <v-card>
    <v-card-title>{{title}}</v-card-title>

    <v-card-text>
      <v-row v-if="inequality">
        <v-col cols="12">
          0
          <ComparatorButton :comparator="comparator" @changed="comparatorChanged"></ComparatorButton>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col cols="12">
          {{signature}}
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">{{formula}}</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="4"><v-text-field type="number" :disabled="disabledV" v-model="number" append-icon="mdi-check" @click:append="addNumber"></v-text-field></v-col>
        <v-col cols="2"><v-btn icon :disabled="disabledB" @click="addBasic('+')"><v-icon>mdi-plus</v-icon></v-btn></v-col>
        <v-col cols="2"><v-btn icon :disabled="disabledB" @click="addBasic('-')"><v-icon>mdi-minus</v-icon></v-btn></v-col>
        <v-col cols="2"><v-btn icon :disabled="disabledB" @click="addBasic('*')"><v-icon>mdi-multiplication</v-icon></v-btn></v-col>
        <v-col cols="2"><v-btn icon :disabled="disabledB" @click="addBasic('/')"><v-icon>mdi-division</v-icon></v-btn></v-col>
      </v-row>
      <v-row>
        <v-col cols="2"><ParameterButton :disabled="disabledV" :params="parameters" @click="addParameter"></ParameterButton></v-col>
        <v-col cols="2"><v-btn :disabled="disabledS" icon @click="addSquare"><v-icon>mdi-format-superscript</v-icon></v-btn></v-col>
        <v-col cols="2"><v-btn :disabled="disabledS" icon @click="addExp">x^y</v-btn></v-col>
        <v-col cols="2"><FunctionButton :disabled="disabledF" @click="addFunc"></FunctionButton></v-col>
        <v-col cols="2"><FunctionButton :disabled="disabledF" :trigonometric="true" @click="addFunc"></FunctionButton></v-col>
        <v-col cols="2">
          <ParenthesesButton :disabled="disabledInequality" :disabled-close="disabledC" :disabled-open="disabledO" @click="addParenthesis"></ParenthesesButton>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2"><v-btn icon :disabled="disabledV" @click="addConst('π')"><v-icon>mdi-pi</v-icon></v-btn></v-col>
        <v-col cols="2"><v-btn icon :disabled="disabledV" @click="addConst('e')">e</v-btn></v-col>
        <v-col cols="2"></v-col>
        <v-col cols="2"></v-col>
        <v-col cols="2"></v-col>
        <v-col cols="2"><v-btn icon :disabled="value.length < 1" @click="del"><v-icon>mdi-backspace</v-icon></v-btn></v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="close(false)">
        {{ $t('general.dialog.abort') }}
      </v-btn>
      <v-btn color="green darken-1" text @click="close(true)" :disabled="disabledSave">
        {{ $t('general.dialog.save') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ComparatorButton from "./ComparatorButton";
import ParenthesesButton from "./ParenthesesButton";
import FunctionButton from "./FunctionButton";
import ParameterButton from "./ParameterButton";
export default {
  name: "FormulaEditor",
  components: {ParameterButton, FunctionButton, ParenthesesButton, ComparatorButton},
  data() {
    return {
      number: 0
    }
  },

  props: {
    value: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    inequality: {
      type: Boolean,
      required: true
    },
    parameters: {
      type: Array,
      required: true
    },
    signature: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    disabledV() {
      return this.disabledInequality || this.lastIsValue || this.lastIsCloseParenthesis;
    },
    disabledS() {
      return this.disabledStart ||
          this.lastIsOpenParenthesis || this.lastIsBasicOperator;
    },
    disabledF() {
      return this.disabledInequality ||
          this.lastIsCloseParenthesis || this.lastIsValue;
    },
    disabledB() {
      return this.disabledStart ||
          this.lastIsBasicOperator || this.lastIsOpenParenthesis;
    },
    disabledC() {
      return this.lastIsOpenParenthesis ||
          this.lastIsBasicOperator ||
          (this.value.filter(s => s.state === 'O').length <= this.value.filter(s => s.state === 'C').length);
    },
    disabledO() {
      return this.lastIsValue;
    },
    comparator() {
      return this.value.length > 0 ? this.value[0].formula : '?';
    },
    disabledInequality() {
      return this.inequality && this.value.length < 1;
    },
    disabledStart() {
      return (this.value.length < (this.inequality ? 2 : 1));
    },
    disabledSave() {
      return this.disabledStart || this.lastIsBasicOperator ||
          (this.value.filter(s => s.state === 'O').length !== this.value.filter(s => s.state === 'C').length);
    },
    formula() {
      return this.value.filter((v, p) => p > (this.inequality ? 0 : -1)).map(v => v.formula).join(' ');
    },
    lastState() {
      return this.value.length === 0 ? '' : this.value[this.value.length-1].state;
    },
    lastIsValue() {
      return this.lastState === 'V';
    },
    lastIsOpenParenthesis() {
      return this.lastState === 'O';
    },
    lastIsCloseParenthesis() {
      return this.lastState === 'C';
    },
    lastIsBasicOperator() {
      return this.lastState === 'B';
    }
  },

  methods: {
    close(save) {
      this.$emit('closeDialog', save);
    },
    comparatorChanged(val) {
      if (this.value.length > 0) {
        this.value.splice(0, 1, val);
      } else {
        this.value.push(val);
      }
    },
    addConst(val) {
      this.value.push({ formula: val, view: val, state: 'V'});
    },
    addBasic(operator) {
      this.value.push({ formula: operator, view: operator, state: 'B'});
    },
    addParenthesis(p) {
      this.value.push(p);
    },
    addFunc(func) {
      this.value.push(func);
    },
    addSquare() {
      this.value.push({ formula: '^2', view: '^2', state: 'V'});
    },
    addExp() {
      this.value.push({ formula: '^(', view: '^(', state: 'O'});
    },
    addNumber() {
      this.value.push({ formula: this.number, view: this.number, state: 'V'});
      this.number = 0;
    },
    addParameter(p) {
      this.value.push(p);
    },
    del() {
      if (this.value.length > this.inequality ? 2 : 1) {
        this.value.splice(-1);
      }
    }
  }
}
</script>

<style scoped>

</style>