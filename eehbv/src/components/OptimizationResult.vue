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
          <v-card-title>{{ $t('optimization.titles.request') }} - {{ requestData.description }}</v-card-title>
          <v-card-text>

            <ResultSettings v-model="requestData.result_settings" :disabled="true"></ResultSettings>

            {{ JSON.stringify(requestData) }}


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
              <v-card-title>{{ $t('optimization.titles.energy_optimization') }}</v-card-title>

              <v-data-table :headers="optHeaders" :items="optRows" :single-expand="false" :expanded.sync="expanded"
                            item-key="key" show-expand class="elevation-1">
                <!-- ToDo: Select item for Sankey diagram (use slot item or body and build table itself?!) -->
                <template v-slot:item.col0="{ item, index }">
                  <div @click="selectCell(index, 0, false)">{{ item.col0 }}</div>
                </template>
                <template v-if="result.length > 1"  v-slot:item.col1="{ item, index }">
                  <div @click="selectCell(index, 1, false)">{{ item.col1 }}</div>
                </template>
                <template v-if="result.length > 2"  v-slot:item.col2="{ item, index }">
                  <div @click="selectCell(index, 2, false)">{{ item.col2 }}</div>
                </template>
                <template v-if="result.length > 3"  v-slot:item.col3="{ item, index }">
                  <div @click="selectCell(index, 3, false)">{{ item.col3 }}</div>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td></td><td></td>
                  <td v-for="k in result.length" :key="k" v-html="item['info' + k]"></td>
                </template>
              </v-data-table>
            </div>
            <div id="div_opt"></div>

            <div id="div_amortization"></div>

            <!-- cost optimization only -->
            <div v-if="result.length > 0 && result[0].cost_opts.length > 0">

              <v-card-title>{{ $t('optimization.titles.costs_opt') }}</v-card-title>
              <v-data-table :headers="costHeaders" :items="costRows" :single-expand="false" :expanded.sync="costExpanded"
                            item-key="key" show-expand class="elevation-1">
                <!-- ToDo: Select item for Sankey diagram (use slot item or body and build table itself?!) -->
                <template v-slot:item.col0="{ item, index }">
                  <div @click="selectCell(index, 0, true)">{{ item.col0 }}</div>
                </template>
                <template v-if="result.length > 1"  v-slot:item.col1="{ item, index }">
                  <div @click="selectCell(index, 1, true)">{{ item.col1 }}</div>
                </template>
                <template v-if="result.length > 2"  v-slot:item.col2="{ item, index }">
                  <div @click="selectCell(index, 2, true)">{{ item.col2 }}</div>
                </template>
                <template v-if="result.length > 3"  v-slot:item.col3="{ item, index }">
                  <div @click="selectCell(index, 3, true)">{{ item.col3 }}</div>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td></td><td></td>
                  <td v-for="k in result.length" :key="k" v-html="item['info' + k]"></td>
                </template>
              </v-data-table>

            </div>
            <div id="div_costs_opt"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import ResultSettings from "./ResultSettings";

