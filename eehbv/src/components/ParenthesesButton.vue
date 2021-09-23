<template>
  <v-menu :disabled="disabled" open-on-hover offset-y>
    <template v-slot:activator="{ on, attrs}">
      <v-btn :disabled="disabled" icon v-bind="attrs" v-on="on">
        <v-icon>mdi-code-parentheses</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(parenthesis, index) in parentheses" v-if="index === 0 && !disabledOpen || index === 1 && !disabledClose" :key="index">
        <!-- ToDo: Check disabled on v-list-item again-->
        <v-list-item-title @click="click(parenthesis, index)">{{parenthesis.formula}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "ParenthesesButton",

  data() {
    return {
      parentheses: [
        { formula: '(', view: '(', state: 'O' },
        { formula: ')', view: ')', state: 'C' }
      ]
    }
  },

  props: {
    disabledClose: {
      type: Boolean,
      required: false,
      default: false
    },
    disabledOpen: {
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

  methods: {
    click(p, index) {
      //if ((index === 0 && !this.disabledOpen) || (index === 1 && !this.disabledClose)) {
        this.$emit('click', p);
      //}
    }
  }
}
</script>

<style scoped>

</style>