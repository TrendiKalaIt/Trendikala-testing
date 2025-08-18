import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, resetReview } from '../../utility/reviewSlice';
import { Star } from 'lucide-react';

const ProductReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (success && !toastShown) {
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      dispatch(resetReview());
      setToastShown(true);
    }
    if (error && !toastShown) {
      toast.error(error);
      dispatch(resetReview());
      setToastShown(true);
    }
  }, [success, error, toastShown, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastShown(false);
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    dispatch(createReview({ productId, rating, comment }));
  };

  return (
    <div className="flex flex-col items-start justify-start  font-sans mt-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="font-heading text-2xl font-bold text-gray-800 mb-2 text-center">Your Feedback Matters!</h3>
        <p className="font-body text-gray-500 mb-6 text-center">Share your thoughts and help others make a decision.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body block text-sm font-medium text-gray-700 mb-1">
              Select Rating:
            </label>
            <div className="flex justify-start space-x-1   border-gray-300 bg-white">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`transition-transform transform hover:scale-125 
                      ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${starValue} out of 5 stars`}
                  >
                    <Star size={24} fill={isFilled ? 'currentColor' : 'none'} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="font-body block text-sm font-medium text-gray-700 mb-1">
              Your Comment:
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none"
              rows="4"
              placeholder="Tell us about your experience..."
              required
            />
          </div>

          <button
            type="submit"
            className=" font-home w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 
              focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 shadow-md"
          >
            Submit Review
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductReviewForm;
