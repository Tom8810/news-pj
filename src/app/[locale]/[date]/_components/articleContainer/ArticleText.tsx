import Tooltip from "@/components/tooltip";
import { NewsTag } from "@/lib/types";

export const ArticleText = ({
  text,
  tags,
}: {
  text: string;
  tags: NewsTag[];
}) => {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
        const match = part.match(/^\*\*(.+)\*\*$/);
        if (match) {
          const tag = tags.find((t) => t.tag.name === match[1]);
          return tag ? (
            <Tooltip
              key={index}
              content={tag.tag.description || "no description"}
            >
              <span className="font-bold cursor-help text-blue-500">
                {match[1]}
              </span>
            </Tooltip>
          ) : (
            <span key={index} className="font-bold text-gray-900">
              {match[1]}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};
