<template>
  <q-breadcrumbs
    v-if="$route.name !== 'dashboard'"
    class="text-grey"
    style="padding: 0 7px"
    active-color=""
    :class="{ 'no-pointer-events ': userActivity.isActivityDisabled }"
  >
    <template v-slot:separator>
      <q-icon size="1em" name="arrow_forward_ios" />
    </template>
    <q-breadcrumbs-el
      v-for="(item, index) in breadCrumbs"
      :key="index"
      :label="item.label"
      class="cursor-pointer"
      :class="{
        activeBreadCrumb: index === breadCrumbs.length - 1
      }"
      @click="onRouteClick(item)"
    />
  </q-breadcrumbs>
</template>

<script>
import { useBreadcrumbsStore } from 'src/store/pinia/breadCrumb'
import { useUserActivity } from 'src/store/pinia/userActivity'
const breadCrumb = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    icon: 'home'
  }
]

export default {
  data() {
    return {
      levelList: '',
      breadCrumbList: [],
      sizeCol: 8,
      pathName: '',
      sizeColSub: 4
    }
  },
  methods: {
    onRouteClick(item) {
      if (this.$route.name === item.name) {
        return
      }
      this.$router.push({ name: item.name })
    }
  },
  computed: {
    breadCrumbs() {
      return [...breadCrumb, ...(this.$route?.meta?.breadCrumbs ?? []), ...this.breadCrumbStore.breadCrumb]
    }
  },
  setup() {
    const breadCrumbStore = useBreadcrumbsStore()
    const userActivity = useUserActivity()

    return {
      breadCrumbStore,
      userActivity
    }
  }
}
</script>

<style lang="scss">
.activeBreadCrumb {
  color: $text-primary;
}
</style>
