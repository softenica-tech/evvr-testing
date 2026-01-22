"use client"
import { useState, useEffect, useRef } from "react"
import "./welcome.scss"
import Image from "next/image"
import bigLogo from "../../../public/assets/images/big_logo.svg"
import OurStory from "../our-story/OurStory"

export default function Welcome() {
  const videoRef = useRef(null)
  const welcomeImageRef = useRef(null)
  const stickyStartScrollRef = useRef(null)
  const isRestoringRef = useRef(false)

  // useEffect(() => {
  //   if (videoRef.current) {
  //     // Set playback speed to 1.25x
  //     videoRef.current.playbackRate = 1.25;
  //   }
  // }, []);

  // Restore video size immediately on mount (before scroll handler)
  useEffect(() => {
    const restoreVideoSize = () => {
      try {
        const savedWidth = localStorage.getItem('welcome-video-width')
        const savedHeight = localStorage.getItem('welcome-video-height')
        
        if (savedWidth && savedHeight && videoRef.current && welcomeImageRef.current) {
          const widthPercent = parseFloat(savedWidth)
          const heightPercent = parseFloat(savedHeight)
          
          // Apply size immediately using both inline styles and CSS custom properties
          welcomeImageRef.current.style.setProperty('--video-width', `${widthPercent}%`)
          welcomeImageRef.current.style.setProperty('--video-height', `${heightPercent}%`)
          videoRef.current.style.width = `${widthPercent}%`
          videoRef.current.style.height = `${heightPercent}%`
          
          // Calculate and apply border-radius
          const windowWidth = window.innerWidth || document.documentElement.clientWidth
          const isMobile = windowWidth <= 767
          const containerWidth = welcomeImageRef.current.offsetWidth || welcomeImageRef.current.clientWidth || window.innerWidth
          const minSizePx = isMobile ? 214 : 360
          const minSizePercent = (minSizePx / containerWidth) * 100
          const maxSizePercent = 100
          const scrollProgress = Math.max(0, Math.min(1, (widthPercent - minSizePercent) / (maxSizePercent - minSizePercent)))
          const initialRadius = 10
          const currentRadius = initialRadius * (1 - scrollProgress)
          videoRef.current.style.borderRadius = `${currentRadius}px`
          
          // Update header visibility
          const isVideoAt100Percent = widthPercent >= 100 && heightPercent >= 100
          if (isVideoAt100Percent) {
            document.body.setAttribute('data-video-full', 'true')
          } else {
            document.body.setAttribute('data-video-full', 'false')
          }
        }
      } catch (e) {
        // Ignore errors
      }
    }

    // Try to restore immediately
    if (videoRef.current && welcomeImageRef.current) {
      restoreVideoSize()
    } else {
      // Wait for refs to be ready
      const timer = setTimeout(() => {
        if (videoRef.current && welcomeImageRef.current) {
          restoreVideoSize()
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      if (!videoRef.current || !welcomeImageRef.current) return

      // Cancel previous animation frame
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const welcomeImage = welcomeImageRef.current
        const rect = welcomeImage.getBoundingClientRect()
        const windowHeight = window.innerHeight || window.visualViewport?.height || document.documentElement.clientHeight
        const windowWidth = window.innerWidth || document.documentElement.clientWidth
        const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop
        
        // Check if mobile (width <= 767px)
        const isMobile = windowWidth <= 767
        
        // Check if element is sticky (top of element is at or above viewport top)
        const isSticky = rect.top <= 0
        
        let scrollProgress = 0
        
        if (isSticky) {
          // Element is sticky - track when it first became sticky
          if (stickyStartScrollRef.current === null) {
            stickyStartScrollRef.current = currentScroll
          }
          
          // Calculate how much we've scrolled since becoming sticky
          const scrolledWhileSticky = currentScroll - stickyStartScrollRef.current
          // Progress over 100vh (windowHeight) of scroll - using 0.6x for faster animation
          const animationSpeed = 1.7 // Increase this value for faster animation
          scrollProgress = Math.min(Math.max((scrolledWhileSticky / windowHeight) * animationSpeed, 0), 1)
        } else {
          // Not sticky yet - reset
          stickyStartScrollRef.current = null
          scrollProgress = 0
        }

        // Calculate container (welcome_image) size
        // Container reaches 100% viewport size, video expands to 200% (2x) in the same time
        // Both use the same scrollProgress, so they're synchronized
        const containerWidth = welcomeImage.offsetWidth || welcomeImage.clientWidth || window.innerWidth
        const containerHeight = welcomeImage.offsetHeight || welcomeImage.clientHeight || windowHeight
        
        // Calculate video size: mobile starts from 214px, desktop from 360px
        // Video should expand to 200% (2x) of container size
        // Video expansion is synchronized with container reaching 100% viewport
        // When scrollProgress = 1, container is at 100% and video is at 200%
        const minSizePx = isMobile ? 214 : 360
        // Calculate starting percentage (214px or 360px as percentage of container)
        const minSizePercent = (minSizePx / containerWidth) * 100
        // Calculate current percentage: from minSizePercent to 200% (2x)
        // When scrollProgress = 1, video should be at 200%
        const maxSizePercent = 100 // Video expands to 200% (2x)
        const currentWidthPercent = minSizePercent + (maxSizePercent - minSizePercent) * scrollProgress
        
        // Calculate height: mobile and desktop both animate to 200%
        let currentHeightPercent
        if (isMobile) {
          // On mobile, calculate height from 214px to 200% of container height
          const minHeightPercent = (214 / containerHeight) * 100
          currentHeightPercent = minHeightPercent + (maxSizePercent - minHeightPercent) * scrollProgress
        } else {
          // Desktop: use same percentage as width, expand to 200%
          currentHeightPercent = minSizePercent + (maxSizePercent - minSizePercent) * scrollProgress
        }

        // Calculate border-radius: from 10px to 0px
        const initialRadius = 10
        const currentRadius = initialRadius * (1 - scrollProgress)

        // Calculate margin-top: starts only after video reaches 100%
        // Find scrollProgress when video reaches 100%
        let progressAt100Percent
        if (isMobile) {
          const minHeightPercent = (214 / containerHeight) * 100
          const progressAt100Width = (100 - minSizePercent) / (maxSizePercent - minSizePercent)
          const progressAt100Height = (100 - minHeightPercent) / (maxSizePercent - minHeightPercent)
          // Use maximum to ensure both width and height are at least 100%
          progressAt100Percent = Math.max(progressAt100Width, progressAt100Height)
        } else {
          progressAt100Percent = (100 - minSizePercent) / (maxSizePercent - minSizePercent)
        }
        
        // Margin-top only animates from 100% to 200% (from progressAt100Percent to 1)
        const maxMarginTop = 0 // Maximum margin-top in percentage
        let currentMarginTop = 0
        if (scrollProgress > progressAt100Percent) {
          // Normalize progress from progressAt100Percent to 1, into 0 to 1
          const marginProgress = (scrollProgress - progressAt100Percent) / (1 - progressAt100Percent)
          currentMarginTop = maxMarginTop * marginProgress
        }

        if (videoRef.current && welcomeImage) {
          // Use CSS custom properties for more reliable updates
          welcomeImage.style.setProperty('--video-width', `${currentWidthPercent}%`)
          welcomeImage.style.setProperty('--video-height', `${currentHeightPercent}%`)
          videoRef.current.style.width = `${currentWidthPercent}%`
          videoRef.current.style.height = `${currentHeightPercent}%`
          videoRef.current.style.borderRadius = `${currentRadius}px`
          // Set margin-top based on scroll progress, up to -16% when video reaches 200%
          videoRef.current.style.marginTop = `${currentMarginTop}%`
          
          // Save video size to localStorage (only if not restoring)
          if (!isRestoringRef.current) {
            try {
              localStorage.setItem('welcome-video-width', currentWidthPercent.toString())
              localStorage.setItem('welcome-video-height', currentHeightPercent.toString())
              localStorage.setItem('welcome-scroll-position', currentScroll.toString())
              localStorage.setItem('welcome-sticky-start', stickyStartScrollRef.current?.toString() || '')
            } catch (e) {
              // localStorage might not be available
              console.warn('Could not save to localStorage:', e)
            }
          }
          
          // Check if video reached 100% width and height - header should show at this point
          // When video is at 100% (not 200%), header becomes visible
          const isVideoAt100Percent = currentWidthPercent >= 100 && currentHeightPercent >= 100
          // Set data attribute on body to control header visibility
          if (isVideoAt100Percent) {
            document.body.setAttribute('data-video-full', 'true')
          } else {
            document.body.setAttribute('data-video-full', 'false')
          }
        }
      })
    }

    // Set initial size
    const setInitialSize = () => {
      if (videoRef.current && welcomeImageRef.current) {
        const windowWidth = window.innerWidth || document.documentElement.clientWidth
        const windowHeight = window.innerHeight || window.visualViewport?.height || document.documentElement.clientHeight
        const isMobile = windowWidth <= 767
        const containerWidth = welcomeImageRef.current.offsetWidth || welcomeImageRef.current.clientWidth || window.innerWidth
        const containerHeight = welcomeImageRef.current.offsetHeight || welcomeImageRef.current.clientHeight || windowHeight
        const minSizePx = isMobile ? 214 : 360
        const minSizePercent = (minSizePx / containerWidth) * 100
        videoRef.current.style.width = `${minSizePercent}%`
        // Calculate initial height: mobile starts from 214px as percentage, desktop uses same as width
        if (isMobile) {
          const minHeightPercent = (214 / containerHeight) * 100
          videoRef.current.style.height = `${minHeightPercent}%`
        } else {
          videoRef.current.style.height = `${minSizePercent}%`
        }
        videoRef.current.style.borderRadius = '10px'
        videoRef.current.style.marginTop = '0%' // Initial margin-top is 0%
      }
    }

    // Restore saved video size and scroll position
    const restoreSavedState = () => {
      try {
        const savedWidth = localStorage.getItem('welcome-video-width')
        const savedHeight = localStorage.getItem('welcome-video-height')
        const savedScroll = localStorage.getItem('welcome-scroll-position')
        const savedStickyStart = localStorage.getItem('welcome-sticky-start')

        if (savedWidth && savedHeight && videoRef.current && welcomeImageRef.current) {
          isRestoringRef.current = true
          
          // Restore video size immediately
          const widthPercent = parseFloat(savedWidth)
          const heightPercent = parseFloat(savedHeight)
          
          // Apply video size immediately
          videoRef.current.style.width = `${widthPercent}%`
          videoRef.current.style.height = `${heightPercent}%`
          
          // Calculate border-radius based on size
          const windowWidth = window.innerWidth || document.documentElement.clientWidth
          const isMobile = windowWidth <= 767
          const containerWidth = welcomeImageRef.current.offsetWidth || welcomeImageRef.current.clientWidth || window.innerWidth
          const minSizePx = isMobile ? 214 : 360
          const minSizePercent = (minSizePx / containerWidth) * 100
          const maxSizePercent = 100
          const scrollProgress = Math.max(0, Math.min(1, (widthPercent - minSizePercent) / (maxSizePercent - minSizePercent)))
          const initialRadius = 10
          const currentRadius = initialRadius * (1 - scrollProgress)
          videoRef.current.style.borderRadius = `${currentRadius}px`
          
          // Restore margin-top
          const windowHeight = window.innerHeight || window.visualViewport?.height || document.documentElement.clientHeight
          let progressAt100Percent
          if (isMobile) {
            const containerHeight = welcomeImageRef.current.offsetHeight || welcomeImageRef.current.clientHeight || windowHeight
            const minHeightPercent = (214 / containerHeight) * 100
            const progressAt100Width = (100 - minSizePercent) / (maxSizePercent - minSizePercent)
            const progressAt100Height = (100 - minHeightPercent) / (maxSizePercent - minHeightPercent)
            progressAt100Percent = Math.max(progressAt100Width, progressAt100Height)
          } else {
            progressAt100Percent = (100 - minSizePercent) / (maxSizePercent - minSizePercent)
          }
          
          let currentMarginTop = 0
          if (scrollProgress > progressAt100Percent) {
            const marginProgress = (scrollProgress - progressAt100Percent) / (1 - progressAt100Percent)
            currentMarginTop = 0 * marginProgress
          }
          videoRef.current.style.marginTop = `${currentMarginTop}%`
          
          // Update header visibility immediately
          const isVideoAt100Percent = widthPercent >= 100 && heightPercent >= 100
          if (isVideoAt100Percent) {
            document.body.setAttribute('data-video-full', 'true')
          } else {
            document.body.setAttribute('data-video-full', 'false')
          }
          
          // Restore scroll position and sticky start - wait for page to be fully loaded
          if (savedScroll) {
            const scrollPosition = parseFloat(savedScroll)
            if (savedStickyStart) {
              stickyStartScrollRef.current = parseFloat(savedStickyStart)
            }
            
            // Wait for page to be fully loaded before restoring scroll
            const restoreScroll = () => {
              if (document.readyState === 'complete') {
                // Multiple attempts to ensure scroll is restored
                window.scrollTo(0, scrollPosition)
                requestAnimationFrame(() => {
                  window.scrollTo(0, scrollPosition)
                  requestAnimationFrame(() => {
                    window.scrollTo(0, scrollPosition)
                    handleScroll()
                    isRestoringRef.current = false
                  })
                })
              } else {
                // If page not fully loaded, wait and try again
                setTimeout(restoreScroll, 50)
              }
            }
            
            // Start restoration after a short delay
            setTimeout(restoreScroll, 100)
          } else {
            isRestoringRef.current = false
          }
          
          return true
        }
      } catch (e) {
        console.warn('Could not restore from localStorage:', e)
        isRestoringRef.current = false
      }
      return false
    }

    // Set initial state - video is not full size initially
    document.body.setAttribute('data-video-full', 'false')

    // Try to restore immediately if data exists
    const tryRestore = () => {
      if (videoRef.current && welcomeImageRef.current) {
        const restored = restoreSavedState()
        if (!restored) {
          setInitialSize()
        }
        handleScroll()
      } else {
        // If refs not ready, try again
        requestAnimationFrame(tryRestore)
      }
    }

    // Start restoration as soon as possible
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(tryRestore)
      })
    } else {
      requestAnimationFrame(tryRestore)
    }

    // Save state before page unload
    const saveStateBeforeUnload = () => {
      if (videoRef.current && !isRestoringRef.current) {
        try {
          const currentWidth = videoRef.current.style.width
          const currentHeight = videoRef.current.style.height
          const currentScroll = window.pageYOffset || window.scrollY || document.documentElement.scrollTop
          
          if (currentWidth && currentHeight) {
            const widthPercent = parseFloat(currentWidth)
            const heightPercent = parseFloat(currentHeight)
            localStorage.setItem('welcome-video-width', widthPercent.toString())
            localStorage.setItem('welcome-video-height', heightPercent.toString())
            localStorage.setItem('welcome-scroll-position', currentScroll.toString())
            localStorage.setItem('welcome-sticky-start', stickyStartScrollRef.current?.toString() || '')
          }
        } catch (e) {
          // Ignore errors on unload
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    window.addEventListener('beforeunload', saveStateBeforeUnload)
    window.addEventListener('pagehide', saveStateBeforeUnload)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('beforeunload', saveStateBeforeUnload)
      window.removeEventListener('pagehide', saveStateBeforeUnload)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return(
    <>
      <div className="welcome_image" id="welcome" ref={welcomeImageRef}>
        {/* <Image src={welcomeImage} alt="welcome" /> */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto" 
        >
          {/* <source src="/assets/videos/blue-flower.mp4" type="video/mp4" />  */}
          <source src="https://streamable.com/l/ejv9h1/mp4.mp4"  type="video/mp4" /> 
        </video>
      </div>
      <div className="welcome_wrapper_height"></div>
      <div className="welcome_wrapper">
        <div className="container">
          <Image src={bigLogo} alt="biglogo" />
          <h2>Welcome</h2>
          <h4>EVVR Capital is the Private Investment Office of the Australian based Powell Family, founded on the belief that every investment carries a responsibility to grow, protect and create something lasting.</h4>
        </div>
      </div>
      <OurStory/>
    </>
  )
}