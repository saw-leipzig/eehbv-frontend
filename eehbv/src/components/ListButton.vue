<template>
  <v-menu color="green" :disabled="disabled" open-on-hover offset-y>
    <template v-slot:activator="{ on, attrs}">
      <v-btn :color="color" :disabled="disabled" v-bind="attrs" v-on="on">
        {{title}}
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in listItems" :key="index">
        <v-list-item-title @click="$emit('click', item.value)">{{item.text}}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "ListButton",

  props: {
    title: {
      type: String,
      required: false,
      default: ""
    },
    listItems: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    color: {
      type: String,
      required: false,
      default: "green"
    }
  }
}
</script>

<style scoped>

</style>