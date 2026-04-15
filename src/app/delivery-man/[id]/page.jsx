"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

// Main app colors
const PRIMARY_COLOR = "#005F69";
const ERROR_COLOR = "#FF3300";
const WARNING_COLOR = "#F29E10";

const getStarColor = (rating) => {
  if (rating <= 2) return ERROR_COLOR; // Red for 1-2 stars
  if (rating === 3) return WARNING_COLOR; // Orange for 3 stars
  return PRIMARY_COLOR; // Green for 4-5 stars
};

export default function DeliveryManReviewPage() {
  const { id } = useParams();
  const [star, setStar] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to BACKEND/api/v1/delivery-man-reviews
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const currentRating = hover || star;
  const starColor = getStarColor(currentRating);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: `${PRIMARY_COLOR}20`, color: PRIMARY_COLOR }}
          >
            <Star size={32} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Merci !</h1>
          <p className="text-gray-600">
            Votre avis a été enregistré avec succès. Merci de nous aider à
            améliorer notre service.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Noter le Livreur</h1>
          <p className="text-gray-500">
            Laissez une note et un commentaire sur votre expérience de
            livraison.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStar(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-95"
              >
                <Star
                  size={36}
                  fill={currentRating >= s ? starColor : "none"}
                  className="transition-colors"
                  style={{
                    color: currentRating >= s ? starColor : "#D1D5DB",
                  }}
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Commentaire (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none min-h-[120px]"
              style={{ 
                "--tw-ring-color": PRIMARY_COLOR 
              }}
              placeholder="Votre expérience..."
            />
          </div>

          <button
            type="submit"
            disabled={star === 0 || loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95`}
            style={{
              backgroundColor: star === 0 || loading ? "#D1D5DB" : PRIMARY_COLOR,
              boxShadow: star === 0 || loading ? "none" : `0 10px 15px -3px ${PRIMARY_COLOR}33`,
              cursor: star === 0 || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Envoi en cours..." : "Soumettre l'avis"}
          </button>
        </form>
      </div>
    </div>
  );
}
