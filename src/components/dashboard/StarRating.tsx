import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  leadId: string;
  initialRating?: number;
  onRate: (leadId: string, rating: number) => Promise<void>;
  disabled?: boolean;
}

export default function StarRating({
  leadId,
  initialRating = 0,
  onRate,
  disabled = false,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async (value: number) => {
    if (disabled || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onRate(leadId, value);
      setRating(value);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      // Optionally show error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!disabled && !isSubmitting) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= (hoverRating || rating);
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled || isSubmitting}
            className={cn(
              "transition-all duration-150 ease-in-out",
              disabled || isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:scale-110"
            )}
            aria-label={`Rate ${value} stars`}
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-neutral-300 dark:text-neutral-600"
              )}
            />
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-1 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {rating}/5
        </span>
      )}
    </div>
  );
}
