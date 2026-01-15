"use client"
import React, { useState, useEffect, useRef } from "react"
import "./ourValue.scss"

export default function OurValue() {
  const wrapperRef = useRef(null)
  const h2Ref = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isH2Visible, setIsH2Visible] = useState(false)
  const textLines = [
    "Honour the legacy that shaped us ",
    "by investing in the future we ",
    "believe in."
  ]
  const text = textLines.join(' ')

  // Intersection Observer to detect when h2 becomes visible
  useEffect(() => {
    if (!h2Ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsH2Visible(true)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of h2 is visible
        rootMargin: '10px 0px 0px 0px' // Trigger 10px before h2 becomes visible
      }
    )

    observer.observe(h2Ref.current)

    return () => {
      if (h2Ref.current) {
        observer.unobserve(h2Ref.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Only calculate progress if h2 is visible
      if (!isH2Visible || !h2Ref.current) {
        if (!isH2Visible) {
          setScrollProgress(0)
        }
        return
      }

      const element = h2Ref.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate scroll progress based on h2 position
      const h2Top = rect.top
      const h2Height = rect.height
      
      // Animation starts 10px before h2 becomes visible
      const animationStart = windowHeight - 200
      
      // Animation completes when h2 center is at viewport center
      const viewportCenter = windowHeight / 2
      const h2Center = h2Top + h2Height / 2
      const animationEnd = viewportCenter - h2Height / 1
      
      const animationRange = animationStart - animationEnd
      
      let progress = 0
      
      if (h2Top <= animationStart && h2Top >= animationEnd) {
        // Calculate progress from 0 to 1
        progress = Math.max(0, Math.min(1, (animationStart - h2Top) / animationRange))
      } else if (h2Top < animationEnd) {
        progress = 1
      }
      
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isH2Visible])

  const totalLetters = text.replace(/\s/g, '').length // Total letters excluding spaces

  // Calculate cumulative letter count up to a specific position
  const getLetterCountUpToPosition = (lineIndex, wordIndexInLine) => {
    let count = 0
    // Add letters from all previous lines
    for (let i = 0; i < lineIndex; i++) {
      count += textLines[i].replace(/\s/g, '').length
    }
    // Add letters from words before current word in current line
    const currentLineWords = textLines[lineIndex].split(' ')
    for (let i = 0; i < wordIndexInLine; i++) {
      count += currentLineWords[i].length
    }
    return count
  }

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

  return(
    <>
      <div className="our_value_wrapper" id="values" ref={wrapperRef}>
        <div className="container">
          <h2 ref={h2Ref}>
            {textLines.map((line, lineIndex) => {
              const lineWords = line.split(' ')
              
              return (
                <React.Fragment key={lineIndex}>
                  {lineWords.map((word, wordIndex) => {
                    const letters = word.split('')
                    const lettersBeforeThisWord = getLetterCountUpToPosition(lineIndex, wordIndex)
                    
                    const wordSpans = letters.map((letter, letterIndex) => {
                      const globalLetterIndex = lettersBeforeThisWord + letterIndex
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
                      <span key={`${lineIndex}-${wordIndex}`} className="word">
                        {wordSpans}
                        {wordIndex < lineWords.length - 1 && '\u00A0'}
                      </span>
                    )
                  })}
                  {lineIndex < textLines.length - 1 && <br />}
                </React.Fragment>
              )
            })}
          </h2>
        </div>
      </div>
    </>
  )
}