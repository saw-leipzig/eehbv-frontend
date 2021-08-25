<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        Name
      </v-col>
      <v-col cols="4">
        API-Pfad
      </v-col>
      <v-col cols="4">
        Aggregat
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="save">Speichern</v-btn>
        <v-btn text :to="{ name: 'Component' }">Abbrechen</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ComponentCreation",

  data: () => ({
    component_type: {
      table_name: '',
      view_name: '',
      api_name: '',
      is_aggregate: false,
      columns: []
    }
  }),

  methods: {
    save() {
      //
    }
  }
}
</script>

<style scoped>

</style>