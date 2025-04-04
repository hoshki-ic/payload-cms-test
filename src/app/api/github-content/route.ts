import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

export async function POST(req: Request) {
  try {
    const { repo, path } = await req.json()
    const token = process.env.GITHUB_TOKEN

    console.log('Received request with:', { 
      repo, 
      path, 
      hasToken: !!token,
      tokenPrefix: token?.substring(0, 4) // Log first 4 chars for debugging
    })

    if (!repo || !path || !token) {
      console.log('Missing parameters:', { repo, path, hasToken: !!token })
      return NextResponse.json(
        { error: 'Missing required parameters or GitHub token not configured' },
        { status: 400 }
      )
    }

    // Create Octokit instance with the token
    const octokit = new Octokit({
      auth: token,
      userAgent: 'Instacart-DS-Docs',
      request: {
        timeout: 10000
      }
    })

    const [owner, repoName] = repo.split('/')
    console.log('Fetching content for:', { owner, repoName, path })

    // Test the token first
    try {
      await octokit.auth()
      console.log('Token authentication successful')
    } catch (authError) {
      console.error('Token authentication failed:', authError)
      return NextResponse.json(
        { error: 'Invalid GitHub token. Please check your token configuration.' },
        { status: 401 }
      )
    }

    // Get the content from GitHub
    try {
      // Get repository info first to check access
      try {
        const { data: repoData } = await octokit.repos.get({
          owner,
          repo: repoName,
        })
        console.log('Repository info:', {
          name: repoData.name,
          defaultBranch: repoData.default_branch,
          private: repoData.private
        })
      } catch (repoError: any) {
        console.error('Repository access error:', {
          status: repoError.status,
          message: repoError.message
        })
        if (repoError.status === 404) {
          return NextResponse.json(
            { error: 'Repository not found or access denied' },
            { status: 404 }
          )
        }
        throw repoError
      }

      // Get the content directly without branch reference
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path,
        ref: 'master'  // Explicitly use master branch
      })

      if (Array.isArray(data)) {
        console.log('Directory contents:', data.map(item => ({
          path: item.path,
          type: item.type
        })))
        return NextResponse.json({
          type: 'directory',
          content: data.map(item => ({
            type: item.type,
            name: item.name,
            path: item.path
          }))
        })
      }

      console.log('File data:', {
        path: data.path,
        sha: data.sha,
        type: data.type,
        size: data.size
      })

      if ('content' in data) {
        // Decode the base64 content
        const content = Buffer.from(data.content, 'base64').toString('utf-8')
        
        // Check if the file is an image
        const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(path)
        
        if (isImage) {
          // For images, return the base64 content
          return NextResponse.json({ 
            content: data.content,
            type: 'image'
          })
        } else {
          // For text files (like Swift files)
          return NextResponse.json({ 
            content,
            type: 'text'
          })
        }
      } else {
        return NextResponse.json(
          { error: 'File not found or is not a file' },
          { status: 404 }
        )
      }
    } catch (contentError: any) {
      console.error('Error fetching content:', {
        status: contentError.status,
        message: contentError.message,
        response: contentError.response?.data
      })
      
      if (contentError.status === 404) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: contentError.message },
        { status: contentError.status || 500 }
      )
    }
  } catch (error) {
    console.error('Error in GitHub content route:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch GitHub content',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 