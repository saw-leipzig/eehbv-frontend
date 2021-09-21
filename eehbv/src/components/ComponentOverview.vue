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
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">Neuer Eintrag</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col v-for="detail in comp.infos" :key="detail.position" cols="12" sm="6" md="4">
                      <v-checkbox v-if="detail.type === 'BOOL'" v-model="editedItem[detail.column_name]" :label="entryLabel(detail)"></v-checkbox>
                      <v-text-field v-else
                          v-model="editedItem[detail.column_name]"
                          :label="entryLabel(detail)"
                          :type="detail.type === 'INT' || detail.type === 'DOUBLE' ? 'number' : 'text'"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="close">
                  Abbrechen
                </v-btn>
                <v-btn color="green darken-1" text @click="save">
                  Speichern
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="400px">
            <v-card>
              <v-card-title class="headline">Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="closeDelete">Abbrechen</v-btn>
                <v-btn color="green darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="refreshData">
          Reset
        </v-btn>
      </template>

    </v-data-table>

    <component-button></component-button>
  </v-container>
</template>

<script>
import ComponentButton from "@/components/ComponentButton";
import ComponentToolbar from "@/components/ComponentToolbar";

export default {
  name: "ComponentOverview",
  components: {ComponentButton},

  data: () => ({
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
    },
    defaultItem: {
    },
    componentData: [],
    //details: []
  }),

  props: {
    comp: {
      type: Object,
      required: true
    }
  },

  computed: {
    headers() {
      return [...this.comp.infos.map(d => {
        return {
          text: this.entryLabel(d),
          align: 'start',
          sortable:true,
          value: d.column_name
        };
      }),
        { text: 'Aktionen', value: 'actions', sortable: false }
      ];
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Neuer Eintrag' : 'Eintrag bearbeiten'
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
      for (let detail in this.comp.infos) {
        defItem[detail.column_name] =
            detail.type === 'DOUBLE' || detail.type === 'INT' ?
                0
                : (detail.type === 'BOOL'
                    ? false
                    : ''
                );
      }
      this.defaultItem = Object.assign({}, defItem);
      this.editedItem = Object.assign({}, this.defaultItem);
      this.refreshData();
    },
    entryLabel(detail) {
      return detail.view_name + (detail.unit !== null ? ' [' + detail.unit + ']' : '');
    },
    refreshData() {
      this.$http.get('components/' + this.$route.params.type).
              then((response) => {
                  this.componentData = [...response.data.components];
          });
    },
    editItem(item) {
      this.editedIndex = this.componentData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.componentData.indexOf(item);
      this.editedItem = Object.assign({}, item);
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
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
      });
    },
    save() {
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
    }
  }
}
</script>

<style scoped>

</style>