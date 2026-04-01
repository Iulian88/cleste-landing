interface ReviewCardProps {
  author: string;
  rating: number;
  text: string;
  date?: string;
  verified?: boolean;
  avatarInitial?: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className={["w-4 h-4", filled ? "text-amber-400" : "text-gray-300"].join(" ")}
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
  );
}

export default function ReviewCard({
  author,
  rating,
  text,
  date,
  verified = true,
  avatarInitial,
}: ReviewCardProps) {
  const clampedRating = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
          {avatarInitial ?? author.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{author}</p>
          {date && <p className="text-xs text-gray-400">{date}</p>}
        </div>
      </div>

      <div className="flex items-center gap-0.5" aria-label={`Rating: ${clampedRating} din 5`}>
        {([1, 2, 3, 4, 5] as const).map((star) => (
          <StarIcon key={star} filled={star <= clampedRating} />
        ))}
      </div>

      <p className="text-sm leading-relaxed text-gray-700">{text}</p>

      {verified && (
        <p className="text-xs font-medium text-emerald-600">✓ Cumpărător verificat</p>
      )}
    </article>
  );
}
