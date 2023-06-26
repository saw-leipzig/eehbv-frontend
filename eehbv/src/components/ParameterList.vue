<template>
  <v-card>
    <v-card-title v-if="showTitle">{{$t('process_definition.titles.parameters')}}</v-card-title>
    <v-card-text>
      <v-card v-for="(param, index) in parameters" :key="index">
        <v-container>
          <v-row>
            <v-col cols="3">{{ $t('process_definition.labels.name') }}: {{ param.name }}</v-col>
            <v-col cols="3">{{ $t('process_definition.labels.variable_name') }}: {{ param.variable_name }}</v-col>
            <v-col cols="3">{{ $t('process_definition.labels.material_property') }} :
              {{ propertyById(param.material_properties_id) }}
            </v-col>
            <v-col cols="2">{{ $t('process_definition.labels.unit') }}: {{ param.unit }}</v-col>
            <v-col cols="1" v-if="showEdit">
              <v-icon small class="mr-2" @click="$emit('edit', index)" :disabled="editDisabled(param)">mdi-pencil</v-icon>
              <v-icon small v-if="showDelete" @click="$emit('delete', index)" :disabled="editDisabled(param)">mdi-delete</v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">{{ $t('process_definition.labels.general') }} : {{ boolText(param.general) }}</v-col>
            <v-col cols="9">{{ $t('process_definition.labels.defaults') }} : {{ param.defaults }}</v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-card-text>
    <v-card-actions v-if="showAdd">
      <v-spacer></v-spacer>
      <v-btn color="green" @click="$emit('edit', -1)"><v-icon>mdi-plus</v-icon></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import textView from "../mixins/textView";

export default {
  name: "ParameterList",
  mixins: [ textView ],

  props: {
    parameters: {
      type: Array,
      required: true
    },
    showAdd: {
      type: Boolean,
      required: false,
      default: true
    },
    showDelete: {
      type: Boolean,
      required: false,
      default: true
    },
    showEdit: {
      type: Boolean,
      required: false,
      default: true
    },
    showDep: {
      type: Boolean,
      required: false,
      default: false
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    },
    variants: {
      type: Array,
      required: false,
      default() {
          return []
      }
    }
  },

  computed: {
    ...mapGetters(['propertyById'])
  },

  methods: {
    editDisabled(param) {
      return this.variants.length > 0 &&
          (this.variants.some(v => v.variant_functions.some(f =>
                  f.parameter_list_model.some(p => p.value === param.variable_name))) ||
          this.variants.some(v => v.variant_restrictions.some(r =>
              r.restriction_model.some(m => m.formula === param.variable_name)))
      );
    }
  }
}
</script>

<style scoped>

</style>