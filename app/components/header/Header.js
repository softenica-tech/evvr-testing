"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/assets/images/logo.svg";
import "./header.scss";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Start hidden; reveal only after user scrolls 200px
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Map nav links to section IDs
  const navLinks = [
    { href: '#story', label: 'STORY' },
    { href: '#philosophy', label: 'PHILOSOPHY' },
    { href: '#investment', label: 'INVESTMENT' },
    { href: '#values', label: 'VALUES' },
    { href: '#footer', label: 'CONTACT' }
  ];

  const handleNavClick = (e, href) => {
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled more than 100px for background color
      setIsScrolled(currentScrollY > 100);

      // Start hidden at top; only enable show/hide behavior after 200px scroll
      if (currentScrollY < 200) {
        setIsVisible(false);
      } else {
        // Show/hide header based on scroll direction (same behavior as before, just gated by 200px)
        if (currentScrollY < lastScrollY) {
          // Scrolling up - show header
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
          // Scrolling down and past 200px - hide header
          setIsVisible(false);
        }
      }

      // Active section detection (priority-based; works even with overlapping sections)
      // "Trigger line" is 150px from top of viewport (same mental model as your earlier logic)
      const triggerLine = 150;
      const idsInPriority = ['story', 'philosophy', 'investment', 'values', 'footer'];
      let current = "";

      for (const id of idsInPriority) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        // Section is "active" if it covers the trigger line
        // (top is above trigger, bottom is below trigger)
        if (rect.top <= triggerLine && rect.bottom > triggerLine) {
          current = id;
          break;
        }
      }

      // Remove active class when none matches
      setActiveSection(current);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // initialize on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`header_wrapper ${activeSection ? `section-${activeSection}` : ""} ${isMenuOpen ? 'menu-open' : ''} ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}
    >
      <div className="container flex justify-between">
        <a className="logo" href="#banner" style={{ cursor: 'pointer' }}>
          <Image src={logo} alt="logo" />
        </a>
        <button 
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`menu ml-auto ${isMenuOpen ? 'active' : ''}`}>
          <ul className="list-none flex gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={activeSection === link.href.slice(1) ? "active" : ""}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
