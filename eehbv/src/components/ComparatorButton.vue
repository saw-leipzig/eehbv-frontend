<template>
  <v-menu open-on-hover offset-y>
    <template v-slot:activator="{ on, attrs}">
      <v-btn plain v-bind="attrs" v-on="on">
        {{comparator}}
        <v-icon right>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(comp, index) in comparators" :key="index">
        <v-list-item-title @click="$emit('changed', comp)">{{comp.formula}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "ComparatorButton",

  data() {
    return {
      comparators: [
        { formula: '<', view: 'LT', state: '' },
        { formula: '<=', view: 'LE', state: '' },
        { formula: '=', view: 'EQ', state: '' },
        { formula: '>=', view: 'GE', state: '' },
        { formula: '>', view: 'GT', state: '' }
      ]
    }
  },

  props: {
    comparator: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>