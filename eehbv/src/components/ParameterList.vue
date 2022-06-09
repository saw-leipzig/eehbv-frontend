<template>
  <v-card>
    <v-card-title v-if="showTitle">{{$t('process_definition.titles.parameters')}}</v-card-title>
    <v-card-text>
      <v-card v-for="(param, index) in parameters" :key="index" v-if="!showDep || !showEdit || param.restricting || param.dependent">
        <v-container>
          <v-row>
            <v-col cols="3">{{ $t('process_definition.labels.name') }}: {{ param.name }}</v-col>
            <v-col cols="3">{{ $t('process_definition.labels.variable_name') }}: {{ param.variable_name }}</v-col>
            <v-col cols="3">{{ $t('process_definition.labels.material_property') }} :
              {{ propertyById(param.material_properties_id) }}
            </v-col>
            <v-col cols="2">{{ $t('process_definition.labels.unit') }}: {{ param.unit }}</v-col>
            <v-col cols="1" v-if="showEdit">
              <v-icon small class="mr-2" @click="$emit('edit', index)">mdi-pencil</v-icon>
              <v-icon small v-if="showDelete" @click="$emit('delete', index)">mdi-delete</v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">{{ $t('process_definition.labels.general') }} : {{ boolText(param.general) }}</v-col>
            <v-col cols="3">{{ $t('process_definition.labels.dependent') }} : {{ boolText(param.dependent) }}</v-col>
            <v-col cols="3">{{ $t('process_definition.labels.restricting') }} : {{ boolText(param.restricting) }}</v-col>
          </v-row>
          <v-row v-if="showDep && param.restricting">
            <v-col cols="6">
              {{ $t('process_definition.labels.column_lower') }} : {{ param.min_column }}
            </v-col>
            <v-col cols="6">
              {{ $t('process_definition.labels.column_upper') }} : {{ param.max_column }}
            </v-col>
          </v-row>
          <v-row v-if="param.dependent">
            <v-col cols="3">{{$t('process_definition.labels.derived_param') }} : {{ param.derived_parameter }}</v-col>
            <v-col cols="9" v-if="showDep">{{$t('process_definition.labels.dependency') }} : {{ param.dependency }}</v-col>
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

export default {
  name: "ParameterList",

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
    }
  },

  computed: {
    ...mapGetters(['propertyById'])
  },

  methods: {
    boolText(val) {
      return val ? this.$t('general.bool.yes') : this.$t('general.bool.no')
    }
  }
}
</script>

<style scoped>

</style>