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
                    <v-col cols="10">{{ $t('optimization.labels.fraction') }}: {{item.portion}}</v-col>
                    <v-col cols="2">
                      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-for="param in process.parameters" :key="param.name" cols="12" sm="6" md="4">
                      {{ param.name + ' = ' + item[param.variable_name] + ' ' + param.unit }}
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
          {{ $t('general.editing.add') }}
        </v-btn>
      </v-card-actions>

      <v-overlay :opacity="0.9" :value="infoOverlay" z-index="3000">
        <v-container>
          <div v-html="$t('optimization.info.parameters')"></div>
        </v-container>
        <v-btn color="orange lighten-2" @click="infoOverlay = false">{{ $t('general.dialog.close') }}</v-btn>
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
                    :label="$t('optimization.labels.fraction')"
                    type="number"
                    :rules="[rules.greaterZero]"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-for="param in process.parameters" :key="param.name" cols="12" sm="6" md="4">
                <v-combobox v-if="param.material_properties_id != null"
                    v-model="editedItem[param.variable_name]" :items="parameterOptions(param.material_properties_id)"
                    :label="param.name + ' [' + param.unit + ']'"
                    type="text"
                ></v-combobox>
                <v-text-field v-else
                    v-model="editedItem[param.variable_name]"
                    :label="param.name + ' [' + param.unit + ']'"
                    type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="close">
            {{ $t('general.dialog.abort') }}
          </v-btn>
          <v-btn color="green darken-1" text @click="save" :disabled="editedItem['portion'] <= 0">
            {{ $t('general.dialog.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DialogDelete v-model="dialogDelete" @abort="closeDelete" @delete="deleteItemConfirm"></DialogDelete>

    <v-dialog v-model="variantDialog" width="400">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" v-bind="attrs" v-on="on" :disabled="value.length < 1">{{ $t('general.dialog.next') }}</v-btn>
      </template>

      <v-card>
        <v-card-title>{{ $t('process_creation.labels.variant_selection_definition') }}</v-card-title>
        <v-card-actions>
          <v-btn @click="continueOne(0)">{{ $t('optimization.labels.pick_list') }}</v-btn>
          <v-btn @click="continueOne(1)">{{ $t('optimization.labels.questions') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn text @click="$emit('abort')">
      {{ $t('general.dialog.abort') }}
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import DialogDelete from "./DialogDelete";
export default {
  name: "OptimizationParameters",
  components: {DialogDelete},
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
    ...mapGetters(['valuesOfProp', 'prop_values']),
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
    parameterOptions(id) {
      return this.valuesOfProp(id).map(v => { return { text: v.material + ' - ' + v.value, value: v.value } });
    },
    initialize() {
      let defItem = {};
      this.process.parameters.forEach(p => defItem[p.variable_name] = 0);
      defItem['portion'] = 0;
      this.defaultItem = Object.assign({}, defItem);
      this.editedItem = Object.assign({}, this.defaultItem);
      if (this.prop_values.length < 1) {
        this.$store.dispatch('initProperties');
      }
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
      for (let param in this.editedItem) {
        if (typeof this.editedItem[param] === 'object') {
          this.editedItem[param] = this.editedItem[param].value;
        } else if (typeof this.editedItem[param] === 'string') {
          this.editedItem[param] = parseInt(this.editedItem[param]);
        }
      }
      if (this.editedIndex === -1) {
        this.value.push(this.editedItem);
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