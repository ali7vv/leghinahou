import { ChevronLeft, Share2 } from "lucide-react"
import { reports } from "@/lib/data"

export function LatestReports() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">أحدث البلاغات</h2>
        <a
          href="#"
          className="flex items-center gap-1 text-sm font-semibold text-found hover:underline"
        >
          عرض الكل
          <ChevronLeft className="size-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <article
            key={report.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex gap-3 p-3">
              <div className="relative shrink-0">
                <img
                  src={report.image || "/placeholder.svg"}
                  alt={report.name}
                  className="size-24 rounded-xl object-cover"
                />
                <span className="absolute -top-1.5 -right-1.5 rounded-full bg-report px-2 py-0.5 text-[10px] font-bold text-white">
                  {report.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 py-1 text-right">
                <h3 className="text-sm font-bold text-foreground">
                  {report.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  العمر: {report.age}
                </p>
                <p className="text-xs text-muted-foreground">
                  آخر مكان: {report.lastPlace}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  تاريخ الفقدان: {report.lostDate}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border px-3 py-2.5">
              <button className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-found hover:bg-muted">
                <Share2 className="size-3.5" />
                مشاركة
              </button>
              <span className="text-[11px] text-muted-foreground">
                {report.reportDate}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
