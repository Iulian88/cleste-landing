import type { HTMLAttributes, ElementType } from "react";

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  id?: string;
  narrow?: boolean;
}

export default function SectionWrapper({
  as: Tag = "section",
  id,
  narrow = false,
  className = "",
  children,
  ...props
}: SectionWrapperProps) {
  return (
    <Tag id={id} className={["w-full py-16 md:py-24", className].filter(Boolean).join(" ")} {...props}>
      <div
        className={[
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          narrow ? "max-w-2xl" : "max-w-[1200px]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </Tag>
  );
}
