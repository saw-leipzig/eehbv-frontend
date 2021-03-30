<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="6">
        <v-img
          :src="require('../assets/tud-logo.svg')"
          class="my-3"
          contain
          height="100"
        />
      </v-col>
      <v-col cols="6">
        <v-img
          :src="require('../assets/SAW.svg')"
          class="my-3"
          contain
          height="140"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          EEHBV
        </h1>

        <p class="subheading font-weight-regular">
          Energieeffiziente Energiewandlung in der industriellen
          <br>Holzbe- und -verarbeitung vom Prozess bis zum Stromnetz
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Teilprojekte
        </h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Title',

    data: () => ({
      whatsNext: [
        {
          text: 'Elektrischer Antriebsstrang und Nebenverbraucher',
          href: 'https://www.fnr.de/index.php?id=11150&fkz=2220HV046A',
        },
        {
          text: 'Arbeitsmaschinen und –prozesse',
          href: 'https://www.fnr.de/index.php?id=11150&fkz=2220HV046B',
        },
        {
          text: 'Datenbank, Datenmanagement, Cluster- und Optimierungsalgorithmen',
          href: 'https://www.fnr.de/index.php?id=11150&fkz=2220HV046C',
        },
      ]
    })
  }
</script>
