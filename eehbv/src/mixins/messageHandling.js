export default {
  methods: {
    handleRequestError(error, message) {
      try {
        let msg = error.response ? error.response.message : (error.request ? error.request : error.message);
        this.$store.dispatch('notify', {id: 0, message: msg, color: 'red'});
      } catch (err) {
        this.$store.dispatch('notify', {id: 0, message: message, color: 'red'});
      }
    },
    notify(msg) {
      this.$store.dispatch('notify', { id: 0, message: msg, color: 'green' });
    },
    err(msg) {
      this.$store.dispatch('notify', { id: 0, message: msg, color: 'red' });
    }
  }
}