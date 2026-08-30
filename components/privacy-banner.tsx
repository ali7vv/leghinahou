import { ShieldCheck } from "lucide-react"

export function PrivacyBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl px-6 py-8 text-center shadow-2xl">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#00B488]/15 text-[#00B488]">
          <ShieldCheck className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-white">خصوصيتك مهمة</h2>
        <p className="max-w-lg text-sm leading-relaxed text-slate-300 text-pretty">
          نحن نحافظ على خصوصية بياناتك ولا نشاركها مع أي جهة بدون إذنك
        </p>
      </div>
    </section>
  )
}