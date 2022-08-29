export default {
  methods: {
    boolText(val) {
      return val ? this.$t('general.bool.yes') : this.$t('general.bool.no')
    }
  }
}