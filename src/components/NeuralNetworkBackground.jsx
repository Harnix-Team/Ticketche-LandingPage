"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function NeuralNetworkBackground({ 
  particleCount = 30,
  lineOpacity = 0.1,
  particleColor = 'green-100', // blue-500
  lineColor = 'red-400',
  connectionDistance = 150,
  className = ''
}) {
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Générer les particules initiales
  useEffect(() => {
    const initialParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
    }));
    setParticles(initialParticles);
  }, [particleCount]);

  // Suivre la position de la souris
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="w-full h-full">
        <defs>
          {/* Gradient pour les lignes */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="50%" stopColor={lineColor} stopOpacity={lineOpacity} />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          
          {/* Filtre de lueur */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Lignes de connexion entre particules */}
        {particles.map((particle, i) =>
          particles.slice(i + 1).map((otherParticle, j) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance / 10) {
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={`${particle.x}%`}
                  y1={`${particle.y}%`}
                  x2={`${otherParticle.x}%`}
                  y2={`${otherParticle.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              );
            }
            return null;
          })
        )}

        {/* Particules animées */}
        {particles.map((particle) => (
          <motion.g key={particle.id}>
            {/* Cercle principal */}
            <motion.circle
              cx={`${particle.x}%`}
              cy={`${particle.y}%`}
              r={particle.size}
              fill={particleColor}
              filter="url(#glow)"
              animate={{
                cx: [`${particle.x}%`, `${particle.x + particle.vx * 10}%`, `${particle.x}%`],
                cy: [`${particle.y}%`, `${particle.y + particle.vy * 10}%`, `${particle.y}%`],
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Pulse externe */}
            <motion.circle
              cx={`${particle.x}%`}
              cy={`${particle.y}%`}
              r={particle.size * 2}
              fill="none"
              stroke={particleColor}
              strokeWidth="0.5"
              animate={{
                cx: [`${particle.x}%`, `${particle.x + particle.vx * 10}%`, `${particle.x}%`],
                cy: [`${particle.y}%`, `${particle.y + particle.vy * 10}%`, `${particle.y}%`],
                scale: [1, 2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.g>
        ))}
      </svg>
      
    </div>
  );
}