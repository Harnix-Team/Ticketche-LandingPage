"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, CheckCircle } from "lucide-react";
import {
  fetchDeliveryDetails,
  submitDeliveryReview,
  fetchDeliveryReviews,
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

export default function DeliveryReviewPage() {
  const { id } = useParams();
  const [star, setStar] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [loadingDelivery, setLoadingDelivery] = useState(true);
  const [existingReviews, setExistingReviews] = useState([]);

  useEffect(() => {
    const loadDeliveryDetails = async () => {
      try {
        const details = await fetchDeliveryDetails(id);
        setDelivery(details);
        if (details.deliveryMan) {
          setDeliveryMan(details.deliveryMan);
        }

        // Load existing reviews
        const reviews = await fetchDeliveryReviews(id);
        setExistingReviews(reviews);
      } catch (err) {
        console.error("Error fetching delivery:", err);
        setError("Impossible de charger les détails de la livraison");
      } finally {
        setLoadingDelivery(false);
      }
    };

    if (id) loadDeliveryDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await submitDeliveryReview({
        star: star,
        description: description || null,
        user_id: null, // Anonymous review
        delivery_id: id,
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
            Votre avis sur la livraison a été enregistré avec succès. Merci de
            nous aider à améliorer notre service.
          </p>
        </div>
      </div>
    );
  }

  if (loadingDelivery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  // If review already exists, show message
  if (existingReviews && existingReviews.length > 0) {
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
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Déjà notée</h1>
          <p className="text-gray-600">
            Cette livraison a déjà été notée. Merci de votre participation !
          </p>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Votre note:{" "}
              <span style={{ color: PRIMARY_COLOR }} className="font-semibold">
                {existingReviews[0].star} ⭐
              </span>
            </p>
            {existingReviews[0].description && (
              <p className="text-sm text-gray-600 mt-2 italic">
                "{existingReviews[0].description}"
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
        {/* Delivery Man Profile Section */}
        {deliveryMan && (
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

        {/* Delivery Details Section */}
        {delivery && (
          <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{delivery.title}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-700">De:</span>{" "}
                {delivery.departure}
              </div>
              <div>
                <span className="font-medium text-gray-700">Vers:</span>{" "}
                {delivery.arrival}
              </div>
              {delivery.description && (
                <div>
                  <span className="font-medium text-gray-700">
                    Description:
                  </span>{" "}
                  {delivery.description}
                </div>
              )}
              {delivery.is_fragile && (
                <div className="text-yellow-600 font-medium">
                  ⚠️ Colis fragile ({delivery.weight} kg)
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Noter la Livraison
          </h1>
          <p className="text-gray-500">
            Laissez une note et un commentaire sur votre expérience de
            livraison.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

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

          <textarea
            placeholder="Commentaire (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005F69] resize-none"
            rows="4"
            maxLength={500}
          />

          <button
            type="submit"
            disabled={star === 0 || loading}
            style={{
              backgroundColor: star === 0 ? "#D1D5DB" : PRIMARY_COLOR,
              opacity: loading ? 0.7 : 1,
            }}
            className="w-full text-white font-semibold py-3 rounded-lg transition-opacity disabled:cursor-not-allowed"
          >
            {loading ? "Envoi..." : "Soumettre mon avis"}
          </button>
        </form>
      </div>
    </div>
  );
}
