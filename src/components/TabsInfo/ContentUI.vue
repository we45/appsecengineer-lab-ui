<template>
  <div class="row content-ui q-pa-sm">
    <div class="q-pa-xs col-12">
      <p class="text-justify" v-html="formattedDescription"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentInfoSectionPage',
  props: {
    description: {
      type: String,
      default: ''
    }
  },
  computed: {
    formattedDescription() {
      const description = this.description
      const urlRegex = /(https?:\/\/[^\s]+)/g
      return description.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  white-space: pre-line;
}
p a {
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
.content-ui {
  border: 0.5px solid $border-1;
  border-radius: 8px;
  color: $text-primary;
}
</style>
