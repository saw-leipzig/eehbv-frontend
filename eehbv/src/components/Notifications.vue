<template>
  <v-snackbar bottom :color="color" v-model="showSnack">{{ message }}</v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Notifications",

  data: () => ({}),

  computed: {
    ...mapGetters(['messages', 'activeMessage']),
    color() {
      return this.messages.length > 0 ? this.messages[0].color : '';
    },
    message() {
      return this.messages.length > 0 ? this.messages[0].message : '';
    },
    showSnack: {
      get() {
        return this.activeMessage && this.messages.length > 0;
      },
      set() {}
    }
  }
}
</script>

<style scoped>

</style>