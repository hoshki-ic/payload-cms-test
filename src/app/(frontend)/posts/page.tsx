import { getPayload } from 'payload'
import config from '../../../payload.config'

export default async function PostsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
  })

  const { docs } = posts

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-6">
        {docs.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              <a href={`/posts/${post.id}`} className="hover:underline">
                {post.title}
              </a>
            </h2>
            <div className="text-sm text-gray-500">
              Published on: {new Date(post.publishedDate!).toLocaleDateString()}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
