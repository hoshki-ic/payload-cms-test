'use client'

import { useState } from 'react'
import { fetchiOSCode, fetchiOSSnapshot } from '@/utils/github-fetch'
import Image from 'next/image'

export default function TestGitHubPage() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [codeContent, setCodeContent] = useState<string>('')
  const [snapshotUrl, setSnapshotUrl] = useState<string>('')

  const handleTestCode = async () => {
    try {
      setIsLoading(true)
      setStatus('Fetching code...')
      setError('')
      setCodeContent('')

      const result = await fetchiOSCode(
        'instacart/instacart-design-system-ios',
        'App/Molecules/IconButtonsView/XIconButtonsView.swift',
        '' // Empty string since we're using environment token
      )

      setStatus('Code fetched successfully!')
      setCodeContent(result.content)
      console.log('Code result:', result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(`Error: ${errorMessage}`)
      setStatus('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestSnapshot = async () => {
    try {
      setIsLoading(true)
      setStatus('Fetching snapshot...')
      setError('')
      setSnapshotUrl('')

      const result = await fetchiOSSnapshot(
        'instacart/instacart-design-system-ios',
        'Tests+SwiftUI/__Snapshots__/XIconButtonTestCase/test_iconButton_darkOverlay.Large.png',
        '' // Empty string since we're using environment token
      )

      console.log('Snapshot result:', result)
      console.log('Snapshot URL:', result.content)

      setStatus('Snapshot fetched successfully!')
      setSnapshotUrl(result.content)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(`Error: ${errorMessage}`)
      setStatus('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestPost = async () => {
    try {
      setIsLoading(true)
      setStatus('Creating test post...')
      setError('')

      // First, get the current user's ID
      const userResponse = await fetch('/api/users/me')
      if (!userResponse.ok) {
        throw new Error('Failed to get current user')
      }
      const userData = await userResponse.json()
      console.log('User data:', userData)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Simple iOS Page',
          content: {
            root: {
              children: [
                {
                  children: [
                    {
                      text: 'Testing for iOS page',
                    },
                  ],
                },
              ],
            },
          },
          author: {
            relationTo: 'users',
            value: userData.id
          },
          status: 'draft',
          publishedDate: new Date().toISOString(),
          tags: [{ tag: 'ios' }],
          categories: [{ category: 'development' }],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const result = await response.json()
      setStatus('Test post created successfully!')
      console.log('Post result:', result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(`Error: ${errorMessage}`)
      setStatus('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test GitHub Content Fetching</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <button
            onClick={handleTestCode}
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Test Fetch Code'}
          </button>

          <button
            onClick={handleTestSnapshot}
            disabled={isLoading}
            className={`w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Test Fetch Snapshot'}
          </button>

          <button
            onClick={handleTestPost}
            disabled={isLoading}
            className={`w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Test Create Post'}
          </button>
        </div>

        {status && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            {status}
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Display fetched code */}
        {codeContent && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Fetched Code:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{codeContent}</code>
            </pre>
          </div>
        )}

        {/* Display fetched snapshot */}
        {snapshotUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Snapshot Preview:</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img 
                src={`data:image/png;base64,${snapshotUrl}`}
                alt="Component Snapshot"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 