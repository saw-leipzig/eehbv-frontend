<template>
  <div>
    <v-card class="mb-12">
      <v-row>
        <v-col cols="12">

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
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row v-if="value.costs_opt.exec">
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        v-model="value.costs_opt.amortisation_time"
                        :label="$t('optimization.labels.amortization_time')"
                        step="1"
                        type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                        v-model="value.costs_opt.montage_price"
                        :label="$t('optimization.labels.assembly_costs')"
                        step="100"
                        type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-btn color="green" @click="$emit('continue')">
      {{ $t('general.dialog.next') }}
    </v-btn>

    <v-btn text @click="$emit('abort')">
      {{ $t('general.dialog.abort') }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "OptimizationResultSettings",

  data: () => ({
    n_list: 10,
    price_opt: {
      exec: false,
      amortisation_time: 2,
      montage_price: 10000
    }
  }),

  props: {
    value: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>