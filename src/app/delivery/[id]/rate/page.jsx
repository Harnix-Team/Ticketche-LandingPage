"use client";

import { CircleCheck, Star, TriangleAlert } from "@/components/icons";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDeliveryDetails, fetchDeliveryReviews, submitDeliveryReview } from "@/api/deliveryApi";
import { CourierIdentity } from "@/components/survey/CourierIdentity";
import { FormShell, LoadingState, Notice, StatePanel } from "@/components/survey/Panels";
import { StarRating, deliveryTone } from "@/components/survey/StarRating";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";

export default function DeliveryReviewPage() {
  const { id } = useParams();
  const [star, setStar] = useState(0);
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
        user_id: null,
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

  if (submitted) {
    return (
      <FormShell>
        <StatePanel icon={Star} title="Merci !">
          <p className="text-ink-2">
            Votre avis sur la livraison a été enregistré avec succès. Merci de nous aider à améliorer notre service.
          </p>
        </StatePanel>
      </FormShell>
    );
  }

  if (loadingDelivery) return <LoadingState label="Chargement…" />;

  if (existingReviews && existingReviews.length > 0) {
    return (
      <FormShell>
        <StatePanel icon={CircleCheck} title="Déjà notée">
          <p className="text-ink-2">Cette livraison a déjà été notée. Merci de votre participation !</p>
        </StatePanel>
      </FormShell>
    );
  }

  return (
    <FormShell narrow>
      <h1 className="tk-display text-[clamp(2rem,9vw,2.75rem)]">Noter la livraison</h1>
      <p className="mt-3 text-ink-2">Laissez une note et un commentaire sur votre expérience de livraison.</p>

      <div className="mt-6 rounded-panel border border-line bg-surface p-5 sm:p-7">
        {deliveryMan && <CourierIdentity courier={deliveryMan} className="mb-5 border-b border-line pb-5" />}

        {delivery && (
          <div className="mb-5 border-b border-line pb-5">
            <h2 className="tk-title text-[1.0625rem]">{delivery.title}</h2>
            <dl className="mt-2 grid gap-1.5 text-[0.9375rem] text-ink-2">
              <div>
                <dt className="tk-label inline text-ink">De : </dt>
                <dd className="inline [overflow-wrap:anywhere]">{delivery.departure}</dd>
              </div>
              <div>
                <dt className="tk-label inline text-ink">Vers : </dt>
                <dd className="inline [overflow-wrap:anywhere]">{delivery.arrival}</dd>
              </div>
              {delivery.description && (
                <div>
                  <dt className="tk-label inline text-ink">Description : </dt>
                  <dd className="inline [overflow-wrap:anywhere]">{delivery.description}</dd>
                </div>
              )}
            </dl>
            {delivery.is_fragile && (
              <p className="tk-label mt-3 flex items-center gap-1.5 text-[0.875rem] text-clay">
                <TriangleAlert className="size-4 shrink-0" aria-hidden />
                Colis fragile ({delivery.weight} kg)
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <Notice role="alert" tone="error" icon={TriangleAlert}>
              {error}
            </Notice>
          )}

          <StarRating
            legend="Votre note"
            legendClassName="tk-label mb-1 w-full text-center text-[0.875rem] text-ink"
            value={star}
            onChange={setStar}
            disabled={loading}
            tone={deliveryTone}
          />

          <Field label="Commentaire (optionnel)">
            {(props) => (
              <Textarea
                {...props}
                rows={4}
                maxLength={500}
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            )}
          </Field>

          <Button type="submit" className="w-full" disabled={star === 0 || loading}>
            {loading ? "Envoi…" : "Soumettre mon avis"}
          </Button>
        </form>
      </div>
    </FormShell>
  );
}
