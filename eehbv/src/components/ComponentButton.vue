<template>
  <v-row>
    <v-col>
      <v-btn :to="{ name: 'Component' }" small>
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ComponentButton"
}
</script>

<style scoped>

</style>