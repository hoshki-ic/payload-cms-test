import { Block } from 'payload'

export const DosAndDonts: Block = {
  slug: 'dosAndDonts',
  labels: {
    singular: 'Dos and Donts Block',
    plural: 'Dos and Donts Blocks',
  },
  fields: [
    {
      name: 'dos',
      type: 'array',
      label: 'Dos',
      labels: {
        singular: 'Do',
        plural: 'Dos',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'donts',
      type: 'array',
      label: 'Donts',
      labels: {
        singular: 'Dont',
        plural: 'Donts',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
