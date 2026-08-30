import { Search, User } from "lucide-react"

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative flex size-10 items-center justify-center rounded-full ${
          light ? "bg-white/15" : "bg-brand/10"
        }`}
      >
        <Search
          className={light ? "size-6 text-white" : "size-6 text-brand"}
          strokeWidth={2.4}
        />
        <User
          className={`absolute size-3 ${light ? "text-white" : "text-brand"}`}
          strokeWidth={2.6}
        />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`text-xl font-extrabold ${light ? "text-white" : "text-brand"}`}
        >
          لقيناهو
        </span>
        <span
          className={`mt-0.5 text-[10px] font-medium ${
            light ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          نبحث معاً.. لنجدهم
        </span>
      </div>
    </div>
  )
}
