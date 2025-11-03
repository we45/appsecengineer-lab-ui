<template>
  <div v-bind="$attrs" class="ase-markdown full-width" v-html="compiledMarkdown"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const compiledMarkdown = computed(() => marked.parse(props.content))

marked.setOptions({
  highlight(code, lang) {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, {
        language: lang
      }).value
    }
    return hljs.highlightAuto(code).value
  }
})
</script>
