<template>
  <v-card>
    <v-card-title>{{$t('user.sign_in')}}</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="credentials.username" :label="$t('user.username')" counter="20"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="credentials.password" :label="$t('user.password')" @click:append="show = !show"
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="disabledSend" @click="login">{{$t('user.login')}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import msgHandling from "../mixins/messageHandling";

export default {
  name: "Login",
  mixins: [msgHandling],

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
              this.err(response.data.message);
            }
      }).catch((error) => {
        this.handleRequestError(error, this.$t('user.msg.error_login'))
      });
    }
  }
}
</script>

<style scoped>

</style>