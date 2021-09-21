<template>
  <div>
    <v-card class="mb-12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Varianten</v-card-title>
            <v-card-text>
              <v-container>

                <v-row v-for="variant in variants" :key="variant.id"
                         v-if="variant_selection.includes(variant.id)">
                  <v-col cols="12">
                    <v-card>
                      <v-card-title>{{ variant.name }}</v-card-title>
                      <v-card-text>
                        <RestrictionList :variant="variant" :parameters="parameters"></RestrictionList>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row v-if="variant_selection.length > 1">
                  <v-col cols="12">
                    <v-card>
                      <v-card-title>Für alle Varianten</v-card-title>
                      <v-card-text>
                        <RestrictionList :variant="variantCommonComp" :parameters="parameters"></RestrictionList>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-btn color="green" @click="continueThree">
      Weiter
    </v-btn>

    <v-btn text @click="$emit('abort')">
      Abbruch
    </v-btn>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import RestrictionList from "./RestrictionList";

export default {
  name: "Restrictions",
  components: {RestrictionList},

  data: () => ({
    variants_conditions: []
  }),

  props: {
    parameters: {
      type: Array,
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
  },

  computed: {
    ...mapGetters(['componentTypes']),
    variantCommonComp() {   // return all components whose variable_name is in all variants' components
      // ToDo: TEST!
      let vcc ={
        components: []
      }
      let nameCount = {};
      this.variants.forEach(v => v.components.forEach(c => {
        let n = c.variable_name;
        nameCount[n] = nameCount[n] ? nameCount[n] + 1 : 1;
      }));
      let v_c_flat = this.variants.map(v => v.components).flat();
      let size = this.variants.length;
      for (let att in nameCount) {
        if (nameCount[att] === size) {
          vcc.components.push(v_c_flat.find(c => c.variable_name === att));
        }
      }
      return vcc;
    }
  },

  watch: {
    variant_selection: function (newVal, oldVal) {
      this.resetConditions();
    }
  },

  methods: {
    continueThree() {
      let v_c = this.variants_conditions.filter((v, i) => i > 0).map(v => {
        v.conditions.push(...this.variants_conditions[0].conditions);
        return v;
      });
      this.$emit('continue', v_c);
    },
    resetConditions() {
      this.variants_conditions.splice(0);
      this.variants_conditions.push({ conditions: [] });
      this.variant_selection.forEach(v => {
        let variant = this.variants.find(va => va.id === v);
        this.variants_conditions.push({
          id: v,
          name: variant.name,
          conditions: []
        });
      });
    }
  }
}
</script>

<style scoped>

</style>