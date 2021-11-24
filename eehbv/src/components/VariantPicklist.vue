<template>
  <div>
    <v-card class="mb-12">

      <v-col cols="12">
        <v-list>
          <v-list-item-group v-model="selection" multiple>
            <template v-for="variant in variants">
              <v-list-item :key="variant.id" :value="variant.id">
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ variant.name }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-card>

    <v-btn color="green" @click="$emit('continue', selection)" :disabled="selection.length < 1">
      {{ $t('general.dialog.next') }}
    </v-btn>

    <v-btn text @click="$emit('abort')">
      {{ $t('general.dialog.abort') }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "VariantPicklist",

  data: () => ({
    selection: []
  }),

  props: {
    process: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    }
  },

  methods: {
    log() {
      console.log(this.value);
    }
  }
}
</script>

<style scoped>

</style>