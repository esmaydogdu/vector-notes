import { NoteStatus } from "@/types";

export function StatusBadge ({status}: {status: NoteStatus}) {
  const getStatusBadgeClass = (status: NoteStatus): string => {
      switch (status) {
        case "todo":
          return "px-[8px] py-1 rounded-[4px] text-sm font-bold text-blue-200 border border-blue-400/40 bg-blue-400/10";
        case "snoozed":
          return "px-[8px] py-1 rounded-[4px] text-sm font-bold text-amber-200 border border-amber-400/40 bg-amber-400/10";
        case "done":
          return "px-[8px] py-1 rounded-[4px] text-sm font-bold text-green-200 border border-green-400/40 bg-green-400/10";
        default:
          return "px-[8px] py-1 rounded-[4px] text-sm font-bold text-gray-200 border border-gray-400/40 bg-gray-400/10";
      }
    };

    return (
      <span className={getStatusBadgeClass(status as NoteStatus)}>
        {status}
      </span>
    )
}