<template>
  <LabDetails />

  <div class="q-mx-lg">
    <TabsSection
      class="q-mx-xl"
      :boldNumber="700"
      fontFamily="Roboto"
      fontSize="16px"
      paddingSize="12px"
      color="#6B6B6B"
      alignItem="justify"
      :lineHeight="1.2"
      :contentInfoArray="publicLabsStore.labList[0]?.description"
    />
  </div>
</template>

<script setup>
import LabDetails from 'src/components/public_labs/LabDetails.vue'
import TabsSection from 'src/components/TabsInfo/LabTab.vue'
import { usePublicLabsStore } from 'src/store/pinia/publicLabs'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const publicLabsStore = usePublicLabsStore()
const route = useRoute()

const lab_id = route.params.lab_id
const ltik = route.query.ltik || route.params.ltik

onMounted(async () => {
  await publicLabsStore.getLabDetails(lab_id, ltik)
})
</script>

<style lang="scss" scoped></style>
