<template>
  <div>
    <v-card class="mb-12">
      <v-card-title>
        <v-icon class="mr-2" right @click="infoOverlay = !infoOverlay">mdi-information-outline</v-icon>
        {{title}}
      </v-card-title>
      <v-card-text>
        <slot/>
      </v-card-text>
    </v-card>

    <v-overlay :opacity="0.9" :value="infoOverlay" z-index="3000">
      <v-container>
        <div v-html="infoText"></div>
      </v-container>
      <v-btn color="orange lighten-2" @click="infoOverlay = false">{{$t('general.dialog.close')}}</v-btn>
    </v-overlay>

    <v-btn color="green" :disabled="disabled" @click="$emit('ok')">
      {{contextNew ? $t('general.dialog.next') : $t('general.dialog.save')}}
    </v-btn>

    <v-btn text @click="$emit('abort')">
      {{$t('general.dialog.abort')}}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "EditNewWrapper",

  data: () => ({
    infoOverlay: false
  }),

  props: {
    contextNew: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    infoText: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style scoped>

</style>