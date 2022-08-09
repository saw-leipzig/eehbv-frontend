<template>
  <v-card>
    <v-card-title>{{ $t('process_creation.titles.variants_definition') }} - {{ $t('optimization.titles.constraints') }}</v-card-title>
    <v-card-text>
      <v-container>

<!--        <v-row v-for="variant in variants_conditions" :key="variant.id">
          <v-col cols="12">-->
            <v-card v-for="variant in variants_conditions" :key="variant.id">
              <v-card-title>{{ variant.name }}</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row v-for="(condition, index) in variant.conditions" :key="index">
                    {{ condition }}
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
<!--          </v-col>
        </v-row>-->

      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ResultRestrictions",

  props: {
    variants_conditions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>