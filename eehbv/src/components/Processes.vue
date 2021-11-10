<template>
  <v-container>
    <v-row v-if="role > 1">
      <v-col cols="12">
        <v-btn :to="{ name: 'ProcessCreation' }">Neuer Prozess</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" v-for="proc in processes" :key="proc.api_name">
        <v-card :to="{ name: 'ProcessOverview', params: { type: proc.api_name, process: proc } }">
          <v-card-title>{{proc.view_name}}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "Processes",

  data: () => ({
    tables: []
  }),
  computed: {
    ...mapGetters(['componentTypes', 'processes', 'userRole'])
  },
  methods: {
    log: function () {
      console.log(this.$store.state);
    }
  },
  created() {
    this.$store.dispatch('initProcesses');
    if (this.componentTypes.length < 1) {
      this.$store.dispatch('initComponents');
    }
  }
}
</script>

<style scoped>

</style>