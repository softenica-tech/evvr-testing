"use client"
import { useEffect, useRef } from "react"
import "./ethos.scss"
import OurValue from "../our-value/OurValue"

export default function Ethos() {
  const videoRef = useRef(null)
  const ethosImageRef = useRef(null)
  const stickyStartScrollRef = useRef(null)
  const lastScrollProgressRef = useRef(0)
  const investmentListRef = useRef(null)
  const investmentListItemsRef = useRef([])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1.25
  }, [])

  useEffect(() => {
    let rafId = null

    const updateVideoByScroll = () => {
      if (!videoRef.current || !ethosImageRef.current) return

      const ethosImage = ethosImageRef.current
      const rect = ethosImage.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop

      const isSticky = rect.top <= 0
      let scrollProgress = lastScrollProgressRef.current

      if (isSticky) {
        if (stickyStartScrollRef.current === null) stickyStartScrollRef.current = currentScroll
        const scrolledWhileSticky = currentScroll - stickyStartScrollRef.current
        scrollProgress = Math.min(Math.max((scrolledWhileSticky / windowHeight) * 1.7, 0), 1)
      }

      lastScrollProgressRef.current = scrollProgress

      // Sizes
      const containerWidth = ethosImage.offsetWidth
      const containerHeight = ethosImage.offsetHeight
      const minSizePx = window.innerWidth <= 767 ? 214 : 360
      const minSizePercent = (minSizePx / containerWidth) * 100
      const maxSizePercent = 100

      const currentWidthPercent = minSizePercent + (maxSizePercent - minSizePercent) * scrollProgress
      const currentHeightPercent =
        window.innerWidth <= 767
          ? (214 / containerHeight) * 100 + (maxSizePercent - (214 / containerHeight) * 100) * scrollProgress
          : minSizePercent + (maxSizePercent - minSizePercent) * scrollProgress

      const currentRadius = 10 * (1 - scrollProgress)

      videoRef.current.style.width = `${currentWidthPercent}%`
      videoRef.current.style.height = `${currentHeightPercent}%`
      videoRef.current.style.borderRadius = `${currentRadius}px`
      ethosImage.style.setProperty("--video-width", `${currentWidthPercent}%`)
      ethosImage.style.setProperty("--video-height", `${currentHeightPercent}%`)
    }

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateVideoByScroll)
    }

    // Only scroll listener, no resize/zoom listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initial call
    updateVideoByScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Investment list animation (same as before)
  useEffect(() => {
    let listRafId = null
    const handleListScroll = () => {
      if (!investmentListRef.current) return
      if (listRafId) cancelAnimationFrame(listRafId)
      listRafId = requestAnimationFrame(() => {
        const listRect = investmentListRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const isInView = listRect.top < windowHeight && listRect.bottom > 0
        const validItems = investmentListItemsRef.current.filter(item => item)
        if (!validItems.length) return

        if (isInView) {
          const listTop = listRect.top
          const listBottom = listRect.bottom
          const viewportCenter = windowHeight / 2
          const sectionCenter = (listTop + listBottom) / 2
          const distanceFromCenter = viewportCenter - sectionCenter
          const scrollRange = windowHeight * 1.5
          let listScrollProgress = 0.5 + distanceFromCenter / scrollRange
          listScrollProgress = Math.min(Math.max(listScrollProgress, 0), 1)

          validItems.forEach((item, index) => {
            let translateY = 0
            if (index === 0) translateY = listScrollProgress * 150
            else if (index === 1) translateY = -listScrollProgress * 150
            else if (index === 2) translateY = -listScrollProgress * 225
            item.style.transform = `translateY(${translateY}px)`
          })
        } else {
          validItems.forEach(item => (item.style.transform = "translateY(0px)"))
        }
      })
    }

    const handleScroll = () => handleListScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (listRafId) cancelAnimationFrame(listRafId)
    }
  }, [])

  const investmentPrinciples = [
    { title: "Invest with Conviction", description: "Our process is deliberate and disciplined..." },
    { title: "Partner with Excellence", description: "We invest in high quality, innovative opportunities..." },
    { title: "Unconstrained Global Reach", description: "⁠We employ an agnostic and unrestricted investment strategy..." }
  ]

  return (
    <div className="ethos_wrapper_main">
      <div className="ethos_image" id="investment_image" ref={ethosImageRef}>
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto">
          <source src="https://streamable.com/l/an62gf/mp4.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="ethos_wrapper_height"></div>
      <div className="ethos_wrapper" id="investment" ref={investmentListRef}>
        <div className="container">
          <div className="ethos_section">
            <section>
              <h2>Our ethos</h2>
              <h3>A Family Venture with Purpose</h3>
            </section>
            <h4>We preserve and grow our family's capital across generations...</h4>
          </div>
          <div className="ethos_content_wrapper">
            <h2>Our Investment principles</h2>
            <ul className="list-none">
              {investmentPrinciples.map((principle, index) => (
                <li key={index} ref={el => (investmentListItemsRef.current[index] = el)}>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <OurValue />
    </div>
  )
}
