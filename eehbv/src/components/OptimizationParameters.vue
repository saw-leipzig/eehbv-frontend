<template>
  <div>
    <v-card class="mb-12">
      <v-card-title>
        <v-icon class="mr-2" right @click="infoOverlay = !infoOverlay">mdi-information-outline</v-icon>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col v-for="(item, pos) in value" :key="pos" cols="12">
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col cols="10">Anteil: {{item.portion}}</v-col>
                    <v-col cols="2">
                      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-for="param in process.parameters" :key="param.name" cols="12" sm="6" md="4">
                      {{param.name + ' = ' + item[param.variable_name] + ' ' + param.unit}}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="editDialog = true">
          Hinzufügen
        </v-btn>
      </v-card-actions>

      <v-overlay :opacity="0.9" :value="infoOverlay" z-index="3000">
        <v-container>
          <p>Ein Satz von <strong>Prozessparametern</strong> definiert ein Nutzungsprofil des Prozesses.</p>
          <p>Legen Sie mindestens einen Satz von Prozessparametern mit einem Anteil größer 0 an.</p>
          <p>Soll der Prozess mit unterschiedlichen Profilen betrieben werden,
            gibt der Anteil jeweils die relative Häufigkeit an, mit der dieses Profil voraussichtlich genutzt werden
            wird.</p>
          <p>Die Summe der Anteile muss nicht 1 oder 100 ergeben sondern wird auf 100% normalisiert.</p>
          <p>Prozessparameter, die für einzelne Varianten irrelevant sind, können beliebige Werte haben.</p>
          <div>{{ infoText }}</div>
        </v-container>
        <v-btn color="orange lighten-2" @click="infoOverlay = false">Schließen</v-btn>
      </v-overlay>
    </v-card>

    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="editedItem['portion']"
                    label="Anteil"
                    type="number"
                    :rules="[rules.greaterZero]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-for="param in process.parameters" :key="param.name" cols="12" sm="6" md="4">
                <v-text-field
                    v-model="editedItem[param.variable_name]"
                    :label="param.name + ' [' + param.unit + ']'"
                    :type="'number'"
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
          <v-btn color="green darken-1" text @click="save" :disabled="editedItem['portion'] <= 0">
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

    <v-dialog v-model="variantDialog" width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" v-bind="attrs" v-on="on" :disabled="value.length < 1">Weiter</v-btn>
      </template>

      <v-card>
        <v-card-title>Variantenauswahl</v-card-title>
        <v-card-actions>
          <v-btn @click="continueOne(0)">Pickliste</v-btn>
          <v-btn @click="continueOne(1)">Fragen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn text @click="$emit('abort')">
      Abbruch
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "OptimizationParameters",

  data: () => ({
    variantDialog: false,
    editDialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
    },
    defaultItem: {
    },
    infoOverlay: false,
    rules: {
      greaterZero: value => value > 0 || 'positiver Wert'
    }
  }),

  props: {
    value: {
      type: Array,
      required: true
    },
    infoTexts: {
      type: Array,
      required: true
    },
    process: {
      type: Object,
      required: true
    }
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Neuer Eintrag' : 'Eintrag bearbeiten'
      // ToDo: Mixin with ComponentOverview
    },
    infoText() {
      return this.infoTexts.find(i => i.position === 3)['text'];
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    log() {
      //console.log(this.selection);
    },
    initialize() {
      let defItem = {};
      this.process.parameters.forEach(p => defItem[p.variable_name] = 0);
      defItem['portion'] = 0;
      this.defaultItem = Object.assign({}, defItem);
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    continueOne(select_type) {
      this.variantDialog = false;
      this.$emit('continue', select_type);
    },
    editItem(item) {
      if (item) {
        this.editedIndex = this.value.indexOf(item);
        this.editedItem = Object.assign({}, item);
      }
      console.log(this.editedItem);
      this.editDialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.value.indexOf(item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.value.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.editedIndex = -1;
    },
    save() {
      if (this.editedIndex === -1) {
        this.value.push(this.editedItem)
      } else {
        this.value.splice(this.editedIndex, 1, this.editedItem);
      }
      this.close();
    },
    close() {
      this.editDialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    }
  }
}
</script>

<style scoped>

</style>