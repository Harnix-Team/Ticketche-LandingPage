"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import {
  fetchDeliveryManProfile,
  submitDeliveryManReview,
} from "@/api/deliveryApi";

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
  const [error, setError] = useState(null);
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [loadingDeliveryMan, setLoadingDeliveryMan] = useState(true);

  useEffect(() => {
    const loadDeliveryMan = async () => {
      try {
        const profile = await fetchDeliveryManProfile(id);
        setDeliveryMan(profile);
      } catch (err) {
        console.error("Error fetching delivery man:", err);
      } finally {
        setLoadingDeliveryMan(false);
      }
    };

    if (id) loadDeliveryMan();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await submitDeliveryManReview({
        star: star,
        description: description || null,
        user_id: null, // Anonymous review
        delivery_man_id: id,
      });

      setLoading(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const currentRating = hover || star;
  const starColor = getStarColor(currentRating);

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{
              backgroundColor: `${PRIMARY_COLOR}20`,
              color: PRIMARY_COLOR,
            }}
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
        {/* Delivery Man Profile Section */}
        {!loadingDeliveryMan && deliveryMan && (
          <div className="flex flex-col items-center space-y-3 pb-6 border-b border-gray-200">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              {deliveryMan.first_name?.[0]}
              {deliveryMan.second_name?.[0]}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                {deliveryMan.first_name} {deliveryMan.second_name}
              </h2>
              <p
                className="text-sm font-medium"
                style={{ color: PRIMARY_COLOR }}
              >
                Livreur officiel Ticketché
              </p>
            </div>
          </div>
        )}

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
                disabled={loading}
              >
                <Star
                  size={36}
                  fill={currentRating >= s ? starColor : "none"}
                  className="transition-colors"
                  style={{
                    color: currentRating >= s ? starColor : "#D1D5DB",
                    opacity: loading ? 0.5 : 1,
                  }}
                />
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Commentaire (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none min-h-[120px] disabled:opacity-50"
              style={{
                "--tw-ring-color": PRIMARY_COLOR,
              }}
              placeholder="Votre expérience..."
            />
          </div>

          <button
            type="submit"
            disabled={star === 0 || loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95`}
            style={{
              backgroundColor:
                star === 0 || loading ? "#D1D5DB" : PRIMARY_COLOR,
              boxShadow:
                star === 0 || loading
                  ? "none"
                  : `0 10px 15px -3px ${PRIMARY_COLOR}33`,
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
