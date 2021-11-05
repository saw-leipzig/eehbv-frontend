<template>
  <v-card>
    <v-card-title>Anmeldung</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="credentials.username" label="Benutzername" counter="20"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="credentials.password" label="Passwort" @click:append="show = !show"
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="disabledSend" @click="login">Anmelden</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    credentials: {
      username: '',
      password: ''
    },
    show: false,
    errorMsg: ''
  }),

  computed: {
    disabledSend() {
      return this.credentials.username === '' || this.credentials.password === '';
    }
  },

  methods: {
    login() {
      this.$http.post('auth/login', this.credentials).
          then((response) => {
            if (response.data.status === 'ok') {
              this.$store.commit('SET_USER', response.data.user);
              this.$router.push({name: 'Home'});
            } else {
              this.$store.dispatch('notify', { id: 0, message: response.data.message, color: 'red' });
            }
      }).catch((error) => {
        let msg = error.response ? error.response : (error.request ? error.request : error.message);
        this.$store.dispatch('notify', { id: 0, message: msg, color: 'red' });
      });
    }
  }
}
</script>

<style scoped>

</style>