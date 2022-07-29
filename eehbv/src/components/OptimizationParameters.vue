<template>
  <div>
    <v-card class="mb-12">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>{{ $t('process_definition.titles.parameters') }}</v-card-title>
            <v-card-text>
              <v-container>

                <v-row>
                  <v-col v-for="param in process.parameters" v-if="param.general" :key="param.name" cols="12" sm="6" md="4">
                    <v-combobox v-if="param.material_properties_id != null"
                        v-model="value[param.variable_name]"
                        :items="parameterPropOptions(param.material_properties_id)"
                        :label="param.name + ' [' + param.unit + ']'"
                        type="text"
                    ></v-combobox>
                    <v-combobox v-else-if="param.defaults.includes(',')"
                        v-model="value[param.variable_name]"
                        :items="parameterOptions(param.defaults)"
                        :label="param.name + ' [' + param.unit + ']'"
                        type="text"
                    ></v-combobox>
                    <v-text-field v-else
                        v-model="value[param.variable_name]"
                        :label="param.name + ' [' + param.unit + ']'"
                        type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-btn color="green" @click="$emit('continue')">
      {{ $t('general.dialog.next') }}
    </v-btn>

    <v-btn text @click="$emit('abort')">
      {{ $t('general.dialog.abort') }}
    </v-btn>
  </div>
</template>

<script>
import paramValues from "../mixins/paramValues";

export default {
  name: "OptimizationParameters",
  mixins: [ paramValues ],

  data: () => ({
  }),

  props: {
    value: {
      type: Object,
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

  methods: {
  }
}
</script>

<style scoped>

</style>