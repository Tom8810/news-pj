"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export const ArticleImage = ({
  src,
  alt = "Article Image",
  className,
  index = 0,
}: {
  src: string;
  alt?: string;
  className?: string;
  index?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc] = useState(src);

  return (
    <div className={cn("flex-shrink-0 relative aspect-square", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      <Image
        src={imgSrc}
        alt={alt}
        width={300}
        height={300}
        priority={index < 3} // 最初の3枚は即時ロード
        loading={index >= 3 ? "lazy" : undefined}
        className={`rounded-lg object-cover w-full h-full transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        quality={50}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
