<template>
  <v-container>
    <v-row>
      <v-col cols="6"><h2>{{ $t('optimization.titles.overview_result') }}</h2></v-col>

      <v-col cols="6">
        <v-btn :to="{ name: 'Process' }">{{ $t('process_overview.labels.process_list') }}</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ $t('optimization.titles.request') }}</v-card-title>
          <v-card-text>
            {{ JSON.stringify(request) }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ $t('optimization.titles.result') }}</v-card-title>
          <v-card-text>
            <div v-if="result.length === 0" class="text-center">
              <v-progress-circular indeterminate color="green" size="70" width="7"></v-progress-circular>
            </div>
            <div v-else>

              <v-card-title>{{ $t('optimization.titles.overview_result') }}</v-card-title>
              <v-data-table :headers="optHeaders" :items="optRows" :single-expand="false" :expanded.sync="expanded"
                            item-key="key" show-expand class="elevation-1">
                <template v-slot:expanded-item="{ headers, item }">
                  <td></td><td></td>
                  <td v-for="k in result.length" :key="k" v-html="item['info' + k]"></td>
                </template>
              </v-data-table>



              <!-- cost optimization only -->
              <div v-if="result[0].cost_opts.length > 0">

                <v-card-title>{{ $t('optimization.titles.overview_result') }}</v-card-title>
                <v-data-table :headers="costHeaders" :items="costRows" :single-expand="false" :expanded.sync="costExpanded"
                              item-key="key" show-expand class="elevation-1">
                  <template v-slot:expanded-item="{ headers, item }">
                    <td></td><td></td>
                    <td v-for="k in result.length" :key="k" v-html="item['info' + k]"></td>
                  </template>
                </v-data-table>

              </div>

            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "OptimizationResult",
  data () {
    return {
      result: [],
      polling: null,
      expanded: [],
      costExpanded: []
    }
  },

  props: {
    type: {
      type: String,
      required: true
    },
    request: {
      type: Object,
      required: false
    },
    timestamp: {
      type: String,
      required: true
    }
  },

  computed: {
    optHeaders() {
      return [ { text: '', value: 'key', sortable: false }, ...this.result.map((v, p) => { return { text: v.variant, value: 'col' + p, sortable: false } })]
    },
    optRows() {
      let n = this.result[0].opts.length;
      let costOpt = this.result[0].cost_opts.length > 0;
      let rows = [];
      for (let r = 0; r < n; r++) {
        let row = {};
        this.result.forEach((v, p) => {
          let o = v.opts[r];
          row['col' + p] = o.total + ' kWh' + (costOpt ? ' - ' + o.acquisition_costs + ' Euro' : '');
          row['info' + (p + 1)] = Object.keys(o.partials).map(k => '<b>' + k + '</b>: ' + o.partials[k] + ' kWh').join('<br/>') +
              '<br/>' +
              Object.keys(o.indices).map(k => '<b>' + k + '</b>: ' + o.indices[k].name + ' (' + o.indices[k].manufacturer + ')').join('<br/>');
        });
        row['info'] = 'More Info';
        row['key'] = r + 1;
        rows.push(row);
      }
      return rows;
    },

    costHeaders() {
      return [ { text: '', value: 'key', sortable: false }, ...this.result.map((v, p) => { return { text: v.variant, value: 'col' + p, sortable: false } })]
    },
    costRows() {
      let n = this.result[0].cost_opts.length;
      let rows = [];
      for (let r = 0; r < n; r++) {
        let row = {};
        this.result.forEach((v, p) => {
          let o = v.cost_opts[r];
          row['col' + p] = o.total + ' kWh - ' + o.acquisition_costs + '/' + o.energy_costs + ' Euro (' + this.$t('optimization.labels.costs') + ')';
          row['info' + (p + 1)] = Object.keys(o.partials).map(k => '<b>' + k + '</b>: ' + o.partials[k] + ' kWh').join('<br/>') +
              '<br/>' +
              Object.keys(o.indices).map(k => '<b>' + k + '</b>: ' + o.indices[k].name + ' (' + o.indices[k].manufacturer + ')').join('<br/>');
        });
        row['info'] = 'More Info';
        row['key'] = r + 1;
        rows.push(row);
      }
      return rows;
    }
  },

  methods: {
    checkResult() {
      this.$http.get('problems/result/' + this.timestamp).
          then((response) => {
            if (response.status < 400) {
              if (response.data.status  !== undefined && response.data.status === 'pending') {
                // ToDo: update timer
              } else {
                console.log(JSON.stringify(response.data.result));
                this.result = [...response.data.result];
                //console.log(this.result);
                clearInterval(this.polling);
              }
            } else {
              this.result = 'ERROR: ' + response.data;
              clearInterval(this.polling);
            }
          }).catch((error) => {
            clearInterval(this.polling);
      });
    }
  },

  created() {
    // ToDo: replace polling with server-sent Events or WebSocket
    this.polling = setInterval(this.checkResult, 1000);
  }
}
</script>

<style scoped>

</style>