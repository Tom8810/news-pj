"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export const ArticleImage = ({
  src,
  alt = "Article Image",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("flex-shrink-0 relative aspect-square", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}

      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        className={`rounded-lg object-cover w-full h-full transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={(e: React.SyntheticEvent<HTMLImageElement>) =>
          setIsLoading(false)
        }
      />
    </div>
  );
};
