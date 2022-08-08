<template>
  <v-card>
    <v-card-title>{{ $t('process_definition.titles.parameters') }}</v-card-title>
    <v-card-text>
      <v-container>

        <v-row>
          <v-col v-for="(param, propertyName) in value" :key="propertyName" cols="12" sm="6" md="4">
            <v-text-field
                :value="param"
                :label="parameterByVarName(propertyName).name + ' [' + parameterByVarName(propertyName).unit + ']'"
                type="number"
                :disabled="true"
            ></v-text-field>
          </v-col>
        </v-row>

      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ResultRequestParameters",

  props: {
    value: {
      type: Object,
      required: true
    },
    process: {
      type: Object,
      required: true
    }
  },

  methods: {
    parameterByVarName(varName) {
      return this.process.parameters.find(p => p.variable_name === varName);
    }
  }
}
</script>

<style scoped>

</style>