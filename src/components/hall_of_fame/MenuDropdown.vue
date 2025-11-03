<template>
  <q-btn-dropdown rounded no-caps flat class="text-black" :label="label">
    <template v-slot:dropdown-icon>
      <q-icon name="arrow_drop_down"></q-icon>
    </template>
    <div v-if="header" class="q-ml-md q-mt-md">
      <span class="avenir-bold text-subtitle1">{{ header }}</span>
    </div>
    <q-separator v-if="header" />
    <div :class="label === 'Business' ? 'business-grid' : 'platform-grid'">
      <template v-for="item in items" :key="item.title">
        <div class="platform-item">
          <a :href="item.link">
            <q-img :src="item.img" alt="Item Image" width="3.125rem" />
          </a>
          <a :href="item.link" target="_blank">
            <span :class="label === 'Individual' || 'Platform' ? 'avenir-bold' : ''">{{ item.title }}</span>
            <p v-if="item.description" class="text-black">{{ item.description }}</p>
          </a>
        </div>
      </template>
      <div class="flex items-center">
        <q-btn v-if="extraButton" flat no-caps text-color="white" class="bg-teal-13" label="Browse All Courses" />
      </div>
    </div>
  </q-btn-dropdown>
</template>

<script setup>
defineProps({
  label: String,
  items: Array,
  header: String,
  extraButton: Boolean
})
</script>

<style scoped>
.business-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 3rem;
  padding: 1rem;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 10px;
  margin: 0 auto;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.business-title {
  margin: 0;
  font-size: 1rem;
}

a {
  text-decoration: none;
  color: black;
}
</style>
