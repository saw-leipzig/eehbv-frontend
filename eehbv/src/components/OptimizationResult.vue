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
            <div v-if="result === ''" class="text-center">
              <v-progress-circular indeterminate color="green" size="70" width="7"></v-progress-circular>
            </div>
<!--            <div v-else>{{ result }}</div>-->
            <div v-else v-html="result"></div>
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
      result: "",
      polling: null
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

  methods: {
    checkResult() {
      this.$http.get('problems/result/' + this.timestamp).
          then((response) => {
            if (response.status < 400) {
              if (response.headers['content-type'] === 'application/json') {
                // ToDo: update timer
              } else {
                this.result = response.data;
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