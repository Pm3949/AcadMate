import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const MouseGlow = ({ darkMode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [hue, setHue] = useState(240);
  const [isVisible, setIsVisible] = useState(false);

  const generateParticles = useCallback((x, y) => {
    const newParticles = Array(5).fill().map(() => ({
      x,
      y,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: darkMode ? Math.random() * 0.5 + 0.3 : Math.random() * 0.2 + 0.1,
    }));
    setParticles((prev) => [...prev.slice(-15), ...newParticles]);
  }, [darkMode]);

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setHue((prev) => (prev + (darkMode ? 0.5 : 0.2)) % 360);
    }, 50);
    return () => clearInterval(colorInterval);
  }, [darkMode]);

  useEffect(() => {
    const moveParticles = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            opacity: p.opacity * 0.98,
          }))
          .filter((p) => p.opacity > 0.05)
      );
    };
    const animationFrame = requestAnimationFrame(moveParticles);
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  const handleMouseMove = useCallback(
    (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      generateParticles(e.clientX, e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [generateParticles, isVisible]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const glowStyle = {
    background: `radial-gradient(circle at ${position.x}px ${position.y}px, 
                hsla(${hue}, 80%, ${darkMode ? "70%" : "50%"}, ${darkMode ? 0.15 : 0.08}), 
                transparent ${darkMode ? "70%" : "80%"})`,
    opacity: isVisible ? 1 : 0,
    transition: "opacity 0.4s ease, background 0.3s ease-out",
    transform: "translateZ(0)",
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div 
        className="absolute inset-0" 
        style={glowStyle} 
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsla(${hue}, 100%, ${darkMode ? "80%" : "60%"}, ${p.opacity})`,
            transform: `translate(-50%, -50%)`,
            filter: "blur(1px)",
          }}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: p.opacity }}
          transition={{ duration: 0.2 }}
        />
      ))}

      <motion.div
        className="absolute rounded-full"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "60px",
          height: "60px",
          background: `hsla(${hue}, 100%, ${darkMode ? "70%" : "50%"}, ${darkMode ? 0.1 : 0.05})`,
          transform: "translate(-50%, -50%)",
          filter: "blur(20px)",
        }}
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          opacity: { duration: 0.3 },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
    </div>
  );
};


export default MouseGlow;
