"use client"
import { useState, useEffect, useRef } from "react"
import "./ourPhilosophy.scss"
import Image from "next/image"
import philosophyImage from "../../../public/assets/images/philo.jpg"

export default function OurPhilosophy() {
  const wrapperRef = useRef(null)
  const h1Ref = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isH1Visible, setIsH1Visible] = useState(false)

  // Intersection Observer to detect when h1 becomes visible
  useEffect(() => {
    if (!h1Ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsH1Visible(true)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of h1 is visible
        rootMargin: '10px 0px 0px 0px' // Trigger 10px before h1 becomes visible
      }
    )

    observer.observe(h1Ref.current)

    return () => {
      if (h1Ref.current) {
        observer.unobserve(h1Ref.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Only calculate progress if h1 is visible
      if (!isH1Visible || !h1Ref.current) {
        if (!isH1Visible) {
          setScrollProgress(0)
        }
        return
      }

      const element = h1Ref.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate scroll progress based on h1 position
      const h1Top = rect.top
      const h1Height = rect.height
      
      // Animation starts 10px before h1 becomes visible
      const animationStart = windowHeight - 200
      
      // Animation completes when h1 center is at viewport center
      const viewportCenter = windowHeight / 2
      const h1Center = h1Top + h1Height / 2
      const animationEnd = viewportCenter - h1Height / 1
      
      const animationRange = animationStart - animationEnd
      
      let progress = 0
      
      if (h1Top <= animationStart && h1Top >= animationEnd) {
        // Calculate progress from 0 to 1
        progress = Math.max(0, Math.min(1, (animationStart - h1Top) / animationRange))
      } else if (h1Top < animationEnd) {
        progress = 1
      }
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isH1Visible])

  // Split text into lines for rendering with <br/> tags
  const lines = [
    "Many imagine. ",
    "Few execute. ",
    "Even fewer ",
    "build to last."
  ]

  // Calculate total letters across all lines (excluding spaces)
  const totalLetters = lines.join(' ').replace(/\s/g, '').length

  const getLetterColor = (globalLetterIndex) => {
    // Calculate which letters should be fully colored based on scroll progress
    const lettersToColor = scrollProgress * totalLetters
    
    // Each letter gets colored when scroll progress reaches its position
    // Start with #fff (white) and transition to #000 (black)
    if (globalLetterIndex <= lettersToColor) {
      // Calculate smooth transition for the current letter
      const letterProgress = Math.max(0, Math.min(1, (lettersToColor - globalLetterIndex) / 1))
      // Transition from white (255) to black (0)
      const rgbValue = Math.round(255 - (letterProgress * 255))
      return `rgb(${rgbValue}, ${rgbValue}, ${rgbValue})`
    } else {
      return '#fff' // Start with white
    }
  }

  // Calculate letter count up to each line
  const getLetterCountUpToLine = (lineIndex) => {
    let count = 0
    for (let i = 0; i < lineIndex; i++) {
      count += lines[i].replace(/\s/g, '').length
    }
    return count
  }

  return(
    <>
      <div className="our_philosophy_wrapper" id="philosophy" ref={wrapperRef}>
        <div className="container">
          <h2>Our philosophy</h2>
          <h1 ref={h1Ref}>
            {lines.map((line, lineIndex) => {
              const lineStartIndex = getLetterCountUpToLine(lineIndex)
              const lineWords = line.split(' ')
              
              // Calculate letter count up to each word in this line
              const getLetterCountUpToWordInLine = (wordIndex) => {
                let count = 0
                for (let i = 0; i < wordIndex; i++) {
                  count += lineWords[i].length
                }
                return count
              }
              
              return (
                <span key={lineIndex}>
                  {lineWords.map((word, wordIndex) => {
                    const letters = word.split('')
                    const lettersBeforeThisWord = getLetterCountUpToWordInLine(wordIndex)
                    
                    const wordSpans = letters.map((letter, letterIndex) => {
                      const globalLetterIndex = lineStartIndex + lettersBeforeThisWord + letterIndex
                      return (
                        <span 
                          key={`${lineIndex}-${wordIndex}-${letterIndex}`}
                          style={{ color: getLetterColor(globalLetterIndex) }}
                        >
                          {letter}
                        </span>
                      )
                    })
                    
                    return (
                      <span key={wordIndex} className="word">
                        {wordSpans}
                        {wordIndex < lineWords.length - 1 && '\u00A0'}
                      </span>
                    )
                  })}
                  {lineIndex < lines.length - 1 && <br/>}
                </span>
              )
            })}
          </h1>
          <div className="our_philosophy_inner">
            <h4>We back the builders who dream the extraordinary, create with vision and lead with conviction. They turn ambition into action and forge lasting legacies.</h4>
            <h4>We know what it takes because we have done it ourselves, building, scaling and leading businesses through decades of growth and proven success.</h4>
            {/* <Image src={philosophyImage} alt="philo_image"/> */}
          </div>
        </div>
      </div>
    </>
  )
}