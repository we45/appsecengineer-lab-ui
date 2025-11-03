<template>
  <div class="markdown-body" ref="markdown-it-vue-container"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItSubscript from 'markdown-it-sub'
import MarkdownItSuperscript from 'markdown-it-sup'
import MarkdownItFootnote from 'markdown-it-footnote'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItAbbreviation from 'markdown-it-abbr'
import MarkdownItInsert from 'markdown-it-ins'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItKatex from 'markdown-it-katex'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItLatex from 'src/utils/latex/src'
import MarkdownItContainer from 'markdown-it-container'
import MarkdownItGithubToc from 'markdown-it-github-toc'
import MarkdownItSourceMap from 'markdown-it-source-map'
import MarkdownItLinkAttributes from './markdown/markdown-it-link-attributes'
import MarkdownItEcharts from './markdown/markdown-it-plugin-echarts'
import MarkdownItFlowchart from './markdown/markdown-it-plugin-flowchart'
import MarkdownItHighlight from './markdown/markdown-it-highlight.js'
import MarkdownItMermaid from './markdown/markdown-it-plugin-mermaid'

import MarkdownItFontAwsome from './markdown/markdown-it-font-awsome'
import 'github-markdown-css'
import 'src/utils/latex/src/katex.css'

import echarts from 'echarts/dist/echarts.simple.min'
import mermaid from 'mermaid'
import flowchart from 'flowchart.js'

const DEFAULT_OPTIONS_LINK_ATTRIBUTES = {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
}
const DEFAULT_OPTIONS_KATEX = { throwOnError: false, errorColor: '#c10015' }
const DEFAULT_OPTIONS_TASKLISTS = null
const DEFAULT_OPTIONS_GITHUBTOC = {
  tocFirstLevel: 2,
  tocLastLevel: 3,
  tocClassName: 'toc',
  anchorLinkSymbol: '',
  anchorLinkSpace: false,
  anchorClassName: 'anchor',
  anchorLinkSymbolClassName: 'octicon octicon-link'
}

