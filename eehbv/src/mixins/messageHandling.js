export default {
  methods: {
    handleRequestError(error, message) {
      try {
        let err = error.response ? error.response : (error.request);
        if (!err.status || err.status !== 500) {
          let msg = err ? (err.message ? err.message : JSON.stringify(err)) : error.message;
          this.$store.dispatch('notify', {id: 0, message: msg, color: 'red'});
        }
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