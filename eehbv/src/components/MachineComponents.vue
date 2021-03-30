<template>
  <v-container>
    <v-row>
      <v-col cols="4" v-for="comp in components" :key="comp.api_name">
        <v-card>
          <v-card-title>{{comp.view_name}}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "MachineComponents",

    data: () => ({
      tables: [
        { name: 'component_motors', view: 'Motoren', api: '/api/motors'},
        { name: 'component_gears', view: 'Getriebe', api: '/api/gears'}
      ]
    }),
    computed: {
      ...mapState(['components', 'componentInfos'])
    },
    created() {
      this.$store.dispatch('initComponents');
    }
  }
</script>

<style scoped>

</style>