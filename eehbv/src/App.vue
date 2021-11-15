<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link :to="{ name: 'Home' }">
          <v-list-item-icon><v-icon>mdi-home-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Startseite</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'Component' }">
          <v-list-item-icon><v-icon>mdi-cog-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>{{$t('components.title.components')}}</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'Property' }">
          <v-list-item-icon><v-icon>mdi-blur-linear</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>{{$t('material_properties.properties')}}</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'Process' }">
          <v-list-item-icon><v-icon>mdi-alert-octagon</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Problemklassen</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'History' }">
          <v-list-item-icon><v-icon>mdi-folder-cog-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>{{$t('history.title')}}</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{ name: 'Glossary' }">
          <v-list-item-icon><v-icon>mdi-folder-information-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>{{$t('glossary.title')}}</v-list-item-title></v-list-item-content>
        </v-list-item>
<!--        <v-list-item link :to="{ name: 'Home' }">
          <v-list-item-icon><v-icon>mdi-send</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>Export</v-list-item-title></v-list-item-content>
        </v-list-item>-->
        <v-list-item link :to="{ name: 'Users' }" v-if="user.role > 0">
          <v-list-item-icon><v-icon>mdi-account-supervisor-circle-outline</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>{{$t('user.management')}}</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>EEHBV</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu left bottom>
         <template v-slot:activator="{ on, attrs }">
           <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="user.role > 0">
            <v-list-item-title>{{user.username}}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="user.role > 0" @click="$store.commit('LOGOUT')">
            <v-list-item-title>{{$t('user.logout')}}</v-list-item-title>
          </v-list-item>
          <v-list-item v-else link :to="{name: 'Login'}">
            <v-list-item-title>{{$t('user.login')}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <notifications></notifications>
  </v-app>
</template>

<script>
import HelloWorld from './components/Title';
import Notifications from "./components/Notifications";
import { mapGetters } from  'vuex';

export default {
  name: 'App',

  components: {
    Notifications,
    HelloWorld,
  },

  data: () => ({
    drawer: false
  }),

  computed: {
    ...mapGetters(['user'])
  }
};
</script>
