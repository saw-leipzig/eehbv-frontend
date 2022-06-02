<template>
  <v-container>
    <component-button></component-button>
    <br/>
    <v-data-table :headers="headers" :items="componentData" :items-per-page="10">

      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ comp.view_name }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-spacer></v-spacer>
          <v-btn v-if="userRole > 0" color="green" dark class="mb-2" @click="dialogImport = true"><v-icon>mdi-file-upload-outline</v-icon></v-btn>
          <v-btn v-if="userRole > 0" color="green" dark class="mb-2" @click="dialog = true">{{$t('general.editing.new')}}</v-btn>

        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" :disabled="userRole < 1" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small :disabled="userRole < 1" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="refreshData">
          Reset
        </v-btn>
      </template>

    </v-data-table>

    <DialogCardEditor v-model="dialog" :title="formTitle" :confirm-save="true" max-width="600px" @save="save" @close="close">
      <v-container>
        <v-row>
          <v-col v-for="detail in comp.infos" :key="detail.position" cols="12" sm="6" md="4">
            <v-checkbox v-if="detail.type === 'BOOL'" v-model="editedItem[detail.column_name]" :label="entryLabel(detail)"></v-checkbox>
            <v-combobox v-else-if="detail.position === 2" :items="manufacturers"
                      v-model="editedItem[detail.column_name]" :label="entryLabel(detail)"
            >
            </v-combobox>
            <v-text-field v-else
                v-model="editedItem[detail.column_name]"
                :label="entryLabel(detail)"
                :type="detail.type === 'INT' || detail.type === 'DOUBLE' ? 'number' : 'text'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </DialogCardEditor>

    <DialogDelete v-model="dialogDelete" @abort="closeDelete" @delete="deleteItemConfirm"></DialogDelete>

    <DialogCardEditor v-model="dialogImport" :title="$t('components.titles.import')" :confirm-save="true"
                      max-width="400px" @save="upload" @close="closeImport">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-file-input show-size label="Import" v-model="importFile"></v-file-input>
          </v-col>
        </v-row>
      </v-container>
    </DialogCardEditor>

    <component-button></component-button>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import ComponentButton from "./ComponentButton";
import DialogDelete from "./DialogDelete";
import DialogCardEditor from "./DialogCardEditor";
import messageHandling from "../mixins/messageHandling";

export default {
  name: "ComponentOverview",
  components: {DialogCardEditor, DialogDelete, ComponentButton},
  mixins: [messageHandling],

  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogImport: false,
    editedIndex: -1,
    editedItem: {
    },
    defaultItem: {
    },
    componentData: [],
    importFile: null
  }),

  props: {
    comp: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['userRole']),
    headers() {
      return [
          ...this.comp.infos.map(d => {
            return {
              text: this.entryLabel(d),
              align: 'start',
              sortable: true,
              value: d.column_name
            };
          }),
          { text: this.$t('general.editing.actions'), value: 'actions', sortable: false }
      ];
    },
    formTitle() {
      return this.editedIndex === -1 ? this.$t('general.editing.new') : this.$t('general.editing.edit')
    },
    manufacturers() {
      return this.componentData.map(c => { return { text: c.manufacturer, value: c.manufacturer } });
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      let defItem = {};
      for (let i = 0; i < this.comp.infos.length; i++) {
        let detail = this.comp.infos[i];
        defItem[detail.column_name] =
            detail.type === 'DOUBLE' || detail.type === 'INT' ?
                0
                : (detail.type === 'BOOL'
                    ? false
                    : ''
                );
      }
      this.defaultItem = Object.assign({}, defItem);
      this.editedItem = Object.assign({}, this.defaultItem)
      this.refreshData();
    },
    entryLabel(detail) {
      return detail.view_name + (detail.unit !== null ? ' [' + detail.unit + ']' : '');
    },
    resetEditedItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    refreshData() {
      this.$http.get('components/' + this.$route.params.type).
              then((response) => {
                  this.componentData = [...response.data.components];
                  this.notify(this.$t('components.msg.loaded'));
          }).catch(error => {});
    },
    assignItem(item) {
      this.editedIndex = this.componentData.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },
    editItem(item) {
      this.assignItem(item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.assignItem(item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.$http.delete('components/' + this.$route.params.type + '/' + this.editedItem.id).
              then((response) => {
                  this.refreshData();
          });
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.resetEditedItem();
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.resetEditedItem();
      });
    },
    save() {
      if (typeof this.editedItem.manufacturer === 'object') {
        this.$set(this.editedItem, 'manufacturer', this.editedItem.manufacturer.value);
      }
      if (this.editedIndex > -1) {
        this.$http.put('components/' + this.$route.params.type + '/' + this.editedItem.id, this.editedItem).
            then((response) => {
                this.refreshData();
        });
      } else {
        this.$http.post('components/' + this.$route.params.type, this.editedItem).
            then((response) => {
                this.refreshData();
        });
      }
      this.close();
    },
    upload() {
      if (this.importFile) {
        let formData = new FormData();
/*        for (let file of this.importFiles) {
            formData.append('file', file, file.name);
          }*/
        formData.append('file', this.importFile, this.importFile.name);
        this.closeImport();
        this.$http.post('components/' + this.$route.params.type + '/upload', formData).
            then((response) => {
              if (response.data.status === 'ok') {
                this.refreshData();
              } else {
                this.err(response.data.message);
              }
         }).catch(error => { this.handleRequestError(error, this.$t('user.msg.error_login')) });
      }
    },
    closeImport() {
      this.dialogImport = false;
    }
  }
}
</script>

<style scoped>

</style>