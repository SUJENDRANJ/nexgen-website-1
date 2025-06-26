import clsx from "clsx";
import { useRef } from "react";
import gsap from "gsap";

const Button = ({ id, title, rightIcon, leftIcon, containerClass }) => {
  const audioRef = useRef(null);
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    // Play hover sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    // Morph into parallelogram shape
    gsap.to(buttonRef.current, {
      clipPath: "polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)",
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    // Reset to original shape
    gsap.to(buttonRef.current, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        // Default styles
        "group relative z-10 w-fit cursor-pointer overflow-hidden text-black transition-all duration-300 rounded-full",

        // These are default paddings (overridable)
        "!px-7 !py-3",

        // Allow external override
        containerClass
      )}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      <audio
        ref={audioRef}
        src="/audio/btn-2.mp3"
        preload="auto"
        className="hidden"
      />

      {leftIcon}

      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>

      {rightIcon}
    </button>
  );
};

export default Button;
