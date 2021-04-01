<template>
  <v-container>
    <component-button></component-button>
    <br/>
    <v-data-table :headers="headers" :items="componentData" :items-per-page="10">

      <!--<component-toolbar v-slot:top></component-toolbar>-->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ comp.view_name }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
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
                    <v-col v-for="detail in details" cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem[detail.column_name]" :label="detail.view_name"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="green darken-1" text @click="save">
                  Save
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
  components: {ComponentToolbar, ComponentButton},

  data: () => ({
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
    },
    defaultItem: {
    },
    componentData: [],
    details: []
  }),

  props: {
    comp: {
      type: Object,
      required: true
    }
  },

  computed: {
    headers: function () {
      return [...this.details.map(d => {
        return {
          text: d.view_name,
          align: 'start',
          sortable:true,
          value: d.column_name
        };
      }),
        { text: 'Aktionen', value: 'actions', sortable: false }
      ];
    },
    formTitle () {
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
      let urlParts = this.comp._links.details.href.split('/');
      this.$http.get('/' + urlParts.slice(3).join('/')).
              then((response) => {
                  this.details = [...response.data._embedded.componentInfoes.sort((a, b) => a.position - b.position)];
          });
      let defItem = {};
      for (let detail in this.details) {
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
    refreshData() {
      this.$http.get('/api/' + this.$route.params.type).
              then((response) => {
                  this.componentData = [...response.data._embedded[this.$route.params.type]];
          });
    },
    getSelfUrl(item) {
      let urlParts = item._links.self.href.split('/');
      return '/' + urlParts.slice(3).join('/')
    },
    editItem(item) {
      this.editedIndex = this.componentData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true
    },
    deleteItem(item) {
      this.editedIndex = this.componentData.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      let apiUrl = this.getSelfUrl(this.editedItem);
      this.$http.delete(apiUrl).
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
        let apiUrl = this.getSelfUrl(this.editedItem);
        this.$http.put(apiUrl, this.editedItem).
                then((response) => {
                    this.refreshData();
            });
      } else {
          this.$http.post('/api/' + this.$route.params.type, this.editedItem).
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