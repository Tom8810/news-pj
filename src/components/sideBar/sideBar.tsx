import { SideBarSearchBox } from "./sideBarSearchBox";
import { SideBarDateBox } from "./sideBarDateBox";

type Props = {
  whatFor: "mobile" | "pc";
  localeClass: string;
  newsDates: Record<number, Record<number, number[]>>;
};

export default function Sidebar({ whatFor, localeClass, newsDates }: Props) {
  return (
    <aside
      className={`w-64 bg-gray-900 text-white h-[calc(100vh-4rem)] sticky top-16 left-0 flex-shrink-0 ${
        whatFor === "mobile" ? "lg:hidden block" : "hidden lg:block"
      }`}
    >
      <div className="p-4 h-full overflow-y-auto">
        <SideBarSearchBox localeClass={localeClass} />
        <SideBarDateBox localeClass={localeClass} newsDates={newsDates} />
      </div>
    </aside>
  );
}
