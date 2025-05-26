// @/utils/useMarkdown.js
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ breaks: true })

export function useMarkdown(content = '') {
  return md.render(content)
}
