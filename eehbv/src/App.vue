<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.icon" link :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>EEHBV</v-toolbar-title>
    </v-app-bar>

    <v-main>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/Title';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    drawer: null,
    items: [
      { icon: 'mdi-home-outline', title: 'Startseite', to: { name: 'Home' } },
      { icon: 'mdi-cog-outline', title: 'Komponenten', to: { name: 'Component' } },
      { icon: 'mdi-blur-linear', title: 'Werkstoffeigenschaften', to: { name: 'Property' } },
      { icon: 'mdi-alert-octagon', title: 'Problemklassen', to: { name: 'Process' } },
      { icon: 'mdi-send', title: 'Export', to: { name: 'Home'} }
    ]
  })
};
</script>
