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
  const [apiResponse, setApiResponse] = useState<string>('')

  const handleTestCode = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotUrl('')
      setApiResponse('')

      const result = await fetchiOSCode(
        'instacart/instacart-design-system-ios',
        'App/Molecules/IconButtonsView/XIconButtonsView.swift',
        '' // Empty string since we're using environment token
      )

      console.log('Code result:', result)
      if (result.type === 'text') {
        setCodeContent(result.content)
        setStatus('Code fetched successfully!')
      } else {
        throw new Error('Unexpected response type: ' + result.type)
      }
    } catch (err) {
      console.error('Error fetching code:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestSnapshot = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotUrl('')
      setApiResponse('')

      // Use the exact path from the GitHub URL
      const path = 'Tests+SwiftUI/__Snapshots__/XIconButtonTestCase/test_iconButton_darkOverlay.Large.png'
      console.log('Trying path:', path)
      
      const result = await fetchiOSSnapshot(
        'instacart/instacart-design-system-ios',
        path,
        '' // Empty string since we're using environment token
      )
      
      console.log('Snapshot result:', result)
      setApiResponse(JSON.stringify(result, null, 2))

      if (result.type === 'image') {
        setSnapshotUrl(result.content)
        setStatus('Snapshot fetched successfully!')
      } else {
        throw new Error('Unexpected response type: ' + result.type)
      }
    } catch (err) {
      console.error('Error fetching snapshot:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch snapshot')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestPost = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotUrl('')
      setApiResponse('')

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Post',
          content: 'This is a test post created from the test page.',
          status: 'published',
          author: '65f8f9b9c4b0a1b1c1d1e1f1', // Replace with a valid user ID
          tags: ['65f8f9b9c4b0a1b1c1d1e1f2'], // Replace with valid tag IDs
          categories: ['65f8f9b9c4b0a1b1c1d1e1f3'], // Replace with valid category IDs
        }),
      })

      const data = await response.json()
      console.log('Post creation response:', data)

      if (!response.ok) {
        throw new Error(data.error || `Failed to create post: ${response.status} ${response.statusText}`)
      }

      setStatus('Post created successfully!')
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Failed to create post')
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