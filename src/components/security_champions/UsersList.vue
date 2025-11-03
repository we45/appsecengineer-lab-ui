<script setup>
import { computed, shallowRef } from 'vue'
import UserItem from './UserItem.vue'

const props = defineProps({
  modelValue: {
    type: [Object, Array],
    default: null
  },
  multiselect: {
    type: Boolean,
    default: false
  },
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:model-value'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:model-value', value)
  }
})

const search = shallowRef('')

const filteredUsers = computed(() => {
  return props.users.filter((user) => {
    const values = [user.email, user.full_name]
    return values.findIndex((value) => value.toLowerCase().includes(search.value.toLowerCase())) >= 0
  })
})

function handleSelect(user) {
  // Don't allow selection of champions (disabled users)
  if (user?.is_champion) return

  props.multiselect ? handleMultiSelect(user) : handleSingleSelect(user)
}

function handleSingleSelect(user) {
  const isSelected = user?.email === model.value?.email
  model.value = isSelected ? null : user
}

function handleMultiSelect(user) {
  const currentSelection = Array.isArray(model.value) ? model.value : []
  const userIndex = currentSelection.findIndex((selectedUser) => selectedUser?.email === user?.email)

  if (userIndex >= 0) {
    const newSelection = currentSelection.filter((_, index) => index !== userIndex)
    model.value = newSelection.length > 0 ? newSelection : []
  } else {
    model.value = [...currentSelection, user]
  }
}

function isUserSelected(user) {
  if (props.multiselect) {
    return Array.isArray(model.value) && model.value.some((selectedUser) => selectedUser?.email === user?.email)
  } else {
    return user?.email === model.value?.email
  }
}
</script>

<template>
  <div>
    <!-- Search Input -->
    <AseInput
      v-model="search"
      :debounce="300"
      clearable
      fillVariant="outlined"
      heightVariant="short"
      placeholder="Search users"
      class="full-width"
      @clear="search = ''"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </AseInput>

    <!-- User List -->
    <div class="q-pa-md q-mt-md" :class="$q.dark.isActive ? 'bg-dark-1 dark-border' : 'bg-light-grey'" style="border-radius: 6px">
      <template v-if="filteredUsers.length || loading">
        <q-virtual-scroll style="max-height: 35vh" :items="filteredUsers" v-slot="{ item }">
          <UserItem :key="item?.email" :user="item" :selected="isUserSelected(item)" @onSelect="handleSelect" />
        </q-virtual-scroll>
        <div v-if="loading" class="row items-center justify-center full-height q-mt-md">Loading...</div>
      </template>
      <template v-else>
        <div class="row items-center justify-center full-height">No users found</div>
      </template>
    </div>
  </div>
</template>
