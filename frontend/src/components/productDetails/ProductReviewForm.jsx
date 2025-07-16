import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, resetReview } from '../../utility/reviewSlice';

const ProductReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
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
  }, [success, error, dispatch, toastShown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastShown(false); // reset toast flag on new submit
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    dispatch(createReview({ productId, rating, comment }));
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-green-700">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very good</option>
          <option value="5">5 - Excellent</option>
        </select>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Write your comment"
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductReviewForm;
