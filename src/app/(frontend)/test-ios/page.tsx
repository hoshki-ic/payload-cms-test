'use client'

import { useState } from 'react'
import { fetchiOSCode, fetchiOSSnapshot } from '@/utils/github-fetch'
import Image from 'next/image'

interface SnapshotImage {
  name: string;
  content: string;
}

export default function TestGitHubPage() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [codeContent, setCodeContent] = useState<string>('')
  const [snapshotImages, setSnapshotImages] = useState<SnapshotImage[]>([])

  const handleTestUIKitCode = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotImages([])

      const result = await fetchiOSCode(
        'instacart/instacart-design-system-ios',
        'App/Molecules/IconButtonsView/IconButtonsViewController.swift',
        '' // Empty string since we're using environment token
      )

      console.log('Code result:', result)
      if (result.type === 'text') {
        setCodeContent(result.content as string)
        setStatus('UIKit code fetched successfully!')
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

  const handleTestSwiftUICode = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotImages([])

      const result = await fetchiOSCode(
        'instacart/instacart-design-system-ios',
        'App/Molecules/IconButtonsView/XIconButtonsView.swift',
        '' // Empty string since we're using environment token
      )

      console.log('Code result:', result)
      if (result.type === 'text') {
        setCodeContent(result.content as string)
        setStatus('SwiftUI code fetched successfully!')
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

  const handleTestSingleSnapshot = async () => {
    try {
      setIsLoading(true)
      setError('')
      setStatus('')
      setCodeContent('')
      setSnapshotImages([])

      const result = await fetchiOSSnapshot(
        'instacart/instacart-design-system-ios',
        'Tests+SwiftUI/__Snapshots__/XIconButtonTestCase/test_iconButton_darkOverlay.Large.png',
        '' // Empty string since we're using environment token
      )

      console.log('Single snapshot result:', result)
      if (result.type === 'image') {
        setSnapshotImages([{
          name: 'test_iconButton_darkOverlay.Large.png',
          content: result.content as string
        }])
        setStatus('Single snapshot fetched successfully!')
      } else {
        throw new Error('Unexpected response type: ' + result.type)
      }
    } catch (err) {
      console.error('Error fetching single snapshot:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch single snapshot')
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
      setSnapshotImages([])

      // Fetch all images from the snapshots directory
      const directoryPath = 'Tests+SwiftUI/__Snapshots__/XIconButtonTestCase'
      console.log('Fetching snapshots from directory:', directoryPath)
      
      const result = await fetchiOSSnapshot(
        'instacart/instacart-design-system-ios',
        directoryPath,
        '' // Empty string since we're using environment token
      )
      
      console.log('Snapshot directory result:', result)

      if (result.type === 'directory') {
        const files = result.content as Array<{ type: string; name: string; path: string }>
        const imageFiles = files.filter(file => 
          file.type === 'file' && 
          (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg'))
        )

        const images: SnapshotImage[] = []
        for (const file of imageFiles) {
          const imageResult = await fetchiOSSnapshot(
            'instacart/instacart-design-system-ios',
            file.path,
            ''
          )
          
          if (imageResult.type === 'image') {
            images.push({
              name: file.name,
              content: imageResult.content as string
            })
          }
        }

        setSnapshotImages(images)
        setStatus(`Successfully fetched ${images.length} snapshots!`)
      } else {
        throw new Error('Unexpected response type: ' + result.type)
      }
    } catch (err) {
      console.error('Error fetching snapshots:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch snapshots')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Test Page for iOS</h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Test Buttons Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Github IconButton</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handleTestUIKitCode}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Fetch iOS UIKit Code'}
                </button>

                <button
                  onClick={handleTestSwiftUICode}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Fetch iOS SwiftUI Code'}
                </button>

                <button
                  onClick={handleTestSingleSnapshot}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${isLoading 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Fetch Single Snapshot'}
                </button>

                <button
                  onClick={handleTestSnapshot}
                  disabled={isLoading}
                  className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${isLoading 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 active:bg-green-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Fetch All Snapshots'}
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

              {/* Snapshots Preview */}
              {snapshotImages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Snapshot Previews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {snapshotImages.map((image, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{image.name}</h4>
                        <img 
                          src={`data:image/png;base64,${image.content}`}
                          alt={`Snapshot ${index + 1}`}
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                    ))}
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