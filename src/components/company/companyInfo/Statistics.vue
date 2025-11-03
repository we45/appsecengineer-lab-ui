<template>
  <div class="bordered_info text-center">
    <span style="display: inline-block" v-if="iconName">
      <q-icon
        :name="iconName"
        :style="{ color: iconColor, 'font-size': iconSize, padding: iconPadding, 'border-radius': '25px', 'margin-right': '4px' }"
      />
    </span>
    <div class="padding_7" style="display: inline-block">
      <p class="text-subtitle2 none-spacing text-weight-regular ase-roboto ase-black-shade" style="line-height: 1.5">
        {{ title }}
      </p>
    </div>
    <p class="text-subtitle2 none-spacing text-weight-regular ase-roboto ase-orange" style="line-height: 1.5">
      {{ count }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'CompanyInfoStatisticsInfo',
  props: {
    count: {},
    iconName: {},
    iconColor: { default: '#00000' },
    iconSize: { default: '13px' },
    iconPadding: { default: '5px' },
    subTitle: { type: String },
    title: { type: String }
  }
}
</script>

<style scoped>
.bordered_info {
  background: #fff;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  box-shadow: inset 0px, 1px rgba(0, 0, 0, 0.05);
  padding: 12px;
}
</style>
