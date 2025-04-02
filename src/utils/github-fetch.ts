interface GitHubFile {
  type: 'file' | 'dir';
  name: string;
  path: string;
}

interface GitHubContent {
  type: 'text' | 'image' | 'directory';
  content: string | GitHubFile[];
}

async function fetchGitHubContent(
  repo: string,
  path: string,
  token: string,
  contentType: 'code' | 'snapshot'
): Promise<GitHubContent> {
  try {
    const response = await fetch('/api/github-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repo, path, token }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Failed to fetch ${contentType}`)
    }

    return response.json()
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error)
    throw error
  }
}

export async function fetchiOSCode(
  repo: string,
  path: string,
  token: string
): Promise<GitHubContent> {
  return fetchGitHubContent(repo, path, token, 'code')
}

export async function fetchiOSSnapshot(
  repo: string,
  path: string,
  token: string
): Promise<GitHubContent> {
  return fetchGitHubContent(repo, path, token, 'snapshot')
}

// Example usage:
/*
// Fetch an iOS Swift file
const swiftFile = await fetchiOSCode(
  'owner/repo',
  'path/to/file.swift',
  'your-github-token'
);

// Fetch an iOS snapshot
const snapshot = await fetchiOSSnapshot(
  'owner/repo',
  'path/to/snapshot.png',
  'your-github-token'
);

// Fetch a directory of snapshots
const snapshots = await fetchiOSSnapshot(
  'owner/repo',
  'path/to/snapshots',
  'your-github-token'
);
*/ 