"use client";

import { Star, TriangleAlert } from "@/components/icons";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDeliveryManProfile, submitDeliveryManReview } from "@/api/deliveryApi";
import { CourierIdentity } from "@/components/survey/CourierIdentity";
import { FormShell, Notice, StatePanel } from "@/components/survey/Panels";
import { StarRating, deliveryTone } from "@/components/survey/StarRating";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";

export default function DeliveryManReviewPage() {
  const { id } = useParams();
  const [star, setStar] = useState(0);
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
        user_id: null,
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

  if (submitted) {
    return (
      <FormShell>
        <StatePanel icon={Star} title="Merci !">
          <p className="text-ink-2">
            Votre avis a été enregistré avec succès. Merci de nous aider à améliorer notre service.
          </p>
        </StatePanel>
      </FormShell>
    );
  }

  return (
    <FormShell narrow>
      <h1 className="tk-display text-[clamp(2rem,9vw,2.75rem)]">Noter le livreur</h1>
      <p className="mt-3 text-ink-2">Laissez une note et un commentaire sur votre expérience de livraison.</p>

      <div className="mt-6 rounded-panel border border-line bg-surface p-5 sm:p-7">
        {!loadingDeliveryMan && deliveryMan && (
          <CourierIdentity courier={deliveryMan} className="mb-5 border-b border-line pb-5" />
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <StarRating
            legend="Votre note"
            legendClassName="tk-label mb-1 w-full text-center text-[0.875rem] text-ink"
            value={star}
            onChange={setStar}
            disabled={loading}
            tone={deliveryTone}
          />

          {error && (
            <Notice role="alert" tone="error" icon={TriangleAlert}>
              {error}
            </Notice>
          )}

          <Field label="Commentaire (optionnel)">
            {(props) => (
              <Textarea
                {...props}
                rows={5}
                placeholder="Votre expérience…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            )}
          </Field>

          <Button type="submit" className="w-full" disabled={star === 0 || loading}>
            {loading ? "Envoi en cours…" : "Soumettre l'avis"}
          </Button>
        </form>
      </div>
    </FormShell>
  );
}
