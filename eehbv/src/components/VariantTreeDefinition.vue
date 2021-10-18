<template>
  <v-container>
    <v-treeview :items="value.tree" item-children="answers" item-text="question" :activatable="true" open-all return-object dense
                @update:active="editItem">
      <template v-slot:prepend="{ item }">
        <v-icon v-if="item.response">
          {{ item.response === 'yes' ? 'mdi-thumb-up' : 'mdi-thumb-down' }}
        </v-icon>
      </template>
      <template v-slot:append="{ item }">
        <div v-if="item.id !== 'root'">
          <v-chip v-for="choice in item.exclude_choices" :key="choice">
            {{ choice }}
          </v-chip>
        </div>
      </template>
    </v-treeview>

    <DialogCardEditor v-model="dialogEditQuestion" title="Frage bearbeiten" :disabled-save="disabledSaveQuestion"
                      @save="saveItem" @close="closeEditItem">
      <v-row>
        <v-col cols="4"><v-text-field label="Frage" v-model="currentQuestion.question" counter="40"></v-text-field></v-col>
        <v-col cols="4">
          <v-select id="YES_SELECT" :items="addableItems" v-model="yesSelect" label="Ausschluss für Antwort JA"></v-select>
          <v-btn color="green" @click="addExclude('yes')"><v-icon>mdi-plus</v-icon></v-btn>
        </v-col>
        <v-col cols="4">
          <v-select id="NO_SELECT" :items="addableItems" v-model="noSelect" label="Ausschluss für Antwort NEIN"></v-select>
          <v-btn color="red" @click="addExclude('no')"><v-icon>mdi-plus</v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-chip v-for="variant in variants" v-if="currentQuestion.answers[0].excludes.includes(variant.name)" :key="variant.name"
                  close color="green" @click:close="removeExclude('yes', variant.name)">
            {{variant.name}}
          </v-chip>
          <v-chip v-for="variant in variants" v-if="currentQuestion.answers[1].excludes.includes(variant.name)" :key="variant.name"
                  close color="red" @click:close="removeExclude('no', variant.name)">
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
  name: "VariantTreeDefinition",
  components: {DialogCardEditor, DialogDelete},
  data: () => ({
    dialogEditQuestion: false,
    dialogDeleteQuestion: false,
    currentQuestion: { question: '', id: '', excludes: [], exclude_choices: [], response: null,
      answers: [
          { response: 'yes', question: '', excludes: [], exclude_choices: [], id: 'y', answers: [] },
          { response: 'no', question: '', excludes: [], exclude_choices: [], id: 'n', answers: [] }
      ]
    },
    currentNode: [],
    newNode: true,
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
    addableItems() {
      // ToDo: adjust to selection of all nodes
      return this.currentQuestion.exclude_choices.filter(
          c => !this.currentQuestion.answers[0].excludes.includes(c) &&
              !this.currentQuestion.answers[1].excludes.includes(c)
      );
    },
    disabledSaveQuestion() {
      return this.addableItems.length > 0 || this.currentQuestion.question === '' ||
          this.currentQuestion.answers[0].excludes.length < 1 ||
          this.currentQuestion.answers[1].excludes.length < 1;
    }
  },

  methods: {
    addExclude(noYes) {
      console.log(noYes);
      this.currentQuestion.answers.find(a => a.response === noYes).excludes.push(noYes === 'no' ? this.noSelect : this.yesSelect);
    },
    removeExclude(noYes, val) {
      let answerNode = this.currentQuestion.answers.find(a => a.response === noYes);
      let index = answerNode.excludes.findIndex(q => q === val);
      answerNode.excludes.splice(index, 1);
    },
    editItem(nodes) {
      if (nodes.length > 0) {
        let node = nodes[0];
        if (node.id === 'root' && node.exclude_choices.length < 1) {
          node.exclude_choices.push(...this.variants.map(v => v.name));
        }
        if (node.answers.length < 1) {
          this.currentQuestion = Object.assign({}, {
            question: '',
            exclude_choices: [...node.exclude_choices],
            answers: [
              { response: 'yes', question: '', excludes: [], id: node.id + '-y', answers: [], exclude_choices: [] },
              { response: 'no', question: '', excludes: [], id: node.id + '-n', answers: [], exclude_choices: [] }
            ]
          });
          this.newNode = true;
        } else {
          this.currentQuestion = Object.assign({}, {
            question: node.question,
            exclude_choices: [...node.exclude_choices],
            answers: [
              {response: 'yes', excludes: [...node.answers[0].excludes], exclude_choices: [...node.answers[0].exclude_choices] },
              {response: 'no', excludes: [...node.answers[1].excludes], exclude_choices: [...node.answers[0].exclude_choices] }
            ]
          });
          this.newNode = false;
        }
        this.currentNode.push(node);
        this.dialogEditQuestion = true;
      }
    },
    saveItem() {
      if (this.newNode) {
        this.updateExcludeChoiceSet(this.currentQuestion, false);
        this.currentNode[0].answers.push(...this.currentQuestion.answers);
        this.currentNode[0].question = this.currentQuestion.question;
      } else {
        this.updateCurrentNodeExcludes(0);
        this.updateCurrentNodeExcludes(1);
        this.updateExcludeChoiceSet(this.currentNode[0], true);
        this.currentNode[0].question = this.currentQuestion.question;
      }
      this.closeEditItem();
    },
    updateCurrentNodeExcludes(index) {
      this.currentNode[0].answers[index].excludes.splice(0);
      this.currentNode[0].answers[index].excludes.push(...this.currentQuestion.answers[index].excludes);
    },
    updateExcludeChoices(node, index, recursive) {
      node.answers[index].exclude_choices.splice(0);
      node.answers[index].exclude_choices.push(...node.exclude_choices.filter(
        c => !node.answers[index].excludes.includes(c)
      ));
      if (recursive) {
        this.updateExcludeChoiceSetIfChildren(node.answers[0]);
        this.updateExcludeChoiceSetIfChildren(node.answers[1]);
      }
    },
    updateExcludeChoiceSetIfChildren(node) {
      if (node.length > 0) {
        this.updateExcludeChoiceSet(node, true);
      }
    },
    updateExcludeChoiceSet(node, recursive) {
      this.updateExcludeChoices(node, 0, recursive);
      this.updateExcludeChoices(node, 1, recursive);
    },
    closeEditItem() {
      this.currentNode.splice(0);
      this.dialogEditQuestion = false;
    },
    deleteItem(node) {
      if (node.answers.length > 0) {
        this.currentNode.push(node);
        this.dialogDeleteQuestion = true;
      }
    },
    deleteItemConfirm() {
      this.currentNode[0].answers.splice(0);
      this.currentNode[0].question = '';
      this.closeDeleteItem();
    },
    closeDeleteItem() {
      this.currentNode.splice(0);
      this.dialogDeleteQuestion = false;
    }
  }
}
</script>

<style scoped>

</style>