import React, { useEffect, useRef } from 'react';

import { Star, CheckCircle } from 'lucide-react';

const getAvgRating = (reviews) => {
  if (!reviews?.length) return 0;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
};

const StarIcon = ({ filled }) => (
  <Star className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
);

const CheckCircleIcon = () => (
  <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-1" />
);

const ReviewCard = ({ review }) => (
  <div className="bg-white p-6 hover:shadow-lg rounded-xl shadow-sm border border-[#35894E] flex flex-col justify-between">
    <div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < review.rating} />
        ))}
      </div>

      <div className="mb-1 text-[#35894E] font-semibold text-lg flex items-center">
        <span>{review.name || 'Anonymous'}</span>
        {(review.verified ?? false) && <CheckCircleIcon />}
      </div>

      <p className="text-[#93A87E] text-sm leading-relaxed mb-3">{review.comment}</p>
    </div>

    <p className="text-[#35894E] text-xs mt-auto">
      Posted on -{' '}
      {review.date
        ? new Date(review.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : new Date(review.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
    </p>
  </div>
);

const ProductReviews = ({ reviews = [], error = null }) => {
  const avgRating = getAvgRating(reviews);
  const reviewsCount = reviews.length;

  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (error && !hasShownToastRef.current) {
      toast.error(`Failed to load reviews: ${error}`);
      hasShownToastRef.current = true;
    }
   
  }, [error]);

  return (
    <>
     
      <div className="font-sans antialiased text-gray-800 flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#35894E] mb-4 sm:mb-0">
              All Reviews <span className="text-[#35894eb7]">({reviewsCount})</span>
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#35894E] mb-4">
            <h3 className="text-xl font-semibold text-[#35894E] mb-2">Overall Customer Rating</h3>
            <div className="flex items-center text-xl font-bold text-[#35894E]">
              {avgRating} out of 5 stars
              <div className="flex ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={`avg-star-${i}`}
                    size={20}
                    fill={i < Math.round(avgRating) ? '#FFC107' : '#ffffff'}
                    stroke={i < Math.round(avgRating) ? '#FFC107' : '#A0A0A0'}
                  />
                ))}
              </div>
            </div>
            <p className="text-[#93A87E] text-sm mt-1">Based on {reviewsCount} reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id || review._id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
