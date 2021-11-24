<template>
  <div>
    <v-container>
      <v-row v-for="(condition, index) in conditions" :key="index">
        <v-col cols="11">{{ conditionView(condition) }}</v-col>
        <v-col cols="1">
          <v-icon small class="mr-2" @click="editItem(condition, index)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(index)">mdi-delete</v-icon>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn @click="editItem([], -1)">{{ $t('general.editing.add') }}</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="editDialog" max-width="600px">
      <FormulaEditor :title="title" v-model="currentCondition" :parameters="params" :inequality="true" @closeDialog="closeEdit"></FormulaEditor>
    </v-dialog>
  </div>
</template>

<script>
import FormulaEditor from "./FormulaEditor";
import {mapGetters} from "vuex";

export default {
  name: "RestrictionList",
  components: {FormulaEditor},

  model: {
    prop: 'conditions',
    event: 'input'
  },

  data: () => ({
    //conditions: [],
    currentCondition: [],
    currentIndex: -1,
    editDialog: false,
    title: ''
  }),

  props: {
    conditions: {
      type: Array,
      required: true
    },
    variant: {
      type: Object,
      required: true
    },
    parameters: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters(['componentTypes']),
    params() {
      return [ this.parameters.map(p => {return { formula: p.variable_name, view: p.name + ' [' + p.unit + ']' }}),
        this.variant.components.map(c => {
          return { formula: c.variable_name, view: c.description,
            parameters: this.componentTypes.filter(t => t.api_name === c.component_api_name).
                map(t => t.infos.filter(i => i.column_name !== 'name' && i.column_name !== 'manufacturer').
                map(i => {return { formula: i.column_name, view: i.view_name + (i.unit ? ' [' + i.unit + ']' : '') }}))[0]
          }
        })
      ];
    }
  },

  methods: {
    editItem(item, index) {
      this.title = item.length > 0 ? this.$t('general.editing.edit') : this.$t('general.editing.create');
      this.currentCondition.splice(0);
      this.currentCondition.push(...JSON.parse(JSON.stringify(item)));
      this.currentIndex = index;
      this.editDialog = true;
    },
    deleteItem(index) {
      this.conditions.splice(index, 1);
    },
    conditionView(condition) {
      return '0 ' + condition.map(p => p.formula).join(' ');
    },
    closeEdit(val) {
      if (val) {
        let item = JSON.parse(JSON.stringify(this.currentCondition));
        if (this.currentIndex > -1) {
          this.conditions.splice(this.currentIndex, 1, item);
        } else {
          this.conditions.push(item);
        }
      }
      this.editDialog = false;
    }
  }
}
</script>

<style scoped>

</style>