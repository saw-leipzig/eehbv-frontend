<template>
  <div>
    <v-card>
      <v-card-title>Eigenes Passwort ändern</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field :value="user.username" :label="$t('user.username')" disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="oldPassword" :label="$t('user.old_password')" @click:append="showOldPwd = !showOldPwd"
                          :append-icon="showOldPwd ? 'mdi-eye' : 'mdi-eye-off'" :type="showOldPwd ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="password" :label="$t('user.new_password')" @click:append="show1 = !show1"
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="repetitionPwd" :label="$t('user.new_password_rep')" @click:append="show2 = !show2"
                          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledSendPwdChange" @click="changePwdSelf">{{$t('user.change_pwd')}}</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="user.role > 2">
      <v-card-title>{{$t('user.create')}}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-text-field v-model="newUser.username" :label="$t('user.username')" counter="20"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="newUser.password" :label="$t('user.password')" @click:append="show3 = !show3"
                          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'" :type="show3 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="repetitionNewUsersPwd" :label="$t('user.password_rep')" @click:append="show4 = !show4"
                          :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'" :type="show4 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select :items="userRoles" v-model="newUser.role" :label="$t('user.role')"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledSendNewUser" @click="createNewUser">{{$t('user.create')}}</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="user.role > 2">
      <v-card-title>{{$t('user.change')}}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <v-select :items="userItems" v-model="selectedUser" :label="$t('user.username')"></v-select>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="selectedUserPwd" :label="$t('user.password')" @click:append="show5 = !show5"
                          :append-icon="show5 ? 'mdi-eye' : 'mdi-eye-off'" :type="show5 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field v-model="selectedUserPwdRep" :label="$t('user.password_rep')" @click:append="show6 = !show6"
                          :append-icon="show6 ? 'mdi-eye' : 'mdi-eye-off'" :type="show6 ? 'text' : 'password'"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select :items="userRoles" v-model="selectedRole" :label="$t('user.role')"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="disabledSendSelectedPwdChange" @click="changeSelectedPwd">{{ $t('user.change_pwd') }}</v-btn>
        <v-btn :disabled="disabledSendSelectedRoleChange" @click="changeSelectedRole">{{ $t('user.change_role') }}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import messageHandling from "../mixins/messageHandling";

export default {
  name: "UserManagement",
  mixins: [messageHandling],

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
        this.notify(this.$t('user.msg.loaded_users'));
      });
      this.$http.get('roles').then((response) => {
        this.roles.splice(0, this.roles.length, ...response.data);
        this.notify(this.$t('user.msg.loaded_roles'));
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
      this.$http.put('users/' + id + '/password', data).
          then(() => {
            this.notify(this.$t('user.msg.changed_pwd'));
            reset();
      }).catch((error) => {
        this.handleRequestError(error, this.$t('user.msg.error_password'));
      });
    },
    changeSelectedRole() {
      this.$http.put('users/' + this.selectedUser + '/role', { id: this.selectedUser, role: this.selectedRole }).
          then((response) => {
            const resp_user = response.data;
            const userIndex = this.users.findIndex(u => u.username === resp_user.username);
            this.users.splice(userIndex, 1, resp_user);
            this.selectedRole = 0;
            this.notify(this.$t('user.msg.changed_role'));
      }).catch((error) => {
        this.handleRequestError(error, this.$t('user.msg.error_role'));
      });
    },
    createNewUser() {
      this.$http.post('users', this.newUser).
          then((response) => {
            this.users.push(response.data);
            this.notify(this.$t('user.msg.created_new'));
            this.newUser = Object.assign({}, { username: '', password: '', role: 0});
            this.repetitionNewUsersPwd = '';
      }).catch((error) => {
        this.handleRequestError(error, this.$t('user.msg.error_created'));
      });
    },
  }
}
</script>

<style scoped>

</style>