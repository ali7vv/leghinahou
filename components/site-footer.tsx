import { Logo } from "@/components/logo"

const columns = [
  {
    title: "المنصة",
    links: ["الرئيسية", "عن لقيناهو", "كيف نعمل", "أسئلة شائعة"],
  },
  {
    title: "روابط سريعة",
    links: ["البحث عن شخص", "أبلغ عن مفقود", "أحدث البلاغات", "تواصل معنا"],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-foreground/70 text-pretty">
            منصة سودانية تساعد في البحث عن الأشخاص المفقودين والعثور عليهم
            وإعادتهم إلى ذويهم.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-bold">{col.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-brand-foreground/70 transition-colors hover:text-brand-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-foreground/60">
        جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لقيناهو
      </div>
    </footer>
  )
}
