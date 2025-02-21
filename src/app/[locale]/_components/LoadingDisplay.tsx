import { Skeleton } from "@/components/skelton";

export const LoadingDisplay = () => {
  return (
    <div className="grid gap-6 w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 p-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="border border-gray-300 p-4 rounded-lg bg-white shadow-md h-full"
        >
          <Skeleton className="w-full h-40 rounded-md" />
          <Skeleton className="h-6 w-3/4 my-4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  );
};
