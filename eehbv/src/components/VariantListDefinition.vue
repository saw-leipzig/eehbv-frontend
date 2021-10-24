<template>
  <v-container>
    <v-row v-for="(question, index) in value.list" :key="index">
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="10">{{question.question}}</v-col>
              <v-col cols="2">
                <v-icon small class="mr-2" @click="editItem(index)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(index)">mdi-delete</v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-chip v-for="variant in variants" v-if="question.no_excludes.includes(variant.name)" :key="variant.name" color="red">
                  {{variant.name}}
                </v-chip>
                <v-chip v-for="variant in variants" v-if="question.yes_excludes.includes(variant.name)" :key="variant.name" color="green">
                  {{variant.name}}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-btn color="green" @click="editItem(-1)"><v-icon>mdi-plus</v-icon></v-btn>
    </v-row>

    <DialogCardEditor v-model="dialogEditQuestion" :title="questionEditTitle"
                      @save="saveItem" @close="closeEditItem">
      <v-row>
        <v-col cols="4"><v-text-field label="Frage" v-model="currentQuestion.question" counter="40"></v-text-field></v-col>
        <v-col cols="8">
          <v-textarea label="Erläuterung zur Frage" v-model="currentQuestion.info"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-select id="YES_SELECT" :items="addableItems" v-model="yesSelect" label="Ausschluss für Antwort JA"></v-select>
        </v-col>
        <v-col cols="1">
          <v-btn color="green" @click="addExclude('yes')"><v-icon>mdi-plus</v-icon></v-btn>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col cols="4">
          <v-select id="NO_SELECT" :items="addableItems" v-model="noSelect" label="Ausschluss für Antwort NEIN"></v-select>
        </v-col>
        <v-col cols="1">
          <v-btn color="red" @click="addExclude('no')"><v-icon>mdi-plus</v-icon></v-btn>
        </v-col>
        <v-col cols="1"></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-chip v-for="variant in variants" v-if="currentQuestion.no_excludes.includes(variant.name)" :key="variant.name"
                  close color="red" @click:close="removeExclude('no', variant.name)">
            {{variant.name}}
          </v-chip>
          <v-chip v-for="variant in variants" v-if="currentQuestion.yes_excludes.includes(variant.name)" :key="variant.name"
                  close color="green" @click:close="removeExclude('yes', variant.name)">
            {{variant.name}}
          </v-chip>
        </v-col>
      </v-row>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDeleteQuestion" @abort="closeDeleteItem" @delete="deleteItemConfirm"></DialogDelete>

  </v-container>
</template>

<script>
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";

export default {
  name: "VariantListDefinition",
  components: {DialogCardEditor, DialogDelete},

  data: () => ({
    dialogEditQuestion: false,
    dialogDeleteQuestion: false,
    currentQuestion: { question: '', info: '', yes_excludes: [], no_excludes: [] },
    currentQuestionIndex: -1,
    yesSelect: '',
    noSelect: ''
  }),

  props: {
    value: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    process: {
      type: Object,
      required: true
    }
  },

  computed: {
    questionEditTitle() {
      return 'Frage ' + (this.currentQuestionIndex < 0 ? 'anlegen' : 'bearbeiten');
    },
    addableItems() {
      return this.variants.filter(v => !this.currentQuestion.yes_excludes.includes(v.name) &&
          !this.currentQuestion.no_excludes.includes(v.name)).
          map(v => v.name);
    }
  },

  methods: {
    questionTemplate() {
      return { question: '', info: '', yes_excludes: [], no_excludes: [] };
    },
    addExclude(noYes) {
      this.currentQuestion[noYes + '_excludes'].push(noYes === 'no' ? this.noSelect : this.yesSelect);
    },
    removeExclude(noYes, val) {
      let index = this.currentQuestion[noYes + '_excludes'].findIndex(q => q === val);
      this.currentQuestion[noYes + '_excludes'].splice(index, 1);
    },
    editItem(index) {
      this.currentQuestion = Object.assign({},
          index < 0 ?
              this.questionTemplate() :
              this.value.list[index]);
      this.currentQuestionIndex = index;
      this.dialogEditQuestion = true;
    },
    saveItem() {
      if (this.currentQuestionIndex < 0) {
        this.value.list.push(this.currentQuestion);
      } else {
        this.value.list.splice(this.currentQuestionIndex, 1, this.currentQuestion);
      }
      this.closeEditItem();
    },
    closeEditItem() {
      this.currentQuestionIndex = -1;
      this.dialogEditQuestion = false;
    },
    deleteItem(index) {
      this.currentQuestionIndex = index;
      this.dialogDeleteQuestion = true;
    },
    deleteItemConfirm() {
      this.value.list.splice(this.currentQuestionIndex, 1);
      this.closeDeleteItem();
    },
    closeDeleteItem() {
      this.currentQuestionIndex = -1;
      this.dialogDeleteQuestion = false;
    }
  }
}
</script>

<style scoped>

</style>