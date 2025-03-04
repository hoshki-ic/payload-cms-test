import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { serializeLexicalContent } from '../../../../lib/lexical'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const post = await payload.find({
    collection: 'posts',
    where: { id: { equals: id } },
  })

  if (!post.docs.length) {
    return notFound()
  }

  const html = serializeLexicalContent(post.docs[0].content)

  return (
    <div className="container mx-auto py-8">
      <article className="prose lg:prose-xl">
        <h1>{post.docs[0].title}</h1>
        <div className="text-sm text-gray-500 mb-8">
          Published on: {new Date(post.docs[0].publishedDate!).toLocaleDateString()}
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  )
}
