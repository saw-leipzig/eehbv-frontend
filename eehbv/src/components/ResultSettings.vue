<template>
  <div>

    <v-card>
      <v-card-title>{{ $t('optimization.titles.view_parameters') }}</v-card-title>
      <v-card-text>
        <v-container>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  v-model="value.n_list"
                  :label="$t('optimization.labels.result_length')"
                  step="1"
                  type="number"
                  :disabled="disabled"
              ></v-text-field>
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>{{ $t('optimization.titles.costs_opt') }}</v-card-title>
      <v-card-text>
        <v-container>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                  v-model="value.costs_opt.exec"
                  :label="$t('optimization.labels.run_costs_opt')"
                  type="text"
                  :disabled="disabled"
              ></v-checkbox>
            </v-col>
            <v-col v-if="value.costs_opt.exec" cols="12" sm="6" md="4">
              <v-text-field
                  v-model="value.costs_opt.price_kwh"
                  :label="$t('optimization.labels.price_kwh')"
                  step="0.01"
                  type="number"
                  :disabled="disabled"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="value.costs_opt.exec">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  v-model="value.costs_opt.amortisation_time"
                  :label="$t('optimization.labels.amortization_time')"
                  step="0.1"
                  type="number"
                  :disabled="disabled"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                  v-model="value.costs_opt.assembly_costs"
                  :label="$t('optimization.labels.assembly_costs')"
                  step="100"
                  type="number"
                  :disabled="disabled"
              ></v-text-field>
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
export default {
  name: "ResultSettings",

  props: {
    value: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>

</style>