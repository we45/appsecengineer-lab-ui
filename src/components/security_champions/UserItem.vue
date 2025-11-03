<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['onSelect'])
</script>

<template>
  <div
    class="member_item row items-center q-px-md q-py-sm q-mb-xs no-wrap"
    :class="{
      selected: selected || user.is_champion,
      'cursor-pointer': !user.is_champion,
      'cursor-default': user.is_champion
    }"
    @click="user.is_champion ? null : emit('onSelect', user)"
  >
    <div class="check_dot q-mr-md row items-center justify-center">
      <q-icon v-if="selected || user.is_champion" name="check" size="8px" color="white" />
    </div>
    <div class="row items-center no-wrap col-grow">
      <q-avatar size="md" class="q-mr-md">
        <img :src="user.profile_url ? `https://${user.profile_url}` : $q.dark.isActive ? '/noUsersDark.svg' : '/noUsers.svg'" />
      </q-avatar>
      <div class="column items-start">
        <span class="avenir-bold">{{ user.first_name }} {{ user.last_name }}</span>
        <div class="row items-center no-wrap">
          <span>{{ user.email }}</span>
          <q-chip v-if="user.is_champion" dense size="sm" class="security-champion-chip q-ml-sm">Security Champion</q-chip>
        </div>
      </div>
    </div>
    <slot name="after" :user="user" />
  </div>
</template>

<style lang="scss" scoped>
.member_item {
  border: 1px solid transparent;
  border-radius: 6px;

  .check_dot {
    height: 13px;
    min-width: 13px;
    border-radius: 9999px;
    border: 1px solid $border-1;
  }

  .role_button {
    background-color: $bg-surface;
    border-radius: 6px;
  }

  &:hover {
    border: 1px solid $border-1;
  }

  &.selected {
    border: 1px solid $accent;
    .check_dot {
      border-color: $accent;
      background-color: $accent;
    }
  }
}

.security-champion-chip {
  background: $tangerine-gradient !important;
  color: $text-light-2 !important;
  font-size: 0.6rem;
  font-weight: bold;
  height: 16px;
  min-height: unset;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
}
</style>