export default {
  name: 'markdown-it-vue',
  props: {
    content: {
      type: String
    },
    options: {
      type: Object,
      default() {
        return {
          markdownIt: {
            linkify: true,
            html: true
          },
          linkAttributes: DEFAULT_OPTIONS_LINK_ATTRIBUTES,
          katex: DEFAULT_OPTIONS_KATEX,
          tasklists: DEFAULT_OPTIONS_TASKLISTS,
          githubToc: DEFAULT_OPTIONS_GITHUBTOC
        }
      }
    }
  },
  watch: {
    content: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.$refs['markdown-it-vue-container']) {
            this.$refs['markdown-it-vue-container'].innerHTML = this.md.render(val)
            // var clipboard = new ClipboardJS('.btn');
            document.querySelectorAll('pre > code').forEach(function (codeBlock) {
              var pre = codeBlock.parentNode
              var codeContainer = document.createElement('div')
              codeContainer.className = 'code-container'
              codeContainer.style.position = 'relative' // Set position to relative for absolute positioning
              pre.parentNode.insertBefore(codeContainer, pre)
              codeContainer.appendChild(pre)

              var button = document.createElement('button')
              button.className = `copy-code-button`
              button.type = 'button'
              button.innerText = 'Copy'

              // Create a span for the copied message
              var copiedMessage = document.createElement('span')
              copiedMessage.className = 'copied-message'
              copiedMessage.style.display = 'none' // Initially hidden
              copiedMessage.innerText = 'Copied!'

              codeContainer.appendChild(button) // Add button to the container
              codeContainer.appendChild(copiedMessage) // Add copied message to the container

              button.addEventListener('click', function () {
                navigator.clipboard.writeText(codeBlock.innerText).then(function () {
                  // Show the copied message
                  copiedMessage.style.display = 'block'

                  // Hide it after 2 seconds
                  setTimeout(function () {
                    button.blur()
                    copiedMessage.style.display = 'none'
                  }, 2000)
                })
              })
            })

            // render echarts
            document.querySelectorAll('.md-echarts').forEach((element) => {
              try {
                const options = JSON.parse(element.textContent)
                const chart = echarts.init(element)
                chart.setOption(options)
              } catch (e) {
                element.outerHTML = `<pre>echarts complains: ${e}</pre>`
              }
            })
            // render mermaid
            mermaid.init(undefined, document.querySelectorAll('.mermaid'))
            // render flowchart
            document.querySelectorAll('.md-flowchart').forEach((element) => {
              try {
                const code = element.textContent
                const chart = flowchart.parse(code)
                element.textContent = ''
                chart.drawSVG(element)
              } catch (e) {
                element.outerHTML = `<pre>flowchart complains: ${e}</pre>`
              }
            })
          }
        })
      }
    }
  },
  data() {
    const optMarkdownIt = this.options.markdownIt
    const linkAttributes = this.options.linkAttributes || DEFAULT_OPTIONS_LINK_ATTRIBUTES
    const optKatex = this.options.katex || DEFAULT_OPTIONS_KATEX
    const optTasklists = this.options.tasklists || DEFAULT_OPTIONS_TASKLISTS
    const optGithubToc = this.options.githubToc || DEFAULT_OPTIONS_GITHUBTOC

    const md = new MarkdownIt(optMarkdownIt)
      .use(MarkdownItEmoji)
      .use(MarkdownItSubscript)
      .use(MarkdownItSuperscript)
      .use(MarkdownItFootnote)
      .use(MarkdownItDeflist)
      .use(MarkdownItAbbreviation)
      .use(MarkdownItInsert)
      .use(MarkdownItMark)
      .use(MarkdownItHighlight)
      .use(MarkdownItLatex)
      .use(MarkdownItSourceMap)
      .use(MarkdownItMermaid)
      .use(MarkdownItEcharts)
      .use(MarkdownItFlowchart)
      .use(MarkdownItLinkAttributes, linkAttributes)
      .use(MarkdownItKatex, optKatex)
      .use(MarkdownItTasklists, optTasklists)
      .use(MarkdownItFontAwsome)
      .use(MarkdownItGithubToc, optGithubToc)
      .use(MarkdownItContainer, 'warning', {
        validate: function (params) {
          return params.trim() === 'warning'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-warning"><svg viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-warning">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'info', {
        validate: function (params) {
          return params.trim() === 'info'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-info"><svg viewBox="64 64 896 896" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-info">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'success', {
        validate: function (params) {
          return params.trim() === 'success'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-success"><svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-success">${icon}`
          } else {
            return '</div>'
          }
        }
      })
      .use(MarkdownItContainer, 'error', {
        validate: function (params) {
          return params.trim() === 'error'
        },
        render: (tokens, idx) => {
          if (tokens[idx].nesting === 1) {
            const icon =
              '<i class="markdown-it-vue-alert-icon markdown-it-vue-alert-icon-error"><svg viewBox="64 64 896 896" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>'
            return `<div class="markdown-it-vue-alter markdown-it-vue-alter-error">${icon}`
          } else {
            return '</div>'
          }
        }
      })

    return {
      md: md
    }
  },
  methods: {
    use(plugin, options) {
      this.md.use(plugin, options)
    },
    get() {
      return this.md
    }
  }
}
</script>

<style lang="scss">
.markdown-body {
  border-radius: 10px !important;
}

.markdown-it-vue-alter-info {
  border: 1px solid $info;
  background-color: $bg-page;
}
.markdown-it-vue-alert-icon-info {
  color: $info;
}
.markdown-it-vue-alter-success {
  border: 1px solid $success;
  background-color: $success-light;
}
.markdown-it-vue-alert-icon-success {
  color: $success;
}
.markdown-it-vue-alter-error {
  border: 1px solid $error;
  background-color: $error-light;
}
.markdown-it-vue-alert-icon-error {
  color: $error;
}
.markdown-it-vue-alter-warning {
  border: 1px solid $warning;
  background-color: $warning-light;
}
.markdown-it-vue-alert-icon-warning {
  color: $warning;
}
.markdown-it-vue-alter {
  border-radius: $generic-border-radius;
  border: 1px solid $border-1;
  margin-bottom: 0;
  display: inline-flex;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  padding: 8px 15px 8px 37px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 16px;
  position: relative;
  list-style: none;
}
.markdown-it-vue-alter p {
  margin-bottom: 2px;
}

.markdown-it-vue-alert-icon {
  top: 11.5px;
  left: 16px;
  position: absolute;
}

.code-container {
  position: relative;
  pre {
    padding-bottom: 50px !important;
    background-color: $bg-surface;
    color: $text-primary;
  }
}
.copy-code-button {
  color: $bg-white;
  background-color: $success;
  display: block;
  margin-left: auto;
  margin-right: 0;
  position: absolute;
  right: 10px;
  bottom: 12px;
  border: 1px solid $border-1;
  padding: 6px 14px;
  font-size: 13px;
  z-index: 1;
  border-radius: $generic-border-radius;
}

.copy-code-button:hover {
  cursor: pointer;
  background-color: $secondary;
}

.copy-code-button:focus {
  /* Avoid an ugly focus outline on click in Chrome,
       but darken the button for accessibility.
       See https://stackoverflow.com/a/25298082/1481479 */
  background-color: $bg-surface;
  outline: 0;
}

.copy-code-button:active {
  background-color: $bg-surface;
}

.highlight pre {
  /* Avoid pushing up the copy buttons. */
  margin: 0;
}

blockquote {
  color: $text-primary !important;
  border-left: 4px solid $text-primary !important;
}

.copy-code-button {
  background: $secondary;
  border: 1px solid $border-1;
  padding: 5px 15px;
  font-size: 14px;
  color: $bg-white;
  border-radius: $generic-border-radius;
}

.q-dark {
  .markdown-body {
    background-color: $bg-dark;
    color: $text-primary !important;

    h2 {
      &:hover {
        .anchor {
          .octicon-link {
            margin-left: 10px;
            &::before {
              color: $text-primary !important;
            }
          }
        }
      }
    }
    .octicon-link {
      color: $text-primary !important;
    }
  }
  blockquote {
    color: $text-primary !important;
    border-left: 4px solid $border-1;
  }
  a {
    color: $secondary !important;
  }
  svg {
    background-color: transparent !important;
    border-radius: $generic-border-radius;
  }
}

.code-container {
  position: relative; // Ensure the container is positioned relative for absolute positioning
}

.copied-message {
  color: $success;
  position: absolute;
  right: 0;
  bottom: -25px;
  font-weight: bold;
  background: $bg-white;
  padding: 4px 8px;
  border-radius: $generic-border-radius;
  display: none;
  z-index: 1000;
  border: 1px solid $border-1;
  box-shadow: 0 2px 4px $shadow-light;
}
</style>

<style lang="css">
/* Override github-markdown-css variables with higher specificity */
.markdown-body {
  /* Custom prettylights syntax highlighting */
  --color-prettylights-syntax-comment: var(--color-text-light-1) !important;
  --color-prettylights-syntax-constant: var(--color-secondary) !important;
  --color-prettylights-syntax-entity: var(--color-accent) !important;
  --color-prettylights-syntax-storage-modifier-import: var(--color-text-primary) !important;
  --color-prettylights-syntax-entity-tag: var(--color-success) !important;
  --color-prettylights-syntax-keyword: var(--color-error) !important;
  --color-prettylights-syntax-string: var(--color-info) !important;
  --color-prettylights-syntax-variable: var(--color-warning) !important;
  --color-prettylights-syntax-brackethighlighter-unmatched: var(--color-error) !important;
  --color-prettylights-syntax-invalid-illegal-text: var(--color-bg-white) !important;
  --color-prettylights-syntax-invalid-illegal-bg: var(--color-error) !important;
  --color-prettylights-syntax-carriage-return-text: var(--color-bg-white) !important;
  --color-prettylights-syntax-carriage-return-bg: var(--color-error) !important;
  --color-prettylights-syntax-string-regexp: var(--color-success) !important;
  --color-prettylights-syntax-markup-list: var(--color-warning) !important;
  --color-prettylights-syntax-markup-heading: var(--color-secondary) !important;
  --color-prettylights-syntax-markup-italic: var(--color-text-primary) !important;
  --color-prettylights-syntax-markup-bold: var(--color-text-primary) !important;
  --color-prettylights-syntax-markup-deleted-text: var(--color-error) !important;
  --color-prettylights-syntax-markup-deleted-bg: var(--color-error-light) !important;
  --color-prettylights-syntax-markup-inserted-text: var(--color-success) !important;
  --color-prettylights-syntax-markup-inserted-bg: var(--color-success-light) !important;
  --color-prettylights-syntax-markup-changed-text: var(--color-warning) !important;
  --color-prettylights-syntax-markup-changed-bg: var(--color-warning-light) !important;
  --color-prettylights-syntax-markup-ignored-text: var(--color-text-light-1) !important;
  --color-prettylights-syntax-markup-ignored-bg: var(--color-secondary) !important;
  --color-prettylights-syntax-meta-diff-range: var(--color-accent) !important;
  --color-prettylights-syntax-brackethighlighter-angle: var(--color-text-light-1) !important;
  --color-prettylights-syntax-sublimelinter-gutter-mark: var(--color-blur) !important;
  --color-prettylights-syntax-constant-other-reference-link: var(--color-info) !important;

  /* Override github-markdown-css color variables */
  --color-fg-default: var(--color-text-primary) !important;
  --color-fg-muted: var(--color-text-light-1) !important;
  --color-fg-subtle: var(--color-blur) !important;
  --color-canvas-default: var(--color-bg-page) !important;
  --color-canvas-subtle: var(--color-bg-surface) !important;
  --color-border-default: var(--color-border-1) !important;
  --color-border-muted: var(--color-border-3) !important;
  --color-neutral-muted: var(--color-border-3) !important;
  --color-accent-fg: var(--color-secondary) !important;
  --color-accent-emphasis: var(--color-secondary) !important;
  --color-attention-subtle: var(--color-warning-light) !important;
  --color-danger-fg: var(--color-error) !important;

  /* Direct property overrides to ensure colors are applied */
  color: var(--color-text-primary) !important;
  background-color: var(--color-bg-primary) !important;
}

/* Override for both light and dark mode preferences */
@media (prefers-color-scheme: light) {
  .markdown-body,
  [data-theme='light'] {
    --color-fg-default: var(--color-text-primary) !important;
    --color-canvas-default: var(--color-bg-page) !important;
    color: var(--color-text-primary) !important;
    background-color: var(--color-bg-primary) !important;
  }
}

@media (prefers-color-scheme: dark) {
  .markdown-body,
  [data-theme='dark'] {
    --color-fg-default: var(--color-text-primary) !important;
    --color-canvas-default: var(--color-bg-page) !important;
    color: var(--color-text-primary) !important;
    background-color: var(--color-color-bg-primary) !important;
  }
}

/* Override highlight.js (hljs) styles */
.markdown-body .hljs,
.hljs {
  color: var(--color-text-primary) !important;
  background: var(--color-bg-surface) !important;
}

.markdown-body pre code.hljs {
  color: var(--color-text-primary) !important;
  background-color: var(--color-bg-surface) !important;
}

/* hljs syntax highlighting overrides */
.markdown-body .hljs-comment,
.markdown-body .hljs-quote {
  color: var(--color-success) !important;
  font-style: italic;
  opacity: 0.9;
}

.markdown-body .hljs-variable,
.markdown-body .hljs-template-variable,
.markdown-body .hljs-attribute,
.markdown-body .hljs-tag,
.markdown-body .hljs-regexp,
.markdown-body .hljs-link,
.markdown-body .hljs-name,
.markdown-body .hljs-selector-id,
.markdown-body .hljs-selector-class {
  color: var(--color-info) !important;
  font-weight: 500;
}

.markdown-body .hljs-number,
.markdown-body .hljs-meta,
.markdown-body .hljs-built_in,
.markdown-body .hljs-builtin-name,
.markdown-body .hljs-literal,
.markdown-body .hljs-type,
.markdown-body .hljs-params {
  color: var(--color-text-primary) !important;
  font-weight: 500;
}

.markdown-body .hljs-string,
.markdown-body .hljs-symbol,
.markdown-body .hljs-bullet {
  color: var(--color-text-primary) !important;
  font-weight: 500;
}

.markdown-body .hljs-title,
.markdown-body .hljs-section {
  color: var(--color-secondary) !important;
  font-weight: 600;
}

.markdown-body .hljs-keyword,
.markdown-body .hljs-selector-tag {
  color: var(--color-secondary) !important;
  font-weight: 600;
}

.markdown-body .hljs-emphasis {
  font-style: italic;
}

.markdown-body .hljs-strong {
  font-weight: 700;
}

.markdown-body .hljs-deletion {
  color: var(--color-error) !important;
  background-color: var(--color-error-light) !important;
}

.markdown-body .hljs-addition {
  color: var(--color-success) !important;
  background-color: var(--color-success-light) !important;
}
</style>
