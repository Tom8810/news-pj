import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn("bg-gray-300 animate-pulse rounded-md", className)} />
  );
};
