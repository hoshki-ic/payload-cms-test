type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  tag?: string
  format?: string
  style?: string
  [key: string]: any
}

export function serializeLexicalContent(content: { root: LexicalNode }): string {
  if (!content?.root) return ''

  function serializeNode(node: LexicalNode): string {
    switch (node.type) {
      case 'root':
        return node.children?.map(serializeNode).join('') || ''

      case 'heading':
        const tag = node.tag || 'h3'
        return `<${tag}>${node.children?.map(serializeNode).join('')}</${tag}>`

      case 'paragraph':
        return `<p>${node.children?.map(serializeNode).join('')}</p>`

      case 'text':
        let text = node.text || ''
        if (node.format === 'bold') text = `<strong>${text}</strong>`
        if (node.format === 'italic') text = `<em>${text}</em>`
        if (node.format === 'underline') text = `<u>${text}</u>`
        return text

      default:
        return node.children?.map(serializeNode).join('') || node.text || ''
    }
  }

  return serializeNode(content.root)
}
