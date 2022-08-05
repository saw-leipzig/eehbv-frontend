<template>
  <div>
    <v-card class="mb-12">
      <v-row>
        <v-col cols="12">

          <ResultSettings
              v-model="value"
              :disabled="false"
          ></ResultSettings>

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
import ResultSettings from "./ResultSettings";
export default {
  name: "OptimizationResultSettings",
  components: {ResultSettings},
  data: () => ({
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