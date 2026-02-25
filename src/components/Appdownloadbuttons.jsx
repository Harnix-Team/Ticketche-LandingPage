// "use client";

// import { getDownloadLink } from "@/utils/deviceDetection";

// /**
//  * Composant pour afficher les boutons de téléchargement des applications
//  * @param {string} className - Classes CSS additionnelles pour le conteneur
//  * @param {string} buttonSize - Taille des boutons ('sm', 'md', 'lg')
//  */
// export const AppDownloadButtons = ({
//   className = "",
//   buttonSize = "md"
// }) => {
//   const stores = [
//     {
//       src: "/images/app.png",
//       alt: "Télécharger sur App Store",
//       type: "ios",
//     },
//     {
//       src: "/images/play.png",
//       alt: "Télécharger sur Google Play",
//       type: "android",
//     },
//   ];

//   const sizeClasses = {
//     sm: "h-10",
//     md: "h-12",
//     lg: "h-14",
//   };

//   const buttonHeight = sizeClasses[buttonSize] || sizeClasses.md;

//   return (
//     <div className={`flex flex-row gap-4 ${className}`}>
//       {stores.map((store, idx) => (
//         <a
//           key={idx}
//           href={getDownloadLink()}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="group relative"
//           aria-label={store.alt}
//         >
//           <div className="relative transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95">
//             <img
//               src={store.src}
//               alt={store.alt}
//               className={`${buttonHeight} w-auto`}
//             />
//             <div
//               className="
//                 absolute inset-0
//                 bg-gradient-to-r
//                 from-[#005f69]/0
//                 to-[#005f69]/0
//                 group-hover:from-[#005f69]/10
//                 group-hover:to-transparent
//                 rounded-lg
//                 transition-all
//                 duration-300
//               "
//             />
//           </div>
//         </a>
//       ))}
//     </div>
//   );
// };

"use client";

import { Apple, Play } from "lucide-react";

/**
 * Composant pour afficher les boutons de téléchargement des applications
 * @param {string} className - Classes CSS additionnelles pour le conteneur
 * @param {string} buttonSize - Taille des boutons ('sm', 'md', 'lg')
 */
export const AppDownloadButtons = ({ className = "", buttonSize = "md" }) => {
  const stores = [
    {
      icon: Apple,
      label: "IOS",
      sublabel: "Cliquez ici pour",
      type: "ios",
    },
    {
      icon: Play,
      label: "Android",
      sublabel: "Cliquez ici pour",
      type: "android",
      href: "https://play.google.com/store/apps/details?id=com.harnixsas.ticketche",
    },
  ];

  const sizeClasses = {
    sm: {
      button: "px-4 py-2",
      icon: "w-5 h-5",
      label: "text-sm",
      sublabel: "text-xs",
    },
    md: {
      button: "px-5 py-3",
      icon: "w-6 h-6",
      label: "text-base",
      sublabel: "text-xs",
    },
    lg: {
      button: "px-6 py-4",
      icon: "w-7 h-7",
      label: "text-lg",
      sublabel: "text-sm",
    },
  };

  const sizes = sizeClasses[buttonSize] || sizeClasses.md;

  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      {stores.map((store, idx) => {
        const Icon = store.icon;
        return (
          <a
            key={idx}
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              group relative
              ${sizes.button}
              bg-[#005F69]
              hover:bg-gray-800
              text-white
              rounded-xl
              transition-all
              duration-300
              ease-out
              flex
              items-center
              gap-3
              shadow-lg
              hover:shadow-xl
              border
              border-gray-800
              hover:border-gray-700
            `}
            aria-label={`${store.sublabel} ${store.label}`}
          >
            <Icon className={`${sizes.icon} flex-shrink-0`} />
            <div className="flex flex-col items-start">
              <span
                className={`${sizes.sublabel} hidden md:block text-gray-300 leading-tight`}
              >
                {store.sublabel}
              </span>
              <span className={`${sizes.label} font-semibold leading-tight`}>
                {store.label}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
};
