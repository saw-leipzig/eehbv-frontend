<template>
  <div>
    <m-e :machine-definition="machineDefinition" :process-id="processId" :variant-name="variantName" :variant-id="variantId"></m-e>
  </div>
</template>

<script>
import MachineExploration from "@/components/MachineExploration";

export default {
  name: "MachineExploration",
  components: {
    'm-e': MachineExploration
  },

  props: {
    machineDefinition: {
      type: Object,
      required: true
    },
    processId: {
      type: Number,
      required: true
    },
    variantId: {
      type: Number,
      required: true
    },
    variantName: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>