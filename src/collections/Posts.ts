import { DosAndDonts } from '@/blocks/DosAndDonts'
import type { CollectionConfig } from 'payload'
import { Accessibility } from '../blocks/Accessibility'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    preview: ({ id }) => {
      const baseURL = process.env.NEXT_PUBLIC_SERVER_URL
      return `${baseURL}/posts/${id}`
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'dosAndDonts',
      label: "Do's and Don'ts",
      type: 'blocks',
      blocks: [DosAndDonts],
      maxRows: 1,
    },
    {
      name: 'accessibility',
      type: 'blocks',
      blocks: [Accessibility],
      maxRows: 3,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'categories',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'text',
        },
      ],
    },
    // Sidebar fields
    {
      name: 'status',
      type: 'select',
      options: [
        {
          value: 'draft',
          label: 'Draft',
        },
        {
          value: 'published',
          label: 'Published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
