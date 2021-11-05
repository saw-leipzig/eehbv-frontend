<template>
  <div>
    <v-card>
      <v-card-title>Eigenes Passwort ändern</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field :value="user.username" label="Benutzername" disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="oldPassword" label="Altes Passwort" @click:append="showOldPwd = !showOldPwd"
                          :append-icon="showOldPwd ? 'mdi-eye' : 'mdi-eye-off'" :type="showOldPwd ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="password" label="Neues Passwort" @click:append="show1 = !show1"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="repetitionPwd" label="Wdh. neues Passwort" @click:append="show2 = !show2"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledSendPwdChange" @click="changePwdSelf">Ändern</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="user.role > 2">
      <v-card-title>Benutzer anlegen</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field v-model="newUser.username" label="Benutzername" counter="20"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="newUser.password" label="Passwort" @click:append="show3 = !show3"
                          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'" :type="show3 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="repetitionNewUsersPwd" label="Wiederholung Passwort" @click:append="show4 = !show4"
                          :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'" :type="show4 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select :items="userRoles" v-model="newUser.role" label="Benutzerrolle"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledSendNewUser" @click="createNewUser">Anlegen</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="user.role > 2">
      <v-card-title>Benutzer ändern</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-select :items="userItems" v-model="selectedUser" label="Benutzername"></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="selectedUserPwd" label="Passwort" @click:append="show5 = !show5"
                          :append-icon="show5 ? 'mdi-eye' : 'mdi-eye-off'" :type="show5 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="selectedUserPwdRep" label="Wiederholung Passwort" @click:append="show6 = !show6"
                          :append-icon="show6 ? 'mdi-eye' : 'mdi-eye-off'" :type="show6 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select :items="userRoles" v-model="selectedRole" label="Benutzerrolle"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledSendSelectedPwdChange" @click="changeSelectedPwd">Passwort ändern</v-btn>
        <v-btn :disabled="disabledSendSelectedRoleChange" @click="changeSelectedRole">Benutzerrolle ändern</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "UserManagement",

  data: () => ({
    oldPassword: '',
    password: '',
    repetitionPwd: '',
    showOldPwd: false,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    newUser: {
      username: '',
      password: '',
      role: 0
    },
    repetitionNewUsersPwd: '',
    errorMsg: '',
    users: [],
    roles: [],
    selectedUser: '',
    selectedUserPwd: '',
    selectedUserPwdRep: '',
    selectedRole: 0
  }),

  created() {
    if (this.user.role > 2) {
      this.$http.get('users').then((response) => {
        this.users.splice(0, this.users.length, ...response.data);
        this.$store.dispatch('notify', {id: 0, message: 'Beutzer geladen', color: 'green'});
      });
      this.$http.get('roles').then((response) => {
        this.roles.splice(0, this.roles.length, ...response.data);
        this.$store.dispatch('notify', {id: 0, message: 'Benutzerrollen geladen', color: 'green'});
      });
    }
},

  computed: {
    ...mapGetters(['user']),
    disabledSendPwdChange() {
      return this.password === '' || this.password !== this.repetitionPwd;
    },
    disabledSendNewUser() {
      return this.newUser.username === '' || this.newUser.password === '' ||
          this.newUser.password !== this.repetitionNewUsersPwd || this.newUser.role < 1;
    },
    disabledSendSelectedPwdChange() {
      return this.selectedUser === '' || this.selectedUserPwd === '' || this.selectedUserPwd !== this.selectedUserPwdRep ||
          this.selectedUser === this.user.username;
    },
    disabledSendSelectedRoleChange() {
      return this.selectedUser === '' || this.selectedRole === 0 || this.selectedUser === this.user.username;
    },
    userItems() {
      return this.users.map(u => { return { value: u.id, text: u.username + ' (' + this.userRole(u.role) + ')' }});
    },
    userRoles() {
      return [{ value: 0, text: '--'}, ...this.roles.map(r => { return { value: r.id, text: r.role }})];
    }
  },

  methods: {
    userRole(roleId) {
      return this.roles.length > 0 ? this.roles.find(r => r.id === roleId).role : '--';
    },
    changePwdSelf() {
      let data = { id: this.user.id, password: this.password };
      let reset = () => {
        this.oldPassword = '';
        this.password = '';
        this.repetitionPwd = '';
      };
      this.changePwd(this.user.id, data, reset);
    },
    changeSelectedPwd() {
      let data = { id: this.selectedUser, password: this.selectedUserPwd };
      let reset = () => {
        this.selectedUserPwd = '';
        this.selectedUserPwdRep = '';
      };
      this.changePwd(this.selectedUser, data, reset);
    },
    changePwd(id, data, reset) {
      // ToDo: reset text fields
      this.$http.put('users/' + id + '/password', data).
          then(() => {
            this.$store.dispatch('notify', { id: 11, message: 'Passwort geändert', color: 'green' });
            reset();
      }).catch((error) => {
        console.log(error);
        this.$store.dispatch('notify', { id: 12, message: error.response.message, color: 'red' });
      });
    },
    changeSelectedRole() {
      this.$http.put('users/' + this.selectedUser + '/role', { id: this.selectedUser, role: this.selectedRole }).
          then((response) => {
            const resp_user = response.data;
            const userIndex = this.users.findIndex(u => u.username === resp_user.username);
            this.users.splice(userIndex, 1, resp_user);
            this.selectedRole = 0;
            this.$store.dispatch('notify', { id: 11, message: 'Benutzerrolle geändert', color: 'green' });
      }).catch((error) => {
        console.log(error);
        this.$store.dispatch('notify', { id: 12, message: error.response.message, color: 'red' });
      });
    },
    createNewUser() {
      this.$http.post('users', this.newUser).
          then((response) => {
            this.users.push(response.data);
            this.$store.dispatch('notify', { id: 11, message: 'Neuer Benutzer angelegt', color: 'green' });
            this.newUser = Object.assign({}, { username: '', password: '', role: 0});
            this.repetitionNewUsersPwd = '';
      }).catch((error) => {
        console.log(error);
        let msg = error.response ? (error.response.data ? error.response.data : error.response.status) :
            (error.request ? error.request : error.message);
        this.$store.dispatch('notify', { id: 0, message: msg, color: 'red' });
      });
    },
  }
}
</script>

<style scoped>

</style>