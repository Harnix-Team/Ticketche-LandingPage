import Image from "next/image";
import { AppDownloadButtons } from "../Appdownloadbuttons";

export const CTASection = () => {
  return (
    <div className="py-12 md:py-16 lg:py-24">
    <section
      id="download"
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:rounded-3xl bg-gradient-to-b from-[#005F69] to-[#004a52] text-white overflow-hidden shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* TEXTE CTA */}
<div className="pt-10 md:pt-14 pb-3 md:pb-4 text-center sm:text-left">            {/* Titre + description */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="flex-1">
               <h2 className="title-sub mb-4 md:mb-6 !text-white">
                  Parking, lavage, garage, billetterie & événements tout en une seule app !
                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-6 md:mb-8">                  Ticketché centralise 4 services en une seule app : parking, lavage auto,
                  garage & mécanique, billetterie d'événements et gestion d'événements. Réservez, payez et profitez  où que vous soyez.
                </p>
              </div>

              {/* Image confetti visible seulement sur desktop */}
              <div className="flex-shrink-0 hidden sm:block">
                <img
                  src="/images/Download/confetti.png"
                  className="h-16 md:h-20 w-auto"
                  alt="Confettis"
                />
              </div>
            </div>

            {/* AVATAR + TEXTE */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <div className="flex -space-x-2 justify-center sm:justify-start">
                {[1, 2, 3, 4].map((num) => (
                  <Image
                    key={num}
                    src={`/images/users/user${(num % 4) + 1}.png`}
                    alt={`Utilisateur ${num}`}
                    width={40}
                    height={40}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white"
                  />
                ))}
              </div>

              <span className="text-white font-semibold text-sm sm:text-base text-center sm:text-left">
                + de 30 utilisateurs
              </span>
            </div>

            {/* BOUTONS DE TÉLÉCHARGEMENT */}
            {/* <div className="flex flex-row gap-4 justify-center sm:justify-start">
              {[
                {
                  src: "/images/app.png",
                  alt: "Télécharger sur App Store",
                  type: "ios",
                },
                {
                  src: "/images/play.png",
                  alt: "Télécharger sur Google Play",
                  type: "android",
                },
              ].map((store, idx) => (
                <a
                  key={idx}
                  href={getDownloadLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mx-auto sm:mx-0"
                >
                  <div className="relative">
                    <img
                      src={store.src}
                      alt={store.alt}
                      className="h-12 w-auto border-2 rounded-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#005f69]/0 to-[#005f69]/0 group-hover:from-[#005f69]/10 group-hover:to-transparent rounded-lg transition-all duration-300"></div>
                  </div>
                </a>
              ))}
            </div> */}
            <div className="flex flex-row gap-4 justify-center sm:justify-start">
              <AppDownloadButtons />
            </div>
          </div>

          {/* MOCKUP SECTION */}
<div className="flex flex-col items-center justify-end sm:items-end overflow-visible pb-0 mb-0">
 <img
  src="/images/Download/download3.png"
  alt="Ticketché App Mockup"
  className="rounded-t-2xl object-contain object-bottom"
style={{ width: "120%", maxWidth: "700px", marginLeft: "auto", marginRight: "-40px", marginTop: "90px" }}
/>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};