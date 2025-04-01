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
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotUrl('')

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

      // Use the exact path from the GitHub URL
      const path = 'Tests+SwiftUI/__Snapshots__/XIconButtonTestCase/test_iconButton_darkOverlay.Large.png'
      console.log('Trying path:', path)
      
      const result = await fetchiOSSnapshot(
        'instacart/instacart-design-system-ios',
        path,
        '' // Empty string since we're using environment token
      )
      
      console.log('Snapshot result:', result)

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">GitHub Integration Test</h1>
            <p className="text-gray-600">Test fetching code and snapshots from the iOS design system repository</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Test Buttons Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleTestCode}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Test Fetch Code'}
                </button>

                <button
                  onClick={handleTestSnapshot}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${isLoading 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Test Fetch Snapshot'}
                </button>
              </div>
            </div>

            {/* Status and Error Messages */}
            <div className="p-6 border-b border-gray-200">
              {status && (
                <div className="p-4 bg-green-100 text-green-700 rounded">
                  {status}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="p-6">
              {/* Code Preview */}
              {codeContent && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Source Code Preview</h3>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm text-gray-100 font-mono">{codeContent}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Snapshot Preview */}
              {snapshotUrl && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Snapshot Preview</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <img 
                      src={`data:image/png;base64,${snapshotUrl}`}
                      alt="Component Snapshot"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 