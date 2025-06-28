// src/components/Gallery3D.jsx
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import collection from "./collection";
import "./gallery.css"; // <-- Add this CSS file for styling

function customSplitText(element, className = "words") {
  const text = element.textContent;
  element.textContent = "";
  const words = text.split(" ").map((word) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.classList.add(className);
    element.appendChild(span);
    return span;
  });
  return words;
}

const Gallery3D = () => {
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cards = useRef([]);
  const transformState = useRef([]);

  const config = useRef({
    imageCount: 25,
    radius: 275,
    sensitivity: 500,
    effectFalloff: 250,
    cardMoveAmount: 50,
    lerpFacter: 0.15,
    isMobile: window.innerWidth < 1000,
  }).current;

  const parallexState = useRef({
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    currentX: 0,
    currentY: 0,
    currentZ: 0,
  }).current;

  const state = useRef({
    isPreviewActive: false,
    isTransitioning: false,
    currentTitle: null,
  });

  useEffect(() => {
    const gallery = galleryRef.current;
    for (let i = 0; i < config.imageCount; i++) {
      const angle = (i / config.imageCount) * Math.PI * 2;
      const x = config.radius * Math.cos(angle * i);
      const y = config.radius * Math.sin(angle * i);
      const cardIndex = i % collection.length;

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.index = i;
      card.dataset.title = collection[cardIndex].title;

      const img = document.createElement("img");
      img.src = collection[cardIndex].img;
      card.appendChild(img);

      gsap.set(card, {
        x,
        y,
        rotation: (angle * 180) / Math.PI + 90,
        transformPerspective: 800,
        transformOrigin: "center center",
      });

      card.addEventListener("click", (e) => {
        if (!state.current.isPreviewActive && !state.current.isTransitioning) {
          togglePreview(parseInt(card.dataset.index));
          e.stopPropagation();
        }
      });

      gallery.appendChild(card);
      cards.current.push(card);
      transformState.current.push({
        currentRotation: 0,
        targetRotation: 0,
        currentX: 0,
        targetX: 0,
        currentY: 0,
        targetY: 0,
        currentScale: 1,
        targetScale: 1,
        angle,
      });
    }

    const togglePreview = (index) => {
      state.current.isPreviewActive = true;
      state.current.isTransitioning = true;
      const angle = transformState.current[index].angle;
      const targetPosition = (Math.PI * 3) / 2;
      let rotationRadians = targetPosition - angle;
      if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
      else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

      transformState.current.forEach((s) => {
        s.currentRotation = s.targetRotation = 0;
        s.currentScale = s.targetScale = 1;
        s.currentX = s.targetX = s.currentY = s.targetY = 0;
      });

      gsap.to(gallery, {
        onStart: () => {
          cards.current.forEach((card, i) => {
            gsap.to(card, {
              x: config.radius * Math.cos(transformState.current[i].angle),
              y: config.radius * Math.sin(transformState.current[i].angle),
              rotationY: 0,
              scale: 1,
              duration: 1.25,
              ease: "power4.out",
            });
          });
        },
        scale: 5,
        y: 1300,
        rotation: (rotationRadians * 180) / Math.PI + 368,
        duration: 2,
        ease: "power4.inOut",
        onComplete: () => (state.current.isTransitioning = false),
      });

      gsap.to(parallexState, {
        currentX: 0,
        currentY: 0,
        currentZ: 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          gsap.set(containerRef.current, {
            rotateX: parallexState.currentX,
            rotateY: parallexState.currentY,
            rotateZ: parallexState.currentZ,
            transformOrigin: "center center",
          });
        },
      });

      const titleText = cards.current[index].dataset.title;
      const p = document.createElement("p");
      p.textContent = titleText;
      titleRef.current.appendChild(p);
      state.current.currentTitle = p;

      const words = customSplitText(p, "words");
      gsap.set(words, { y: "125%" });
      gsap.to(words, {
        y: "0%",
        duration: 0.75,
        delay: 1.25,
        stagger: 0.1,
        ease: "power4.out",
      });
    };

    const resetGallery = () => {
      if (state.current.isTransitioning) return;
      state.current.isTransitioning = true;

      if (state.current.currentTitle) {
        const words = state.current.currentTitle.querySelectorAll(".words");
        gsap.to(words, {
          y: "-125%",
          duration: 0.75,
          delay: 0.5,
          stagger: 0.1,
          ease: "power4.out",
          onComplete: () => {
            state.current.currentTitle.remove();
            state.current.currentTitle = null;
          },
        });
      }

      const vw = window.innerWidth;
      let galleryScale = 1;
      if (vw < 768) galleryScale = 0.6;
      else if (vw < 1200) galleryScale = 0.8;

      gsap.to(gallery, {
        scale: galleryScale,
        y: 0,
        x: 0,
        rotation: 0,
        duration: 2.5,
        ease: "power4.inOut",
        onComplete: () => {
          state.current.isPreviewActive = false;
          state.current.isTransitioning = false;
          Object.assign(parallexState, {
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            currentX: 0,
            currentY: 0,
            currentZ: 0,
          });
        },
      });
    };

    const handleResize = () => {
      const vw = window.innerWidth;
      config.isMobile = vw < 1000;
      let galleryScale = 1;
      if (vw < 768) galleryScale = 0.6;
      else if (vw < 1200) galleryScale = 0.8;
      gsap.set(gallery, { scale: galleryScale });
    };

    const handleMouseMove = (e) => {
      if (
        state.current.isPreviewActive ||
        state.current.isTransitioning ||
        config.isMobile
      )
        return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const percentX = (e.clientX - centerX) / centerX;
      const percentY = (e.clientY - centerY) / centerY;

      parallexState.targetY = percentX * 15;
      parallexState.targetX = -percentY * 15;
      parallexState.targetZ = (percentX + percentY) * 5;

      cards.current.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.sensitivity && !config.isMobile) {
          const flipFactor = Math.max(0, 1 - dist / config.effectFalloff);
          const angle = transformState.current[index].angle;
          const moveAmount = config.cardMoveAmount * flipFactor;

          Object.assign(transformState.current[index], {
            targetRotation: 180 * flipFactor,
            targetScale: 1 + 0.3 * flipFactor,
            targetX: moveAmount * Math.cos(angle),
            targetY: moveAmount * Math.sin(angle),
          });
        } else {
          Object.assign(transformState.current[index], {
            targetRotation: 0,
            targetScale: 1,
            targetX: 0,
            targetY: 0,
          });
        }
      });
    };

    const animate = () => {
      if (!state.current.isPreviewActive && !state.current.isTransitioning) {
        parallexState.currentX +=
          (parallexState.targetX - parallexState.currentX) * config.lerpFacter;
        parallexState.currentY +=
          (parallexState.targetY - parallexState.currentY) * config.lerpFacter;
        parallexState.currentZ +=
          (parallexState.targetZ - parallexState.currentZ) * config.lerpFacter;

        gsap.set(containerRef.current, {
          rotateX: parallexState.currentX,
          rotateY: parallexState.currentY,
          rotation: parallexState.currentZ,
        });

        cards.current.forEach((card, index) => {
          const state = transformState.current[index];
          state.currentRotation +=
            (state.targetRotation - state.currentRotation) * config.lerpFacter;
          state.currentScale +=
            (state.targetScale - state.currentScale) * config.lerpFacter;
          state.currentX +=
            (state.targetX - state.currentX) * config.lerpFacter;
          state.currentY +=
            (state.targetY - state.currentY) * config.lerpFacter;

          const angle = state.angle;
          const x = config.radius * Math.cos(angle);
          const y = config.radius * Math.sin(angle);

          gsap.set(card, {
            x: x + state.currentX,
            y: y + state.currentY,
            rotationY: state.currentRotation,
            scale: state.currentScale,
            rotation: (angle * 180) / Math.PI + 90,
          });
        });
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", () => {
      if (state.current.isPreviewActive && !state.current.isTransitioning)
        resetGallery();
    });
    document.addEventListener("mousemove", handleMouseMove);

    handleResize();
    animate();
  }, []);

  return (
    <div className="container">
      <div className="gallery-container" ref={containerRef}>
        <div className="gallery" ref={galleryRef}></div>
      </div>
      <div className="title-container" ref={titleRef}></div>
    </div>
  );
};

export default Gallery3D;
