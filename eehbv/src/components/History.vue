<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="entries"
      :items-per-page="10"
      @click:row="select"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from "vue";

export default {
  name: "History",

  data() {
    return {
      history: [],
      headers: [
        { text: 'Process', value: 'process' },
        { text: 'Description', value: 'description' },
        { text: 'Costs', value: 'costs_opt' },
        { text: 'Variants', value: 'variants' }
      ]
    }
  },

  computed: {
    ...mapGetters(['processes']),
    entries() {
      return this.history.map(e => {
        return {
          process: e.process.view_name,
          description: e.description,
          costs_opt: e.costs_opt,
          variants: e.variants.join('; '),
          timestamp: e.timestamp,
          process_id: e.process.id,
          process_api_name: e.process.api_name
        };
      })
    }
  },

  created() {
    if (this.processes.length < 1) {
      this.$store.dispatch('initProcesses');
    }
    this.initialize();
  },

  methods: {
    initialize() {
      this.$http.get('problems/results').then(resp => {
        this.history.splice(0, this.history.length, ...resp.data.requests);
      })
    },
    select(row) {
      let process = this.processes.find(p => p.id === row.process_id);
      this.$router.push({
        name: 'OptimizationResult',
        params: {type: row.process_api_name, process: process, timestamp: row.timestamp }
      });
    }
  }
}
</script>

<style scoped>

</style>