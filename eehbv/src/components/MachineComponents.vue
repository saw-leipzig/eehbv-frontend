<template>
  <v-container>
    <v-row v-if="userRole > 1">
      <v-col cols="12">
        <v-btn :to="{ name: 'ComponentCreation' }">{{ $t('components.titles.new_type') }}</v-btn>
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
import { mapGetters } from 'vuex'

export default {
  name: "MachineComponents",

  data: () => ({
    tables: []
  }),
  computed: {
    ...mapGetters(['userRole', 'componentTypes'])
  },
  created() {
    this.$store.dispatch('initComponents');
  },

  methods: {
    log: function () {
      console.log(this.$store.state);
    }
  }
}
</script>

<style scoped>

</style>