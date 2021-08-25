<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn :to="{ name: 'ComponentCreation' }">Neuer Komponententyp</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" v-for="comp in componentTypes" :key="comp.api_name">
        <v-card :to="{ name: 'ComponentOverview', params: { type: comp.api_name, comp: comp } }">
          <v-card-title>{{comp.view_name}}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "MachineComponents",

  data: () => ({
    tables: []
  }),
  computed: {
    ...mapGetters(['componentTypes'/*, 'componentInfos'*/])
  },
  methods: {
    log: function () {
      console.log(this.$store.state);
    }
  },
  created() {
    this.$store.dispatch('initComponents');
  }
}
</script>

<style scoped>

</style>