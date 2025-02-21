export const ErrorDisplay = ({ error }: { error: string | null }) => {
  if (!error) return null;
  return (
    <div className="text-center text-red-500 text-lg font-semibold mt-6">
      {error}
    </div>
  );
};
