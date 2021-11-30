<template>
  <v-container>
    <v-row>
      <v-col cols="11">
        <v-select v-model="categoryFilter" multiple chips :items="categories" :label="$t('glossary.labels.categories')"></v-select>
      </v-col>
      <v-col cols="1">
        <v-btn @click="editItem(-1)"><v-icon small>mdi-plus</v-icon></v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card v-for="(gloss, pos) in glossary" v-if="gloss.processes.some(p => categoryFilter.includes(p))" :key="gloss.id">
          <v-card-title>
            <v-row>
              <v-col cols="11">{{ gloss.term }}</v-col>
              <v-col cols="1" v-if="userRole > 0">
                <v-icon small @click="editItem(pos)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(pos)">mdi-delete</v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text><div v-html="gloss.text"></div></v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <DialogCardEditor v-model="dialog" :title="formTitle" :confirm-save="true" max-width="600px" @save="save" @close="close">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="editedItem.term" :label="$t('glossary.labels.term')"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-textarea v-model="editedItem.text" :label="$t('glossary.labels.description')"></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-select v-model="editedItem.processes" multiple chips :items="categories"
                      :label="$t('glossary.labels.categories')"></v-select>
          </v-col>
        </v-row>
      </v-container>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDelete" @abort="closeDelete" @delete="deleteItemConfirm"></DialogDelete>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DialogCardEditor from "./DialogCardEditor";
import DialogDelete from "./DialogDelete";

export default {
  name: "Glossary",
  components: {DialogDelete, DialogCardEditor},
  data: () => ({
    glossary: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      term: '',
      text: '',
      processes: []
    },
    categoryFilter: []
  }),

  created() {
    this.initialize();
  },

  computed: {
    ...mapGetters(['processes', 'userRole']),
    formTitle() {
      return this.editedIndex === -1 ? this.$t('general.editing.new') : this.$t('general.editing.edit')
    },
    categories() {
      return this.processes.map(p => { return { text: p.view_name, value: p.id } });
    }
  },

  methods: {
    initialize() {
      this.$store.dispatch('initProcesses').
          then(() => this.categoryFilter = [...this.processes.map(p => p.id)]);
      this.$http.get('glossary').
          then((response) => {
              this.glossary.splice(0, this.glossary.length, ...response.data);
      });
    },
    editItem(index) {
      this.editedIndex = index;
      this.editedItem = index < 0 ? Object.assign({}, {term: '', text: '', processes: []}) :
          Object.assign({}, this.glossary[index]);
      this.dialog = true;
    },
    save() {
      if (this.editedIndex < 0) {
        this.$http.post('glossary', this.editedItem).
            then((response) => {
              this.glossary.push(response.data);
        });
      } else {
        this.$http.put('glossary/' + this.glossary[this.editedIndex].id, this.editedItem).
            then((response) => {
              this.glossary.splice(this.editedIndex, 1, response.data);
        });
      }
      this.close();
    },
    close() {
      this.dialog = false;
    },
    deleteItem(index) {
      this.editedIndex = index;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.$http.delete('glossary/' + this.glossary[this.editedIndex].id).
          then((response) => {
              this.glossary.splice(this.editedIndex, 1);
      });
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