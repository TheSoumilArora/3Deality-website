
import { useState, useEffect } from 'react';
import { googleMyBusinessAPI, GoogleReview } from '@/services/googleMyBusinessApi';

interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  review: string;
  verified: boolean;
  profilePhoto?: string;
}

interface UseGoogleReviewsReturn {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  averageRating: number;
  totalReviews: number;
  refreshReviews: () => Promise<void>;
}

// Fallback reviews for development/demo purposes
const fallbackReviews: Review[] = [
  {
    id: "1",
    name: "Kartik Bramhankar",
    date: "2025-05-28",
    rating: 5,
    review: "Good",
    verified: true
  },
  {
    id: "2",
    name: "Sanju D",
    date: "2025-05-25",
    rating: 5,
    review: "Good response with immediate action",
    verified: true
  },
  {
    id: "3",
    name: "Arul Anand Joseph P M",
    date: "2025-05-27",
    rating: 5,
    review: "I have been purchasing parts required for my hobby project also fabricated pcb with them. The quality of product as well as...",
    verified: true
  },
  {
    id: "4",
    name: "Priya Sharma",
    date: "2025-05-20",
    rating: 5,
    review: "Excellent 3D printing quality and fast delivery. Highly recommended for prototyping work.",
    verified: true
  },
  {
    id: "5",
    name: "Rajesh Kumar",
    date: "2025-05-18",
    rating: 5,
    review: "Perfect custom parts for my drone project. Great communication and professional service.",
    verified: true
  }
];

export function useGoogleReviews(): UseGoogleReviewsReturn {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if API credentials are configured
      const isApiConfigured = process.env.NODE_ENV === 'production' && 
        process.env.VITE_GOOGLE_MY_BUSINESS_API_KEY && 
        process.env.VITE_GOOGLE_ACCOUNT_ID &&
        process.env.VITE_GOOGLE_LOCATION_ID;

      if (!isApiConfigured) {
        console.log('Google My Business API not configured, using fallback reviews');
        setReviews(fallbackReviews);
        return;
      }

      // Fetch from Google My Business API
      const googleReviews: GoogleReview[] = await googleMyBusinessAPI.fetchReviews(50);
      
      // Format reviews for display
      const formattedReviews = googleReviews.map(review => 
        googleMyBusinessAPI.constructor.formatReview(review)
      );

      setReviews(formattedReviews);
    } catch (err) {
      console.error('Failed to fetch Google reviews:', err);
      setError('Failed to load reviews. Please try again later.');
      // Fall back to static reviews on error
      setReviews(fallbackReviews);
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = async () => {
    await fetchReviews();
  };

  // Calculate statistics
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 5;

  const totalReviews = reviews.length;

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    error,
    averageRating,
    totalReviews,
    refreshReviews,
  };
}
