<template>
  <v-toolbar flat>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-divider class="mx-4" inset vertical ></v-divider>
    <v-spacer></v-spacer>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on">Neuer Eintrag</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline"><{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
<!--              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="value.name" label="Dessert name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="value.calories" label="Calories"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" >
                <v-text-field v-model="value.fat" label="Fat (g)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="value.carbs" label="Carbs (g)" ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="value.protein" label="Protein (g)"></v-text-field>
              </v-col>-->
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

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-toolbar>
</template>

<script>
export default {
  name: "ComponentToolbar",
  props: {
    value: {
      type: Object,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    },
    dialogDelete: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    formTitle: {
      type: String,
      required: true
    }
  },
  methods: {
    closeDelete() {
      // propagate
    },
    deleteItemConfirm() {
      // prop
    },
    close() {
      //
    },
    save() {
      //
    }
  }
}
</script>

<style scoped>

</style>