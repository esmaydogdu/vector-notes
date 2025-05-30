import { Label } from "@/types";
import { labelColorClasses } from "@/styles/theme";

export function LabelBadge ({color, name}: Label) {
  return (
    <span className={` ${
      color 
        ? labelColorClasses[color] 
        : 'px-[8px] py-1 rounded-[8px] text-sm font-bold text-gray-400 border border-gray-400/40 bg-gray-400/10'
    }`}>
      {name}
    </span>
  )
}