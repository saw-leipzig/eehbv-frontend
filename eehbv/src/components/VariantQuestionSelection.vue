<template>
  <div>
    <v-card class="mb-12">
      <v-row>
        <v-col cols="12" v-for="(q, i) in askedQuestions" :key="i">
          <v-card>
            <v-card-title>{{ q.question }}</v-card-title>
            <v-card-actions v-if="i === askedQuestions.length - 1">
              <v-btn @click="update(true)">Ja</v-btn>
              <v-btn @click="update(false)">Nein</v-btn>
              <v-btn v-if="i > 0" @click="askedQuestions.splice(-1, 1)">Zurück</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-btn text @click="$emit('abort')">
      Abbruch
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "VariantQuestionSelection",

  data: () => ({
    questions: {},
    askedQuestions: []
  }),

  props: {
    process: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$http.get('/api/v1/processes/' + this.process.id + '/questions').
              then((response) => {
                  this.questions = response.data;
                  this.askedQuestions.push(this.questions);
          });
    },
    update(resp) {
      this.askedQuestions.push(this.askedQuestions[this.askedQuestions.length - 1][resp ? 'yes' : 'no']);
      if (!this.askedQuestions[this.askedQuestions.length - 1].question) {
        let exclusions = this.askedQuestions.map(q => { return q.excludes ? q.excludes : []; }).flat();
        let selection = this.variants.filter(v => !exclusions.includes(v.id)).map(v => v.id);
        this.log(exclusions);
        this.$emit('continue', selection);
      }
    },
    log: function (val) {
      console.log(val);
    }
  }
}
</script>

<style scoped>

</style>