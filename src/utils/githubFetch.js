export async function githubFetch(url) {
    const token = import.meta.env.VITE_GITHUB_TOKEN
  
    const headers = token
      ? { Authorization: `token ${token}` }
      : {}
  
    const response = await fetch(url, { headers })
  
    const data = await response.json()
  
    if (data.message && data.message.includes('API rate limit exceeded')) {
      console.error('GitHub API rate limit hit:', data)
      throw new Error('GitHub API rate limit exceeded')
    }
  
    return data
  }
  