export default {
  name: "OptimizationResult",
  components: {ResultSettings},
  data () {
    return {
      result: [],
      polling: null,
      expanded: [],
      costExpanded: [],
      currentOptIndex: 0,
      currentVariantIndex: 0,
      currentCostsOptIndex: 0,
      currentCostsVariantIndex: 0,
      requestData: {
        description: '',
        general_parameters: {},
        process: { api_name: '', id: '', view_name: '' },
        result_settings: {
          n_list: 0,
          costs_opt: { exec: false, amortisation_time: 0, assembly_costs: 0, price_kwh: 0 }
        },
        variants_conditions: []
      },
      graphWidth: 600,
      graphHeight: 400
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
          row['info' + (p + 1)] = Object.keys(o.partials).map(k => '<b>' + k + '</b>: ' + o.partials[k].value + ' kWh')
              .join('<br/>') + '<br/>' +
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
      return this.computeSankeyData(base);
    },
    costsOptSankey() {
      let base = this.result[this.currentCostsVariantIndex].cost_opts[this.currentCostsOptIndex];
      return this.computeSankeyData(base);
    },
    amortizationData() {
      return [
          ...this.result[this.currentVariantIndex].opts
              .map(o => { return [{ x: 0, y: o.acquisition_costs},
                { x: 10, y: o.acquisition_costs + o.total * this.requestData.result_settings.costs_opt.price_kwh}] }),
                //{ x: 10, y: o.acquisition_costs + 2000}] }),
          ...this.result[this.currentVariantIndex].cost_opts
              .map(o => { return [{ x: 0, y: o.acquisition_costs},
                { x: 10, y: o.acquisition_costs + o.total * this.requestData.result_settings.costs_opt.price_kwh}] }),
                //{ x: 10, y: o.acquisition_costs + 3000}] })
      ];
    }
  },

  mounted() {
    if (this.request !== undefined && this.request !== null) {
      this.requestData = this.request;
    }
  },

  methods: {
    selectCell(row, col, costs) {
      if (costs) {
        this.currentCostsOptIndex = row;
        this.currentCostsVariantIndex = col;
        this.drawSankey(this.costsOptSankey, true, 'svg_cost_opt', '#div_costs_opt');
      } else {
        this.currentOptIndex = row;
        this.currentVariantIndex = col;
        this.drawSankey(this.optSankey, true, 'svg_opt', '#div_opt');
      }
    },
    checkResult() {
      this.$http.get('problems/result/' + this.timestamp).
          then((response) => {
            if (response.status < 400) {
              if (response.data.status  !== undefined &&
                  (response.data.status === 'processing' || response.data.status === 'pending')) {
                // ToDo: update timer
              } else {
                this.result = [...response.data.result];
                if (this.request === undefined || this.request === null) {
                  this.requestData = response.data.request;
                }
                this.drawSankey(this.optSankey, false, 'svg_opt', '#div_opt');
                if (this.result[0].cost_opts.length > 0) {
                  this.drawSankey(this.costsOptSankey, true, 'svg_cost_opt', '#div_costs_opt');
                  this.drawAmortization(this.amortizationData);
                }
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
    computeSankeyData(base) {
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
    },
    drawAmortization(data) {
      const id = 'svg_amort';
      const leftMargin = 70;
      const topMargin = 30;
      const svg = d3.select('#div_amortization').append('svg').attr('id', id)
          .attr('viewBox', [0, -50, this.graphWidth, this.graphHeight + 100]);

      const maxVal = Math.max(...data.map(d => d[1].y));

      const xScale = d3.scaleLinear().domain([0, 10]).range([leftMargin, this.graphWidth - leftMargin + 20]);
      const xAxis = d3.axisBottom().scale(xScale).tickSize(10).ticks(11);
      const yScale = d3.scaleLinear().domain([maxVal, 0]).range([0, this.graphHeight - topMargin]);
      const yAxis = d3.axisLeft().scale(yScale).ticks(10).tickSize(10);
      d3.select('#' + id).append("g").attr("class", "axis")
          .attr("transform", "translate(0," + (this.graphHeight - topMargin) + ")").call(xAxis)
      d3.select('#' + id).append("text").attr("class", "x label").attr("x", xScale(5)).attr("y", yScale(-maxVal / 10 ))
          .attr("text-anchor", "middle") .text("Jahre");
      d3.select('#' + id).append("g").attr("class", "axis")
          .attr("transform", "translate(" + leftMargin + ",0)").call(yAxis)
      d3.select('#' + id).append("text").attr("transform", "translate(-174,150)rotate(-90)")
          .attr("x", xScale(-2)).attr("y", yScale(maxVal / 2 ))
          .attr("text-anchor", "middle").text("Euro");

      let lineFunc = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));

      let n = data.length / 2;

      data.forEach((d, i) => {
        if (i < 3 || (i >= n && i < n + 3)) {
          let col = i < n ? d3.rgb(255, 0, i * 90) : d3.rgb(0, (i-n)*100, 255);
          let yLegend = (i < n ? i : i - n + 4) * 20 + yScale(maxVal / 2);
          d3.select('#' + id).append('path')
              .attr('d', lineFunc(d)).attr('stroke', col)
              .attr('fill', 'none').attr("stroke-width", 2);
          d3.select('#' + id).append("g").attr("class", "legend").attr("id", 'amort_legend' + i);
          d3.select('#amort_legend' + i).append("circle")
            .attr("cx", xScale(7))
            .attr('cy', yLegend)
            .attr("r", 6)
            .style("fill", col);
          d3.select('#amort_legend' + i).append("text")
            .attr("x", xScale(7.5))
            .attr("y", yLegend + 5)
            .text((i < n ? 'Energie, Top ' + (i + 1)  : 'Kosten, Top ' + (i - n + 1)));
        }
      });
    },
    drawSankey(data, update, id, parentId) {
      try {
        const nodeWidth = 120;
        const nodeHeight = 80;
        const nodePadding = 60;

        if (update) {
          d3.select('#' + id).remove();
        }

        const svg = d3.select(parentId).append('svg').attr('id', id)
          .attr('viewBox', [0, -50, this.graphWidth, this.graphHeight + 100]);

        const {nodes, links} = sankey()
            .nodeId((d) => d.name)
            .nodeWidth(nodeWidth)
            .nodePadding(nodePadding)
            .extent([
              [1, 1],
              [this.graphWidth, this.graphHeight - nodeHeight],
            ])(data);

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