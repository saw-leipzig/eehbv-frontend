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
        <v-col cols="2"><ParameterButton :disabled="disabledV" :params="parameters"></ParameterButton></v-col>
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
        Abbrechen
      </v-btn>
      <v-btn color="green darken-1" text @click="close(true)" :disabled="disabledSave">
        Speichern
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
      conditions: [],
      number: 0,
      state: []
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
    }
  },

  computed: {
    disabledV() {
      return this.disabledInequality || this.state.at(-1) === 'V';
    },
    disabledS() {
      return this.disabledStart || this.state.at(-1) === 'O' || this.state.at(-1) === 'B';
    },
    disabledF() {
      return this.disabledInequality || this.state.at(-1) === 'C' || this.state.at(-1) === 'V';
    },
    disabledB() {
      return this.disabledStart || this.state.at(-1) === 'B' || this.state.at(-1) === 'O';
    },
    disabledC() {
      return this.state.at(-1) === 'O' ||
          this.state.at(-1) === 'B' ||
          (this.state.filter(s => s === 'O').length <= this.state.filter(s => s === 'C').length);
    },
    disabledO() {
      return this.state.at(-1) === 'V';
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
      return this.disabledStart || this.state.at(-1) === 'B' ||
          (this.state.filter(s => s === 'O').length !== this.state.filter(s => s === 'C').length);
    },
    formula() {
      return this.value.filter((v, p) => p > (this.inequality ? 0 : -1)).map(v => v.formula).join(' ');
    }
  },

  methods: {
    close(save) {
      this.state.splice(0);
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
      this.value.push({ formula: val, view: val});
      this.state.push('V');
    },
    addBasic(operator) {
      this.value.push({ formula: operator, view: operator});
      this.state.push('B');
    },
    addParenthesis(p) {
      this.value.push(p);
      this.state.push(p.formula === '(' ? 'O' : 'C')
    },
    addFunc(func) {
      this.value.push(func);
      this.state.push('O');
    },
    addSquare() {
      this.value.push({ formula: '^2', view: '^2'});
      this.state.push('V');
    },
    addExp() {
      this.value.push({ formula: '^(', view: '^('});
      this.state.push('O');
    },
    addNumber() {
      this.value.push({ formula: this.number, view: this.number});
      this.number = 0;
      this.state.push('V');
    },
    addParameter(p) {
      this.value.push(p);
      this.state.push('V');
    },
    del() {
      if (this.value.length > this.inequality ? 2 : 1) {
        this.value.splice(-1);
      }
      this.state.splice(-1);
    }
  }
}
</script>

<style scoped>

</style>