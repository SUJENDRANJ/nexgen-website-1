import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "./menu.css";
import { TiLocationArrow } from "react-icons/ti";
import clsx from "clsx";

const menuLinks = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/lab", label: "Lab" },
];

const Menu = () => {
  const container = useRef(null);
  const tl = useRef(null);
  const audioRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const toggleAudio = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useGSAP(
    () => {
      gsap.set(".menu-link-item-holder", { y: 75 });

      tl.current = gsap
        .timeline({ paused: true })
        .to(".menu-overlay", {
          duration: 1.25,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          ease: "power4.inOut",
        })
        .to(
          ".menu-link-item-holder",
          {
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.inOut",
            delay: -0.75,
          },
          "<"
        );
    },
    { scope: container }
  );

  useEffect(() => {
    if (isMenuOpen) {
      tl.current?.play(0);
      document.body.style.overflow = "hidden";
    } else {
      tl.current?.reverse();
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (isAudioPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isAudioPlaying]);

  return (
    <div className="menu-container" ref={container}>
      {/* Top Bar */}
      <div className="menu-bar">
        <div className="menu-logo">
          <Link to="/">Nexgen Nextopia</Link>
        </div>
        <div className="menu-open" onClick={toggleMenu}>
          <p className="text-white no-underline uppercase text-sm font-medium leading-none">
            Menu
          </p>
        </div>
      </div>

      {/* Overlay Menu */}
      <div className={`menu-overlay ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-overlay-bar">
          {/* Left - Logo and Products */}
          <div className="menu-logo flex items-center gap-4">
            <Link to="/" className="uppercase font-semibold">
              Nexgen Nextopia
            </Link>
            <button className="flex items-center gap-1 px-3 py-1 bg-black text-white text-xs rounded">
              Our Works
              <TiLocationArrow size={12} />
            </button>
          </div>

          {/* Right - Audio */}
          <div className="flex items-center gap-2">
            <audio
              ref={audioRef}
              className="hidden"
              src="/audio/loop.mp3"
              loop
            />
            <button
              onClick={toggleAudio}
              className="ml-4 flex items-end justify-center gap-[3px] px-2 py-1 hover:scale-105 transition-transform"
              aria-label="Toggle audio"
            >
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx(
                    "w-[4px] rounded-sm bg-black transition-all duration-300",
                    { "animate-ping-bar": isIndicatorActive }
                  )}
                  style={{
                    height: isIndicatorActive ? "20px" : "6px",
                    animationDelay: `${bar * 0.1}s`,
                    animationDuration: "1s",
                    animationIterationCount: "infinite",
                    animationTimingFunction: "ease-in-out",
                  }}
                />
              ))}
            </button>

            <div className="menu-close" onClick={toggleMenu}>
              <p className="uppercase text-sm font-medium leading-none">
                Close
              </p>
            </div>
          </div>
        </div>

        {/* Giant Close X */}
        <div className="menu-close-icon" onClick={toggleMenu}>
          <p>&#x2715;</p>
        </div>

        {/* Main Content */}
        <div className="menu-copy">
          <div className="menu-links">
            {menuLinks.map((link) => (
              <div className="menu-link-item" key={link.label}>
                <div className="menu-link-item-holder" onClick={toggleMenu}>
                  <Link to={link.path} className="menu-link">
                    {link.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="menu-info">
            <div className="menu-info-col">
              <a href="#">Instagram &#8599;</a>
              <a href="#">LinkedIn &#8599;</a>
              <a href="#">Youtube &#8599;</a>
              <a href="#">X &#8599;</a>
            </div>
            <div className="menu-info-col">
              <p className="uppercase text-sm font-medium leading-none">
                nexgen@nextopia.com
              </p>
              <p className="uppercase text-sm font-medium leading-none">
                +91 92345 67890
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
