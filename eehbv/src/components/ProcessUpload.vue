<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12"><h2>{{$t("process_upload.titles.json_upload")}}</h2></v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-textarea v-model="jsonStr" rows="10" :label="$t('process_upload.labels.json')"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="green" @click="upload" :disabled="jsonStr === ''">{{$t('process_upload.labels.upload')}}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ProcessUpload",

  data () {
    return {
      jsonStr: ''
    }
  },

  methods: {
    upload() {
      let jsonData = JSON.parse(this.jsonStr)
      this.$http.post('processes', jsonData).
          then((response) => {
            if (response.status < 400) {
              this.$router.push({ name: 'Process' });
            } else {
              // ToDo: error handling
            }
          }
      ).catch((error) => {
        // ToDo: error handling
      });
    }
  }

}
</script>

<style scoped>

</style>