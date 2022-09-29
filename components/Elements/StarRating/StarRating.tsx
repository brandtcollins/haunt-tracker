import { FunctionComponent } from "react";
import { MdStarHalf, MdStarOutline, MdStar } from "react-icons/md";

interface StarRatingProps {
  rating: number | undefined;
}

const StarRating: FunctionComponent<StarRatingProps> = ({ rating }) => {
  return (
    <div className="flex text-white text-2xl">
      {[...Array(5)].map((item, index) => {
        let ratingIndex = index + 1;
        if (!rating) {
          return <p>No rating given.</p>;
        }
        if (ratingIndex > rating) {
          if (ratingIndex > rating && index < rating) {
            return <MdStarHalf className="text-yellow-500" />;
          }
          return <MdStarOutline className="text-yellow-500" />;
        }
        if (ratingIndex < rating || ratingIndex === rating) {
          return <MdStar className="text-yellow-500" />;
        }
      })}
    </div>
  );
};

export default StarRating;
