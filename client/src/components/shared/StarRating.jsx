import { Star } from 'lucide-react';

const StarRating = ({ rating, maxRating = 5, onRatingChange, readOnly = false }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => onRatingChange && onRatingChange(starValue)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} focus:outline-none`}
          >
            <Star
              className={`h-5 w-5 ${
                starValue <= rating ? 'fill-accent text-accent' : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
