import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters(['valuesOfProp']),
  },

  methods: {
    parameterPropOptions(id) {
      return this.valuesOfProp(id).map(v => { return { text: v.material + ' - ' + v.value, value: v.value } });
    },
    parameterOptions(defaults) {
      return defaults.split(',').map(d => parseFloat(d));
    }
  }
}