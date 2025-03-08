import { Block } from 'payload'

export const Accessibility: Block = {
  slug: 'accessibility',
  labels: {
    singular: 'Accessibility Block',
    plural: 'Accessibility Blocks',
  },
  fields: [
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Main Image',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Keyboard (web)',
          value: 'keyboard_web',
        },
        {
          label: 'Screen Reader (web)',
          value: 'screen_reader_web',
        },
        {
          label: 'Screen Reader (Mobile)',
          value: 'screen_reader_mobile',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Description',
    },
    {
      name: 'accessibilityTable',
      type: 'array',
      label: 'Accessibility Properties',
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: 'Property',
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value',
        },
      ],
    },
  ],
}
