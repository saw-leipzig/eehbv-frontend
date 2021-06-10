<template>
  <v-container>
    <v-row>
      <v-col cols="12"><h2>Variantenauswahl {{process.view_name}}</h2></v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item-group v-model="selection" multiple>
            <template  v-for="variant in variants">
              <v-list-item :key="variant.id" :value="variant.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{variant.name}}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="6">
        <v-btn :to="{ name: 'Restrictions', params: { type: process.api_name, process: process, variants: variants, variant_selection: selection } }">OK</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn :to="{ name: 'ProcessOverview', params: { type: process.api_name, process: process } }">Abbruch</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "VariantPicklist",

  data: () => ({
    selection: []
  }),

  props: {
    process: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    }
  },

  methods: {
    log() {
      console.log(this.selection);
    }
  }
}
</script>

<style scoped>

</style>