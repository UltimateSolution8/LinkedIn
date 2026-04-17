import { useEffect } from 'react'

/**
 * Landing page for the Reddit OAuth popup flow.
 *
 * The Go service redirects the popup here after a successful token exchange
 * (FRONTEND_ORIGIN/oauth/reddit/callback?reddit=connected).
 *
 * This page posts a message to the opener tab so AuthContext1 can refresh the
 * Reddit connection state, then closes the popup.
 */
export default function RedditOAuthCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'reddit-connected' }, window.location.origin)
      window.close()
    } else {
      // Opened directly (not as a popup) — redirect to profile.
      window.location.replace('/profile?reddit=connected')
    }
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-neutral-500 text-sm">Connecting your Reddit account...</p>
    </div>
  )
}
