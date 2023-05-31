<template>
  <v-dialog v-model="value" max-width="390px">
    <v-card>
      <v-card-title class="headline">{{$t('general.dialog.confirm_delete')}}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('abort')">{{$t('general.dialog.abort')}}</v-btn>
        <v-btn color="green darken-1" text @click="$emit('delete')">{{$t('general.dialog.ok')}}</v-btn>
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
    }
  }
}
</script>

<style scoped>

</style>