"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
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
                  fill={(hover || star) >= s ? "#22C55E" : "none"}
                  className={
                    (hover || star) >= s ? "text-green-500" : "text-gray-300"
                  }
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
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-h-[120px]"
              placeholder="Votre expérience..."
            />
          </div>

          <button
            type="submit"
            disabled={star === 0 || loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all 
                            ${star === 0 || loading ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95 shadow-lg shadow-green-200"}`}
          >
            {loading ? "Envoi en cours..." : "Soumettre l'avis"}
          </button>
        </form>
      </div>
    </div>
  );
}
