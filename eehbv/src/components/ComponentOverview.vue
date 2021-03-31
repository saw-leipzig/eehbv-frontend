<template>
  <v-container>
    <component-button></component-button>
    <v-data-table :headers="headers" :items="componentData" :items-per-page="10" :caption="comp.view_name"></v-data-table>
    <component-button></component-button>
  </v-container>
</template>

<script>
import ComponentButton from "@/components/ComponentButton";

export default {
  name: "ComponentOverview",
  components: {ComponentButton},
  data: () => ({
    componentData: [],
    details: []
  }),
  props: {
    comp: {
      type: Object,
      required: true
    }
  },
  computed: {
    headers: function () {
      return this.details.map(d => {
        return {
          text: d.view_name,
          align: 'start',
          sortable:true,
          value: d.column_name
        };
      });
    }
  },
  created() {
    this.$http.get('/api/' + this.$route.params.type).
            then((response) => {
                this.componentData = [...response.data._embedded[this.$route.params.type]];
        });
    let urlParts = this.comp._links.details.href.split('/');
    this.$http.get('/' + urlParts.slice(3).join('/')).
            then((response) => {
                this.details = [...response.data._embedded.componentInfoes.sort((a, b) => a.position - b.position)];
        });
  }
}
</script>

<style scoped>

</style>