<template>
  <v-menu :disabled="disabled" open-on-hover offset-y>
    <template v-slot:activator="{ on, attrs}">
      <v-btn :disabled="disabled" icon v-bind="attrs" v-on="on">
        <v-icon>{{trigonometric ? 'mdi-alpha' : 'mdi-function'}}</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(func, index) in functions" :key="index">
        <v-list-item-title @click="$emit('click', func)">{{func.view}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "FunctionButton",

  data() {
    return {
      basicFunctions: [
        { formula: 'exp(', view: 'exp', state: 'O' },
        { formula: 'sqrt(', view: 'sqrt', state: 'O' },
        { formula: 'log(', view: 'log', state: 'O' },
        { formula: 'ln(', view: 'ln', state: 'O' },
        { formula: 'abs(', view: 'abs', state: 'O' }
      ],
      trigonometricFunctions: [
        { formula: 'sin(', view: 'sin', state: 'O' },
        { formula: 'cos(', view: 'cos', state: 'O' },
        { formula: 'tan(', view: 'tan', state: 'O' },
        { formula: 'cot(', view: 'cot', state: 'O' }
      ]
    }
  },

  props: {
    trigonometric: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    functions() {
      return this.trigonometric ? this.trigonometricFunctions : this.basicFunctions;
    }
  }
}
</script>

<style scoped>

</style>