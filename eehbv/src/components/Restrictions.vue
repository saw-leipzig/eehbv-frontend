<template>
  <div>
    <v-card class="mb-12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Varianten</v-card-title>
            <v-card-text>
              <v-container>

                <v-row>
                  <v-col cols="12" v-for="variant in variants" :key="variant.id"
                         v-if="variant_selection.includes(variant.id)">
                    <v-card>
                      <v-card-title>{{ variant.name }}</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12"></v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <RestrictionList></RestrictionList>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row v-if="variant_selection.length > 1">
                  <v-col cols="12">
                    <v-card>
                      <v-card-title>Für alle Varianten</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12"></v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <RestrictionList></RestrictionList>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-btn color="green" @click="$emit('continue')">
      Weiter
    </v-btn>

    <v-btn text @click="$emit('abort')">
      Abbruch
    </v-btn>
  </div>
</template>

<script>
import RestrictionList from "./RestrictionList";
export default {
  name: "Restrictions",
  components: {RestrictionList},
  props: {
    process: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    variant_selection: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>