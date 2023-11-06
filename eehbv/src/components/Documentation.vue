<template>
  <div>
    <h1>{{ $t('documentation.titles') }}</h1>
    <div><a href="static/manual.pdf" target="_blank">{{ $t('documentation.labels.manual') }}</a> </div>
    <div><a href="static/openapi.html" target="_blank">{{ $t('documentation.labels.openapi') }}</a> </div>
    <div><a href="static/arc42.pdf" target="_blank">{{ $t('documentation.labels.arc') }}</a> </div>
    <div><a href="https://github.com/saw-leipzig/eehbv-api/blob/master/LICENSE" target="_blank">{{ $t('documentation.labels.license') }}</a> </div>
    <div><a href="https://github.com/saw-leipzig/eehbv-api/blob/master/AUTHORS" target="_blank">{{ $t('documentation.labels.contributors') }}</a> </div>
    <div><a href="https://github.com/saw-leipzig/eehbv-api" target="_blank">{{ $t('documentation.labels.source_frontend') }}</a> </div>
    <div><a href="https://github.com/saw-leipzig/eehbv-frontend" target="_blank">{{ $t('documentation.labels.source_backend') }}</a> </div>
  </div>
</template>

<script>
export default {
  name: "Documentation"
}
</script>

<style scoped>

</style>