'use client'

import { useEffect } from 'react'

export function useCSSOptimization() {
  useEffect(() => {
    // Function to optimize CSS loading and prevent preload warnings
    const optimizeCSS = () => {
      // Remove unused preload links
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]')
      
      preloadLinks.forEach((link) => {
        const linkElement = link as HTMLLinkElement
        const href = linkElement.href
        
        // Check if there's a corresponding stylesheet
        const hasStylesheet = document.querySelector(
          `link[rel="stylesheet"][href*="${href.split('?')[0].split('/').pop()}"]`
        )
        
        if (!hasStylesheet) {
          // Convert preload to stylesheet if not exists
          linkElement.rel = 'stylesheet'
          linkElement.removeAttribute('as')
          linkElement.setAttribute('media', 'all')
        } else {
          // Remove redundant preload
          linkElement.remove()
        }
      })

      // Ensure critical CSS is loaded immediately
      const criticalStyles = document.querySelector('style[data-critical]')
      if (criticalStyles) {
        criticalStyles.setAttribute('media', 'all')
      }
    }

    // Run optimization after page load
    if (document.readyState === 'complete') {
      optimizeCSS()
    } else {
      window.addEventListener('load', optimizeCSS)
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', optimizeCSS)
    }
  }, [])
}

export default useCSSOptimization
