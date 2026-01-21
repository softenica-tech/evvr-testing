"use client"
import { useEffect, useRef } from "react"
import "./welcome.scss"
import Image from "next/image"
import bigLogo from "../../../public/assets/images/big_logo.svg"
import OurStory from "../our-story/OurStory"

export default function Welcome() {
  const videoRef = useRef(null)
  const welcomeImageRef = useRef(null)
  const stickyStartScrollRef = useRef(null)
  const lastScrollProgressRef = useRef(0)
  const isRestoringRef = useRef(false)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1.25
  }, [])

  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      if (!videoRef.current || !welcomeImageRef.current) return
      if (rafId) cancelAnimationFrame(rafId)

      rafId = requestAnimationFrame(() => {
        const welcomeImage = welcomeImageRef.current
        const rect = welcomeImage.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const windowWidth = window.innerWidth
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop

        const isMobile = windowWidth <= 767
        const isSticky = rect.top <= 0

        let scrollProgress = lastScrollProgressRef.current

        if (isSticky) {
          if (stickyStartScrollRef.current === null) stickyStartScrollRef.current = currentScroll
          const scrolledWhileSticky = currentScroll - stickyStartScrollRef.current
          scrollProgress = Math.min(Math.max((scrolledWhileSticky / windowHeight) * 1.7, 0), 1)
        }

        lastScrollProgressRef.current = scrollProgress

        const containerWidth = welcomeImage.offsetWidth
        const containerHeight = welcomeImage.offsetHeight
        const minSizePx = isMobile ? 214 : 360
        const minSizePercent = (minSizePx / containerWidth) * 100
        const maxSizePercent = 100
        const currentWidthPercent = minSizePercent + (maxSizePercent - minSizePercent) * scrollProgress

        let currentHeightPercent
        if (isMobile) {
          const minHeightPercent = (214 / containerHeight) * 100
          currentHeightPercent = minHeightPercent + (maxSizePercent - minHeightPercent) * scrollProgress
        } else {
          currentHeightPercent = minSizePercent + (maxSizePercent - minSizePercent) * scrollProgress
        }

        const currentRadius = 10 * (1 - scrollProgress)

        let progressAt100Percent
        if (isMobile) {
          const minHeightPercent = (214 / containerHeight) * 100
          const progressAt100Width = (100 - minSizePercent) / (maxSizePercent - minSizePercent)
          const progressAt100Height = (100 - minHeightPercent) / (maxSizePercent - minSizePercent)
          progressAt100Percent = Math.max(progressAt100Width, progressAt100Height)
        } else {
          progressAt100Percent = (100 - minSizePercent) / (maxSizePercent - minSizePercent)
        }

        const maxMarginTop = 0
        let currentMarginTop = 0
        if (scrollProgress > progressAt100Percent) {
          const marginProgress = (scrollProgress - progressAt100Percent) / (1 - progressAt100Percent)
          currentMarginTop = maxMarginTop * marginProgress
        }

        welcomeImage.style.setProperty("--video-width", `${currentWidthPercent}%`)
        welcomeImage.style.setProperty("--video-height", `${currentHeightPercent}%`)
        videoRef.current.style.width = `${currentWidthPercent}%`
        videoRef.current.style.height = `${currentHeightPercent}%`
        videoRef.current.style.borderRadius = `${currentRadius}px`
        videoRef.current.style.marginTop = `${currentMarginTop}%`

        if (!isRestoringRef.current) {
          try {
            localStorage.setItem("welcome-video-width", currentWidthPercent.toString())
            localStorage.setItem("welcome-video-height", currentHeightPercent.toString())
            localStorage.setItem("welcome-scroll-position", currentScroll.toString())
            localStorage.setItem("welcome-sticky-start", stickyStartScrollRef.current?.toString() || "")
          } catch (e) {}
        }

        const isVideoAt100Percent = currentWidthPercent >= 100 && currentHeightPercent >= 100
        document.body.setAttribute("data-video-full", isVideoAt100Percent ? "true" : "false")
      })
    }

    // Only scroll listener: **disable resize/zoom handling**
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial call
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div className="welcome_image" id="welcome" ref={welcomeImageRef}>
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto">
          <source src="https://streamable.com/l/ejv9h1/mp4.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="welcome_wrapper_height"></div>
      <div className="welcome_wrapper">
        <div className="container">
          <Image src={bigLogo} alt="biglogo" />
          <h2>Welcome</h2>
          <h4>
            EVVR Capital is the Private Investment Office of the Australian based Powell Family, founded on the belief
            that every investment carries a responsibility to grow, protect and create something lasting.
          </h4>
        </div>
      </div>
      <OurStory />
    </>
  )
}
