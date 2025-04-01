import { Octokit } from '@octokit/rest'
import { fetchiOSCode, fetchiOSSnapshot } from './github-fetch'

interface CreatePostFromGitHubParams {
  repo: string
  codePath: string
  snapshotPath: string
  token: string
  title: string
  author: string
  description?: string
  tags?: string[]
  categories?: string[]
}

export async function createPostFromGitHub({
  repo,
  codePath,
  snapshotPath,
  token,
  title,
  author,
  description = 'This post demonstrates an iOS component implementation with its corresponding snapshot test.',
  tags = [],
  categories = [],
}: CreatePostFromGitHubParams) {
  try {
    // Fetch both code and snapshot
    const [codeContent, snapshotContent] = await Promise.all([
      fetchiOSCode(repo, codePath, token),
      fetchiOSSnapshot(repo, snapshotPath, token)
    ])

    const userResponse = await fetch('/api/users/me')
    if (!userResponse.ok) {
      throw new Error('Failed to get current user')
    }
    const userData = await userResponse.json()
    console.log('User data:', userData)

    // Create the post using Payload's API
    const postResponse = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content: [
          {
            children: [
              {
                text: description + '\n\n',
              },
              {
                text: '## Implementation\n',
              },
              {
                text: 'Here\'s the Swift implementation of the component:\n\n',
              },
              {
                text: '```swift\n' + codeContent.content + '\n```\n',
              },
              {
                text: '## Visual Preview\n',
              },
              {
                text: 'The following snapshot shows how the component looks:\n\n',
              },
              {
                text: `![Component Snapshot](${snapshotContent.content})\n`,
              },
              {
                text: '*Snapshot test result showing the component in dark overlay mode*\n\n',
              },
              {
                text: '## Notes\n',
              },
              {
                text: '- This component is part of the Instacart Design System\n',
              },
              {
                text: '- The snapshot was generated using SwiftUI previews\n',
              },
              {
                text: '- The implementation follows iOS best practices\n',
              },
            ],
          },
        ],
        author: {
          relationTo: 'users',
          value: userData.id
        },
        status: 'draft',
        publishedDate: new Date().toISOString(),
        tags: tags.map((tag) => ({ tag })),
        categories: categories.map((category) => ({ category })),
      }),
    })

    if (!postResponse.ok) {
      throw new Error('Failed to create post')
    }

    return await postResponse.json()
  } catch (error) {
    console.error('Error creating post from GitHub:', error)
    throw error
  }
}

// Example usage:
const post = await createPostFromGitHub({
  repo: 'instacart/instacart-design-system-ios',
  codePath: 'App/Molecules/IconButtonsView/XIconButtonsView.swift',
  snapshotPath: 'Tests+SwiftUI/__Snapshots__/XIconButtonTestCase/test_iconButton_darkOverlay.Large.png',
  token: 'IDS_IOS_GITHUB_TOKEN',
  title: 'Simple iOS Page',
  author: 'amyc30',
  description: 'A demonstration of the IconButtonsView component from the Instacart Design System, showing both its implementation and visual appearance.',
  tags: ['ios', 'swift'],
  categories: ['development']
}); 