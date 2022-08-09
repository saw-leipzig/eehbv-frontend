<template>
  <div>
    <v-card v-for="(entry, pos) in profiles" :key="pos">
      <v-card-text>
        <v-row>
          <v-col cols="12"><b>{{ $t('optimization.labels.fraction') }}: {{entry.portion}}</b></v-col>
        </v-row>
        <v-row>
          <v-col v-for="(param, propertyName) in entry" v-if="propertyName !== 'portion'" :key="propertyName" cols="12" sm="6" md="4">
            {{ parameterByVarName(propertyName).name + ' = ' + param + ' ' + parameterByVarName(propertyName).unit }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import paramVariables from "../mixins/paramVariables";

export default {
  name: "ResultProfiles",
  mixins: [ paramVariables ],

  props: {
    profiles: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>