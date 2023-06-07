<template>
  <v-dialog v-model="value" max-width="390px">
    <v-card>
      <v-card-title class="headline">{{title}}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('abort')" v-if="showAbort">{{$t('general.dialog.abort')}}</v-btn>
        <v-btn color="green darken-1" text @click="$emit('delete')">{{deleteBtnText}}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogDelete",

  props: {
    value: {
      type: Boolean,
      required: true
    },
    showAbort: {
      type: Boolean,
      required: false,
      default: true
    },
    title: {
      required: false,
      default: function () {
        return this.$t('general.dialog.confirm_delete')
      }
    },
    deleteBtnText: {
      required: false,
      default: function () {
        return this.$t('general.dialog.ok')
      }
    }
  }
}
</script>

<style scoped>

</style>