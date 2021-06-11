<template>
  <v-container>
    <v-row>
      <v-col cols="12"><h2>Nebenbedingungen {{process.view_name}}</h2></v-col>
    </v-row>

    <v-row>
      <v-col cols="12" >
        <v-card>
          <v-card-title>Varianten</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" v-for="variant in variants" :key="variant.id" v-if="variant_selection.includes(variant.id)">
                  <v-card>
                    <v-card-title>{{variant.name}}</v-card-title>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Restrictions",

  props: {
    process: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    variant_selection: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>