<template>
  <v-menu open-on-hover offset-x v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs}">
      <v-btn :disabled="disabled" plain v-bind="attrs" v-on="on">
        var
        <v-icon right>mdi-menu-right</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-treeview :activatable="true" :items="treeParameters" item-text="view" item-key="id" item-disabled="disabled"
                  item-children="parameters" return-object dense @update:active="click"></v-treeview>
<!--      <v-card-actions>
        <v-btn text @click="menu = false">Schließen</v-btn>
      </v-card-actions>-->
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
    /**
     * Expects array with two elements, an array of process parameters in first element, an array of variant's components
     * with parameters as subarray each, with formula and view as keys and texts on both levels. Example:
     * [ [{formula: '...', view: '...'},], [{formula: '...', view: '...', parameters: [{formula: '...', view: '...'},]},] ]
     */
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
          id: '0',
          disabled: this.params[0].length < 1,
          parameters: this.params[0].map((p, i) => { return {...p, id: '0-'+ i}})
        },
        {
          view: 'Komponenten',
          id: '1',
          disabled: this.params[1].length < 1,
          parameters: this.params[1].map((p, i) => {
            return { formula: p.formula, view: p.view, id: '1-'+ i,
              parameters: p.parameters.map((c, j) => { return {...c, id: '1-'+ i + '-' + j}})
            }
          })
        }
      ];
    }
  },

  methods: {
    click(node) {
      let item = node[0];
      if (typeof item === 'undefined' || this.parentClicked(item.id)) {
        return;
      }
      let parent = item.id.startsWith('1') ?
          this.treeParameters[1].parameters.find(p => p.id === item.id.substr(0, p.id.length)) : {};
      this.$emit('click',
          item.id.startsWith('0') ?
              { formula: item.formula, view: item.view, state: 'V' } :
              { formula: parent.formula + '[' +item.formula + ']', view: parent.view + '[' + item.view + ']', state: 'V'}
      );
      this.menu = false;
    },
    parentClicked(id) {
      return (id.startsWith('0') && id.length < 3) || (id.startsWith('1') && id.length < 5);
    }
  }
}
</script>

<style scoped>

</style>