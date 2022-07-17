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

            <div v-if="result.length === 0">
              <v-progress-circular indeterminate color="green" size="70" width="7"></v-progress-circular>
            </div>
            <div v-else>
              <v-card-title>{{ $t('optimization.titles.overview_result') }}</v-card-title>

              <v-data-table :headers="optHeaders" :items="optRows" :single-expand="false" :expanded.sync="expanded"
                            item-key="key" show-expand class="elevation-1">
                <!-- ToDo: Select item for Sankey diagram (use slot item or body and build table itself?!) -->
                <template v-slot:item.col0="{ item, index }">
                  <div @click="selectCell(index, 0)">{{ item.col0 }}</div>
                </template>
                <template v-if="result.length > 1"  v-slot:item.col1="{ item, index }">
                  <div @click="selectCell(index, 1)">{{ item.col1 }}</div>
                </template>
                <template v-if="result.length > 2"  v-slot:item.col2="{ item, index }">
                  <div @click="selectCell(index, 2)">{{ item.col2 }}</div>
                </template>
                <template v-if="result.length > 3"  v-slot:item.col3="{ item, index }">
                  <div @click="selectCell(index, 3)">{{ item.col3 }}</div>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td></td><td></td>
                  <td v-for="k in result.length" :key="k" v-html="item['info' + k]"></td>
                </template>
              </v-data-table>
            </div>
            <div id="sankey_opt"></div>
            <svg ref="sankey_opt"></svg>

            <!-- cost optimization only -->
            <div v-if="result.length > 0 && result[0].cost_opts.length > 0">

              <v-card-title>{{ $t('optimization.titles.overview_result') }}</v-card-title>
              <v-data-table :headers="costHeaders" :items="costRows" :single-expand="false" :expanded.sync="costExpanded"
                            item-key="key" show-expand class="elevation-1">
                <template v-slot:expanded-item="{ headers, item }">
                  <td></td><td></td>
                  <td v-for="k in result.length" :key="k" v-html="item['info' + k]"></td>
                </template>
              </v-data-table>

            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
//import { sankey as d3Sankey, sankeyLinkHorizontal as d3SsankeyLinkHorizontal } from 'd3-sankey';

