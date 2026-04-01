import Image from "next/image";

interface ImageBlockProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export default function ImageBlock({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ImageBlockProps) {
  if (fill) {
    return (
      <div className={["relative overflow-hidden", className].filter(Boolean).join(" ")}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      sizes={sizes}
      className={["w-full h-auto", className].filter(Boolean).join(" ")}
    />
  );
}
