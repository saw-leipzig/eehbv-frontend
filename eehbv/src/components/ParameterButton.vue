<template>
  <v-menu open-on-hover offset-x v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs}">
      <v-btn :disabled="disabled" plain v-bind="attrs" v-on="on">
        var
        <v-icon right>mdi-menu-right</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-treeview :items="treeParameters" item-text="view" item-key="formula" item-children="parameters"></v-treeview>
      <v-card-actions>
        <v-btn text @click="menu = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "ParameterButton",

  data() {
    return {
      menu: false
    }
  },

  props: {
    params: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    treeParameters() {
      return [
        {
          view: 'Prozess',
          formula: '1',
          parameters: this.params[0]
        },
        {
          view: 'Komponenten',
          formula: '2',
          parameters: this.params[1]
        }
      ];
    }
  }
}
</script>

<style scoped>

</style>