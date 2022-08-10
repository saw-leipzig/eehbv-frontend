<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="10">
          <v-combobox
              v-model="processId"
              :items="processOptions"
              :label="$t('process_definition.titles.problems')"
              type="text"
          ></v-combobox>
        </v-col>
        <v-col cols="2">
          <v-btn color="green" @click="selectProcess" :disabled="processId.value === 0">
            {{ $t('general.dialog.show')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="entries"
      :items-per-page="10"
      @click:row="select"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small :disabled="userRole < 1" @click.stop="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <DialogDelete v-model="dialogDelete" @abort="closeDelete" @delete="deleteItemConfirm"></DialogDelete>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import DialogDelete from "./DialogDelete";

export default {
  name: "History",
  components: {DialogDelete},
  data() {
    return {
      history: [],
      headers: [
        { text: this.$t('variants_definition.labels.description'), value: 'description' },
        { text: this.$t('optimization.labels.costs_short'), value: 'costs_opt' },
        { text: this.$t('process_creation.titles.variants_definition'), value: 'variants' },
        { text: '', value: 'actions', sortable: false }
      ],
      processId: { text: '--', value: 0 },
      dialogDelete: false,
      selectedTimestamp: ''
    }
  },

  computed: {
    ...mapGetters(['processes', 'userRole']),
    entries() {
      return this.history.map(e => {
        return {
          process: e.process.view_name,
          description: e.description,
          costs_opt: e.costs_opt,
          variants: e.variants.join('<br/>'),
          timestamp: e.timestamp,
          process_id: e.process.id,
          process_api_name: e.process.api_name
        };
      })
    },
    processOptions() {
      return this.processes.map(p => { return { text: p.view_name, value: p.id } });
    }
  },

  created() {
    if (this.processes.length < 1) {
      this.$store.dispatch('initProcesses');
    }
  },

  methods: {
    select(row) {
      let process = this.processes.find(p => p.id === row.process_id);
      this.$router.push({
        name: 'OptimizationResult',
        params: {type: row.process_api_name, process: process, timestamp: row.timestamp }
      });
    },
    selectProcess() {
      this.$http.get('problems/' + this.processId.value + '/results').then(resp => {
        this.history.splice(0, this.history.length, ...resp.data.requests);
      });
    },
    deleteItem(item) {
      this.selectedTimestamp = item.timestamp;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.$http.delete('problems/results/' + this.selectedTimestamp).then((response) => {
        let index = this.history.findIndex(e => e.timestamp === this.selectedTimestamp);
        this.history.splice(index, 1);
      }).catch(() => { /* ToDo: message */});
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
    }
  }
}
</script>

<style scoped>

</style>