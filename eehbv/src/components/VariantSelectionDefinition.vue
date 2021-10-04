<template>
  <div>
    <VariantTreeDefinition v-if="process.variant_tree" v-model="value" :variants="variants" :process="process"></VariantTreeDefinition>
    <VariantListDefinition v-else v-model="value" :variants="variants" :process="process"></VariantListDefinition>
  </div>
</template>

<script>
import VariantTreeDefinition from "./VariantTreeDefinition";
import VariantListDefinition from "./VariantListDefinition";
export default {
  name: "VariantSelectionDefinition",
  components: {VariantListDefinition, VariantTreeDefinition},
  data: () => ({
  }),

  props: {
    value: {
      type: Object,
      required: true
    },
    variants: {
      type: Array,
      required: true
    },
    process: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>