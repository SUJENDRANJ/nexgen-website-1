import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
// import SplitText from "gsap/SplitText"; // Only if using GSAP premium
import collection from "./collection";
import Card from "../../components/UserCard"; // Your styled card component
import "./style.css";

const Gallery3D = () => {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const cardRefs = useRef([]);

  const [showCardPopup, setShowCardPopup] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState(null);

  const isPreviewActive = useRef(false);
  const isTransitioning = useRef(false);
  const currentTitle = useRef(null);
  const currentPreview = useRef(null);

  const config = {
    imageCount: 25,
    radius: 275,
    lerpFactor: 0.15,
    isMobile: window.innerWidth < 1000,
  };

  const parallaxState = useRef({
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    currentX: 0,
    currentY: 0,
    currentZ: 0,
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousemove", handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCardClick = (i) => {
    if (
      isPreviewActive.current &&
      !isTransitioning.current &&
      currentPreview.current === i
    ) {
      setSelectedCardData(collection[i % collection.length]);
      setShowCardPopup(true);
      return;
    }

    isPreviewActive.current = true;
    isTransitioning.current = true;
    currentPreview.current = i;

    const angle = (i / config.imageCount) * Math.PI * 2;
    const targetPosition = (Math.PI * 3) / 2;
    let rotationRadians = targetPosition - angle;
    if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
    else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

    gsap.to(galleryRef.current, {
      scale: 5,
      y: 1300,
      rotation: (rotationRadians * 180) / Math.PI + 360,
      duration: 2,
      ease: "power4.inOut",
      onComplete: () => (isTransitioning.current = false),
    });

    const p = document.createElement("p");
    p.textContent = collection[i % collection.length].title;
    titleContainerRef.current.innerHTML = "";
    titleContainerRef.current.appendChild(p);
    currentTitle.current = p;

    // OPTIONAL: animate words if SplitText is available
    /*
    const split = new SplitText(p, { type: "words", wordsClass: "words" });
    gsap.set(split.words, { y: "125%" });
    gsap.to(split.words, {
      y: "0%",
      duration: 0.75,
      stagger: 0.1,
      ease: "power4.out",
    });
    */
  };

  const handleReset = () => {
    if (!isPreviewActive.current || isTransitioning.current) return;

    isTransitioning.current = true;

    gsap.to(galleryRef.current, {
      scale: 1,
      y: 0,
      x: 0,
      rotation: 0,
      duration: 2.5,
      ease: "power4.inOut",
      onComplete: () => {
        isPreviewActive.current = false;
        isTransitioning.current = false;
        currentPreview.current = null;
      },
    });

    if (currentTitle.current) {
      currentTitle.current.remove();
      currentTitle.current = null;
    }

    setSelectedCardData(null);
    setShowCardPopup(false);
  };

  const handleResize = () => {
    config.isMobile = window.innerWidth < 1000;
    let scale = 1;
    if (window.innerWidth < 768) scale = 0.6;
    else if (window.innerWidth < 1200) scale = 0.8;
    gsap.set(galleryRef.current, { scale });
  };

  const handleMouseMove = (e) => {
    if (isPreviewActive.current || isTransitioning.current || config.isMobile)
      return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const percentX = (e.clientX - centerX) / centerX;
    const percentY = (e.clientY - centerY) / centerY;

    parallaxState.current.targetY = percentX * 15;
    parallaxState.current.targetX = percentY * 15;
    parallaxState.current.targetZ = (percentX - percentY) * 5;
  };

  const animate = () => {
    const ps = parallaxState.current;
    if (!isPreviewActive.current && !isTransitioning.current) {
      ps.currentX += (ps.targetX - ps.currentX) * config.lerpFactor;
      ps.currentY += (ps.targetY - ps.currentY) * config.lerpFactor;
      ps.currentZ += (ps.targetZ - ps.currentZ) * config.lerpFactor;

      gsap.set(containerRef.current, {
        rotateX: ps.currentX,
        rotateY: ps.currentY,
        rotateZ: ps.currentZ,
      });
    }

    requestAnimationFrame(animate);
  };

  return (
    <div className="container" onClick={handleReset}>
      <div className="gallery-container" ref={containerRef}>
        <div className="gallery" ref={galleryRef}>
          {Array.from({ length: config.imageCount }).map((_, i) => {
            const item = collection[i % collection.length];
            const angle = (i / config.imageCount) * Math.PI * 2;
            const x = config.radius * Math.cos(angle);
            const y = config.radius * Math.sin(angle);

            return (
              <div
                key={i}
                className="card"
                style={{
                  transform: `translate(${x}px, ${y}px) rotate(${
                    (angle * 180) / Math.PI + 90
                  }deg)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(i);
                }}
              >
                <img src={item.img} alt={item.title} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="title-container" ref={titleContainerRef}></div>

      {showCardPopup && selectedCardData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          onClick={() => setShowCardPopup(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card
              name={selectedCardData.title}
              aboutMe={selectedCardData.aboutMe || "No bio available."}
              aboutLink={selectedCardData.link || "#"}
              socialLinks={selectedCardData.socials || []}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery3D;
