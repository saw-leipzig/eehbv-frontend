<template>
  <v-dialog v-model="value" :max-width="maxWidth">
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="$emit('save')" :disabled="disabledSave">{{confirmLabel}}</v-btn>
        <v-btn v-if="cancel" color="green darken-1" text @click="$emit('close')">{{$t('general.dialog.cancel')}}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogCardEditor",

  props: {
    value: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    maxWidth: {
      type: String,
      required: false,
      default: 'none'
    },
    disabledSave: {
      type: Boolean,
      required: false,
      default: false
    },
    confirmSave: {
      type: Boolean,
      required: false,
      default: false
    },
    cancel: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    confirmLabel() {
      return this.confirmSave ? this.$t('general.dialog.save') : this.$t('general.dialog.ok');
    }
  }
}
</script>

<style scoped>

</style>