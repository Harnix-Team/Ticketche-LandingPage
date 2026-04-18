const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v2";

/**
 * Fetch minimal profile of a delivery man by ID
 */
export const fetchDeliveryManProfile = async (id) => {
  const response = await fetch(`${API_URL}/delivery-man/${id}/profile`);
  if (!response.ok) {
    throw new Error(`Failed to fetch delivery man profile: ${response.status}`);
  }
  const data = await response.json();
  return data.data || data;
};

/**
 * Submit a review for a delivery man
 */
export const submitDeliveryManReview = async (reviewData) => {
  const response = await fetch(`${API_URL}/delivery-man-reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Fetch delivery details by ID
 */
export const fetchDeliveryDetails = async (id) => {
  const response = await fetch(`${API_URL}/deliveries/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch delivery: ${response.status}`);
  }
  const data = await response.json();
  return data.data || data;
};

/**
 * Submit a review for a delivery
 */
export const submitDeliveryReview = async (reviewData) => {
  const response = await fetch(`${API_URL}/delivery-reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

/**
 * Fetch reviews for a specific delivery
 */
export const fetchDeliveryReviews = async (deliveryId) => {
  const response = await fetch(`${API_URL}/delivery-reviews/${deliveryId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`);
  }
  const data = await response.json();
  return data.data || data;
};
