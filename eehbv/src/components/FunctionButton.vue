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
        { formula: 'exp(', view: 'exp' },
        { formula: 'sqrt(', view: 'sqrt' },
        { formula: 'log(', view: 'log' },
        { formula: 'ln(', view: 'ln' },
        { formula: 'abs(', view: 'abs' }
      ],
      trigonometricFunctions: [
        { formula: 'sin(', view: 'sin' },
        { formula: 'cos(', view: 'cos' },
        { formula: 'tan(', view: 'tan' },
        { formula: 'cot(', view: 'cot' }
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