export const Confetti = ({ density = "medium", colors = "default" }) => {
  // Configurations de densité
  const densityConfig = {
    light: 8,
    medium: 14,
    high: 20,
  };

  // Configurations de couleurs
  const colorSchemes = {
    default: [
      "bg-yellow-400",
      "bg-pink-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
      "bg-orange-400",
      "bg-red-400",
      "bg-teal-400",
      "bg-indigo-400",
    ],
    warm: [
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-pink-400",
      "bg-rose-400",
    ],
    cool: [
      "bg-blue-400",
      "bg-teal-400",
      "bg-cyan-400",
      "bg-indigo-400",
      "bg-purple-400",
    ],
    monochrome: [
      "bg-gray-300",
      "bg-gray-400",
      "bg-gray-500",
      "bg-gray-600",
    ],
  };

  const numConfetti = densityConfig[density] || densityConfig.medium;
  const selectedColors = colorSchemes[colors] || colorSchemes.default;

  // Génération aléatoire des confettis
  const confettiElements = Array.from({ length: numConfetti }, (_, i) => {
    const size = Math.random() * 4 + 2; // Entre 2 et 6
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const color = selectedColors[Math.floor(Math.random() * selectedColors.length)];
    const opacity = Math.random() * 0.4 + 0.3; // Entre 0.3 et 0.7
    const animationDelay = Math.random() * 5;
    const animationType = Math.random() > 0.5 ? "animate-float" : "animate-float-delayed";
    
    // Types de formes
    const shapes = ["circle", "triangle", "square"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    return {
      id: i,
      size,
      top,
      left,
      color,
      opacity,
      animationDelay,
      animationType,
      shape,
    };
  });

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiElements.map((confetti) => {
          // Forme cercle
          if (confetti.shape === "circle") {
            return (
              <div
                key={confetti.id}
                className={`absolute ${confetti.color} rounded-full ${confetti.animationType}`}
                style={{
                  width: `${confetti.size * 2}px`,
                  height: `${confetti.size * 2}px`,
                  top: `${confetti.top}%`,
                  left: `${confetti.left}%`,
                  opacity: confetti.opacity,
                  animationDelay: `${confetti.animationDelay}s`,
                }}
              />
            );
          }

          // Forme triangle
          if (confetti.shape === "triangle") {
            const borderColor = confetti.color.replace("bg-", "border-b-");
            return (
              <div
                key={confetti.id}
                className={`absolute w-0 h-0 animate-spin-slow`}
                style={{
                  top: `${confetti.top}%`,
                  left: `${confetti.left}%`,
                  opacity: confetti.opacity,
                  animationDelay: `${confetti.animationDelay}s`,
                  borderLeft: `${confetti.size}px solid transparent`,
                  borderRight: `${confetti.size}px solid transparent`,
                  borderBottom: `${confetti.size * 1.5}px solid`,
                  borderBottomColor: confetti.color.includes("yellow")
                    ? "#fbbf24"
                    : confetti.color.includes("pink")
                    ? "#f472b6"
                    : confetti.color.includes("blue")
                    ? "#60a5fa"
                    : confetti.color.includes("green")
                    ? "#4ade80"
                    : confetti.color.includes("purple")
                    ? "#c084fc"
                    : confetti.color.includes("orange")
                    ? "#fb923c"
                    : confetti.color.includes("red")
                    ? "#f87171"
                    : confetti.color.includes("teal")
                    ? "#2dd4bf"
                    : "#818cf8",
                }}
              />
            );
          }

          // Forme carré
          if (confetti.shape === "square") {
            return (
              <div
                key={confetti.id}
                className={`absolute ${confetti.color} ${confetti.animationType}`}
                style={{
                  width: `${confetti.size * 2}px`,
                  height: `${confetti.size * 2}px`,
                  top: `${confetti.top}%`,
                  left: `${confetti.left}%`,
                  opacity: confetti.opacity,
                  animationDelay: `${confetti.animationDelay}s`,
                  transform: `rotate(${Math.random() * 45}deg)`,
                }}
              />
            );
          }
        })}
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </>
  );
};


// Densité légère avec couleurs par défaut
// <Confetti density="light" colors="default" />


// Densité moyenne avec couleurs chaudes
// <Confetti density="medium" colors="warm" />


// Densité élevée avec couleurs froides
// <Confetti density="high" colors="cool" />


// Monochrome
// <Confetti density="medium" colors="monochrome" />