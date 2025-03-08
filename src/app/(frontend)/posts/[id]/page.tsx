import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { Media, Post } from '../../../../payload-types'

const ItemWithImage = ({
  item,
}: {
  item: {
    text: string
    image: string | Media
    id?: string | null
  }
}) => {
  const imageSrc =
    typeof item.image === 'object' && item.image?.url
      ? item.image.url
      : typeof item.image === 'string'
        ? item.image
        : '/placeholder-image.jpg'

  return (
    <div key={item.id} className="flex gap-4 mb-4">
      <Image src={imageSrc} alt={item.text} width={100} height={100} className="rounded" />
      <p>{item.text}</p>
    </div>
  )
}

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

  const data = JSON.parse(JSON.stringify(post.docs[0])) as Post

  return (
    <div className="container mx-auto py-8">
      <article className="prose lg:prose-xl">
        <h1>{data.title}</h1>
        <div className="text-sm text-gray-500 mb-8">
          Published on: {new Date(data.publishedDate!).toLocaleDateString()}
        </div>
        <RichText data={data.content} />

        {data.dosAndDonts?.length && (
          <div>
            <h2>Dos and Don&apos;ts</h2>
            {data.dosAndDonts?.map(
              (block) =>
                block.blockType === 'dosAndDonts' && (
                  <div key={block.id} className="mt-8">
                    <div className="mb-8">
                      <h3>Dos:</h3>
                      {block.dos?.map((item) => <ItemWithImage key={item.id} item={item} />)}
                    </div>

                    <div>
                      <h3>Donts:</h3>
                      {block.donts?.map((item) => <ItemWithImage key={item.id} item={item} />)}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}

        {data.accessibility?.length && (
          <div>
            <h2>Accessibility</h2>
            {data.accessibility?.map(
              (block) =>
                block.blockType === 'accessibility' && (
                  <div key={block.id} className="mt-8">
                    <Image
                      // @ts-ignore
                      src={block.mainImage.url}
                      alt={block.type}
                      width={100}
                      height={100}
                      className="rounded"
                    />
                    <h3>{block.type}</h3>
                    <p>{block.description}</p>
                    <table>
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {block.accessibilityTable?.map((item) => (
                          <tr key={item.id}>
                            <td>{item.key}</td>
                            <td>{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
            )}
          </div>
        )}
      </article>
    </div>
  )
}