export default {
  name: "OptimizationResult",
  data () {
    return {
      result: [],
      polling: null,
      expanded: [],
      costExpanded: [],
      items: {
        nodes: [
          { node: 0, name: 'node0', id: 'node0', color: 'gray', height: 6 },
          { node: 1, name: 'node1', id: 'node1', color: 'gray', height: 4 },
          { node: 2, name: 'node2', id: 'node2', color: 'gray', height: 3 },
          { node: 3, name: 'node3', id: 'node3', color: 'gray', height: 2 },
          { node: 4, name: 'node4', id: 'node4', color: 'gray', height: 3 },
          { node: 5, name: 'node6', id: 'node5', color: 'gray', height: 2 },
        ],
        links: [
          { source: 'node0', target: 'node2', value: 1, color: 'gray' },
          { source: 'node1', target: 'node2', value: 2, color: 'gray' },
          { source: 'node1', target: 'node3', value: 2, color: 'gray' },
          { source: 'node0', target: 'node4', value: 3, color: 'gray' },
          { source: 'node0', target: 'node5', value: 2, color: 'gray' },
          { source: 'node5', target: 'node3', value: 2, color: 'gray' },
        ],
      },
      currentOptIndex: 0,
      currentVariantIndex: 0
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
          row['info' + (p + 1)] = Object.keys(o.partials).map(k => '<b>' + k + '</b>: ' + o.partials[k].value + ' kWh').join('<br/>') +
              '<br/>' +
              Object.keys(o.indices).map(k => '<b>' + k + '</b>: ' + o.indices[k].name + ' (' + o.indices[k].manufacturer + ')').join('<br/>');
        });
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
          row['info' + (p + 1)] = Object.keys(o.partials).map(k => '<b>' + k + '</b>: ' + o.partials[k].value + ' kWh').join('<br/>') +
              '<br/>' +
              Object.keys(o.indices).map(k => '<b>' + k + '</b>: ' + o.indices[k].name + ' (' + o.indices[k].manufacturer + ')').join('<br/>');
        });
        row['info'] = 'More Info';
        row['key'] = r + 1;
        rows.push(row);
      }
      return rows;
    },
    optSankey() {
      let base = this.result[this.currentVariantIndex].opts[this.currentOptIndex];
      let aggregateNames = [...new Set(Object.keys(base.partials).map(k => base.partials[k].aggregate))];
      let aggregates = {};
      aggregateNames.forEach(a =>
          aggregates[a] =
              Object.keys(base.partials).filter(k => base.partials[k].aggregate === a).map(k => base.partials[k].value).reduce((p, c) => p + c, 0));
      let n_agg = aggregateNames.length;
      return {
        nodes: [
          { node: 0, name: 'Total', id: 'total', color: 'gray' },
            ...aggregateNames.map((agg, p) => { return { node: p + 1, name: agg, id: 'agg' + p, color: 'gray' } }),
            ...Object.keys(base.partials).map((par,p) => { return { node: p + n_agg + 1, name: par, id: 'par' + p, color: 'gray'} }),
        ],
        links: [
            ...aggregateNames.map(agg => { return { source: 'Total', target: agg, value: aggregates[agg], color: 'gray' } }),
            ...Object.keys(base.partials).map(par => {
              return { source: base.partials[par].aggregate, target: par, value: base.partials[par].value, color: 'gray' } })
        ],
      }
    }
  },

  mounted() {
    //this.updateSankey();
  },

  methods: {
    selectCell(row, col) {
      this.currentOptIndex = row;
      this.currentVariantIndex = col;
      //this.updateSankey();
    },
    checkResult() {
      this.$http.get('problems/result/' + this.timestamp).
          then((response) => {
            if (response.status < 400) {
              if (response.data.status  !== undefined && response.data.status === 'pending') {
                // ToDo: update timer
              } else {
                this.result = [...response.data.result];
                this.updateSankey();
                clearInterval(this.polling);
              }
            } else {
              this.result = 'ERROR: ' + response.data;
              clearInterval(this.polling);
            }
          }).catch((error) => {
            clearInterval(this.polling);
      });
    },
    updateSankey() {
      try {
        const width = 600;
        const height = 400;
        const nodeWidth = 60;
        const nodeHeight = 80;
        const nodePadding = 60;

        const svg = d3
            //.select(this.$refs.sankey_opt)
            .select("#sankey_opt").append("svg")
            .attr('viewBox', [0, -50, width, height + 100]);

        const {nodes, links} = sankey()
            .nodeId((d) => d.name)
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .extent([
              [1, 1],
              [width, height - nodeHeight],
            ])(this.optSankey);

        svg
            .append('g')
            .attr('stroke', '#000')
            .attr('stroke-width', '0')
            .selectAll('rect')
            .data(nodes)
            .join('rect')
            .attr('x', (d) => d.x0)
            .attr('y', (d) => d.y0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('width', (d) => d.x1 - d.x0)
            .attr('fill', (d) => d.color)
            .append('title')
            .text((d) => `${d.name}\n${d.value}`);

        const link = svg
            .append('g')
            .attr('fill', 'none')
            .attr('stroke-opacity', 0.5)
            .selectAll('g')
            .data(links)
            .join('g');
        //.style("mix-blend-mode", "multiply");

        link
            .append('path')
            .attr('d', sankeyLinkHorizontal())
            .attr('stroke', (d) => d.color)
            .attr('stroke-width', (d) => Math.max(1, d.width));

        link
            .append('title')
            .text((d) => `${d.source.name} → ${d.target.name}\n${d.value}`);

        svg
            .append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .selectAll('text')
            .data(nodes)
            .join('text')
            .attr('x', (d) => d.x0 + 8)
            .attr('y', (d) => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .text((d) => d.name);
      } catch (ex) {
        console.log(ex);
      }
    }
  },

  created() {
    // ToDo: replace polling with server-sent Events or WebSocket
    this.polling = setInterval(this.checkResult, 1000);
  }
}
</script>

<style scoped>
svg {
  padding-inline: max(2rem, calc(50% - 24rem));
}
</style>