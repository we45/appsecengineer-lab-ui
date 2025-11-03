<template>
  <q-drawer
    v-model="drawer"
    :breakpoint="breakpoint"
    :mini="!drawer || miniState"
    :slide="side"
    :width="getWidthBaseDrawer"
    class="bg-primary-5 row justify-between"
    show-if-above
    v-bind="$attrs"
    @click.capture="drawerClick"
    :mini-width="35"
  >
    <template v-for="slot in slots" :key="slot.name" v-slot:[slot.name]>
      <slot :name="$slot.name" />
    </template>
    <q-scroll-area
      v-if="!slots.default"
      :style="{
        display: miniState ? 'none !important' : ''
      }"
      class="fit"
      :content-style="scrollAreaContentStyle"
      :content-active-style="scrollAreaContentActiveStyle"
    >
      <div class="row no-wrap justify-between items-center q-ml-lg q-my-sm">
        <div class="text-h2">{{ title }}</div>
        <BaseBtn flat icon="close" class="sidebar-x" round @click="miniState = true" />
      </div>
      <q-separator />
      <slot name="body" />
    </q-scroll-area>
    <div :class="` absolute to ${side === 'right' ? 'left' : 'right'} ${miniState ? '' : 'display-none'}`" name="feb">
      <BaseBtn
        :icon="side === 'left' ? 'chevron_right' : 'chevron_left'"
        round
        unelevated
        @click="miniState = !important"
        outline
        color="primary-70"
        class="toggle-drawer"
        size="sm"
      />
    </div>
    <div
      v-touch-pan.prevent.mouse="handlePan"
      class="drawer-right-border bg-primary-5"
      :style="{ left: `${getWidthBaseDrawer}px` }"
      :class="miniState ? 'display-none' : ''"
    ></div>
  </q-drawer>
</template>
<script>
import { ref, computed } from 'vue'
import { BaseBtn } from '../BaseBtn'
import { useSlots } from 'src/composables/useSlots'
export default {
  name: 'BaseDrawer',
  components: { BaseBtn },
  inheritAttrs: false,
  props: {
    side: {
      type: String,
      default: 'left',
      validation(value) {
        return ['left', 'right'].includes(value)
      }
    },
    width: {
      type: Number,
      default: 250
    },
    breakpoint: {
      type: Number,
      default: 500
    },
    title: {
      type: String,
      default: ''
    },
    defaultState: {
      validator(value) {
        return ['mini', 'expand'].includes(value)
      }
    },
    noMiniState: Boolean,
    scrollAreaContentStyle: [String, Object, Array],
    scrollAreaContentActiveStyle: [String, Object, Array]
  },
  setup(props, { slots }) {
    const drawer = ref(false)
    const miniState = ref(props.defaultState === 'mini')
    const info = ref(null)
    const panning = ref(false)
    const getWidthBaseDrawer = computed(() => {
      if (!info.value) return props.width
      return info.value.position.left <= 150 ? 150 : info.value.position.left >= 700 ? 700 : info.value.position.left
    })
    return {
      miniState,
      info,
      panning,
      drawer,
      getWidthBaseDrawer,
      slots: useSlots(slots)
    }
  },
  methods: {
    drawerClick(e) {
      if (this.miniState) {
        this.miniState = false
        e.stopPropagation()
      }
    }
  }
}
</script>
