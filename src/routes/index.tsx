import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Menu, X, Calendar, MapPin, Users, Star, Phone, Mail,
  Instagram, Facebook, Music2, MessageCircle, Heart, Building2,
  PartyPopper, Cake, Sparkles, Trophy, Radio, ChevronRight,
  Quote, ArrowRight, Youtube, Headphones, Check, Package, Clock,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import djPortrait from "@/assets/dj-portrait.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    links: [
      { rel: "canonical", href: "https://night-vibe-showcase.lovable.app/" },
    ],
  }),
});

const DJ_NAME = "Vasconi";

const nav = [
  { label: "За мен", href: "#about" },
  { label: "Услуги", href: "#services" },
  { label: "Пакети", href: "#packages" },
  { label: "Времетраене", href: "#duration" },
  { label: "Галерия", href: "#gallery" },
  { label: "Музика", href: "#music" },
  { label: "Събития", href: "#events" },
  { label: "Контакти", href: "#contact" },
];

const genres = ["Поп-фолк", "Бг естрада", "Бг Поп", "Балкански хитове", "Ориенталска", "Фолклор", "Сръбска", "Гръцка", "Ретро балканска"];

const stats = [
  { value: "500+", label: "Изсвирени събития" },
  { value: "10+", label: "Години опит" },
  { value: "100+", label: "Доволни клиенти" },
];

const services = [
  { icon: Heart, title: "Сватби", desc: "Уникален саундтрак, създаден специално за вашата любовна история." },
  { icon: Building2, title: "Корпоративни събития", desc: "Изтънчена атмосфера за брандови представяния, галавечери и конференции." },
  { icon: PartyPopper, title: "Частни партита", desc: "Интимна енергия за най-важните гости." },
  { icon: Cake, title: "Рождени дни", desc: "От детски празници до кръгли годишнини — незабравими вечери." },
  { icon: Radio, title: "Клубове", desc: "Резиденции в пиково време с фирмени сетове през различни жанрове." },
  { icon: Sparkles, title: "Фестивали", desc: "Енергия за главна сцена, създадена за големи тълпи." },
  { icon: Trophy, title: "Луксозни събития", desc: "Яхти, вили, пентхауси — дискретна, висок клас продукция." },
];

const gallery = [
  { src: g2, alt: "Фестивална публика с конфети и лазери", h: "row-span-2" },
  { src: g1, alt: "DJ пулт в едър план с неонови светлини" },
  { src: g3, alt: "Луксозна сватбена вечер с DJ бут" },
  { src: g4, alt: "Лазерно шоу в нощен клуб", h: "row-span-2" },
  { src: g5, alt: "Силует на DJ на фестивална сцена" },
  { src: g6, alt: "Корпоративна галавечер" },
];

const videos = [
  { id: "1", title: "Sunset Set — Черноморец 2025", views: "1.2M гледания", ytId: "5qap5aO4i9A" },
  { id: "2", title: "Сватбен highlight — Арбанаси", views: "384K гледания", ytId: "jfKfPfyJRdk" },
  { id: "3", title: "SPICE Music Festival — Warm-up", views: "2.4M гледания", ytId: "MYPVQccHhAQ" },
];

const events = [
  { date: "14 МАР", city: "София", venue: "Sofia Live Club", type: "Клубна резиденция" },
  { date: "02 АПР", city: "Пловдив", venue: "Хотел Империал — частна сватба", type: "Сватба" },
  { date: "18 МАЙ", city: "Варна", venue: "Гранд Хотел Варна", type: "Луксозно събитие" },
  { date: "21 ЮЛ", city: "Бургас", venue: "SPICE Music Festival", type: "Фестивал" },
  { date: "09 АВГ", city: "Слънчев бряг", venue: "Cacao Beach Club", type: "Клуб" },
];

const testimonials = [
  { name: "София и Марто", role: "Сватба — Арбанаси", text: "Vasconi усети публиката магически. Гостите ни не слязоха от дансинга. Всеки детайл беше перфектен.", rating: 5 },
  { name: "Даниел Ченев", role: "CEO, Нортуинд БГ", text: "Наехме го за откриваща галавечер. Изтънчен, точен, а енергията беше на следващо ниво.", rating: 5 },
  { name: "Елена Русева", role: "Event Planner", text: "Най-надеждният и талантлив DJ, с когото съм работила. Клиентите ми постоянно го търсят.", rating: 5 },
  { name: "Явор Стоянов", role: "Рожден ден — София", text: "Превърна частна вечеря в партито на годината. Ненадминат подбор на музика.", rating: 5 },
];

// ---------- Reusable primitives ----------

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center mb-14">
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-4 font-[Space_Grotesk] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

// ---------- Sections ----------

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all ${scrolled ? "glass" : ""}`}>
          <a href="#top" className="flex items-center gap-2 font-[Space_Grotesk] text-xl font-bold tracking-widest">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] text-primary-foreground">
              <Headphones className="h-4 w-4" />
            </span>
            <span>DJ <span className="text-gradient">{DJ_NAME}</span></span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-[oklch(0.72_0.22_240)] after:to-[oklch(0.68_0.26_300)] hover:after:w-full after:transition-all">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#booking" className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
            Резервирай <ArrowRight className="h-4 w-4" />
          </a>
          <button onClick={() => setOpen(true)} className="md:hidden p-2 text-foreground" aria-label="Отвори меню">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between p-6">
              <span className="font-[Space_Grotesk] text-xl font-bold">DJ {DJ_NAME}</span>
              <button onClick={() => setOpen(false)} aria-label="Затвори меню"><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex flex-col items-center gap-6 pt-10">
              {nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-2xl font-[Space_Grotesk] font-semibold">
                  {n.label}
                </a>
              ))}
              <a href="#booking" onClick={() => setOpen(false)} className="mt-4 rounded-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] px-8 py-3 font-semibold text-primary-foreground">
                Резервирай
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  return (
      <section id="top" ref={ref} className="relative min-h-[100dvh] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={heroImg} alt="DJ по време на изява пред публика" width={1920} height={1080} className="h-full w-full object-cover scale-110" />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </motion.div>

      {/* animated glow orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[oklch(0.7_0.24_240)]/30 blur-3xl" style={{ animation: "float-slow 8s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[oklch(0.68_0.26_300)]/30 blur-3xl" style={{ animation: "float-slow 10s ease-in-out infinite" }} />

      <motion.div style={{ opacity }} className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" style={{ animation: "pulse-glow 2s infinite" }} />
          Резервации за 2026
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 font-[Space_Grotesk] text-[18vw] md:text-[12rem] leading-[0.9] font-bold tracking-tighter"
        >
          DJ <span className="text-gradient">{DJ_NAME}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 max-w-2xl text-sm md:text-lg text-muted-foreground uppercase tracking-[0.25em]"
        >
          Професионален DJ · Сватби · Частни събития · Клубове · Корпоративни партита
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#booking" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_oklch(0.72_0.22_285/0.5)] hover:scale-105 transition">
            Резервирай дата
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-col items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
          <span>Скрол</span>
          <div className="h-10 w-px bg-gradient-to-b from-foreground/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...genres, ...genres, ...genres];
  return (
    <div className="relative overflow-hidden border-y border-border/50 bg-card/30 py-6">
      <div className="flex gap-12 whitespace-nowrap" style={{ animation: "marquee 30s linear infinite", width: "max-content" }}>
        {items.map((g, i) => (
          <span key={i} className="flex items-center gap-12 text-2xl md:text-3xl font-[Space_Grotesk] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {g}
            <Sparkles className="h-4 w-4 text-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="relative py-28 px-4">
      <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[oklch(0.72_0.22_240)]/30 to-[oklch(0.68_0.26_300)]/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img src={djPortrait} alt="DJ Vasconi portrait" width={900} height={1200} loading="lazy" className="w-full h-auto object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-5 shadow-[var(--shadow-glass)]">
            <div className="text-3xl font-[Space_Grotesk] font-bold text-gradient">10+</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Години на сцена</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> За мен
          </div>
          <h2 className="mt-4 font-[Space_Grotesk] text-4xl md:text-5xl font-bold tracking-tight">
            Звук, който <span className="text-gradient">движи залите.</span>
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
Vasconi е един от най-търсените DJ-и в България, който смесва ъндърграунд енергия с блясъка на голямата сцена.
            От интимни сватби в Арбанаси и Пловдив, през sunrise сетове по Черноморието, до корпоративни галавечери
            в София — сетовете му са създадени с една цел: да държат дансинга пълен.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            10+ години опит, 40 000+ песни и доказан усет към настроението на публиката.
            Музика, подбрана специално за вашето събитие.
          </p>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Жанрове</div>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span key={g} className="rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-sm text-foreground/90 hover:border-accent hover:text-accent transition-colors">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <div className="text-2xl md:text-3xl font-[Space_Grotesk] font-bold text-gradient">{s.value}</div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative py-28 px-4">
      <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Услуги" title="Създадено за всеки повод" subtitle="Персонализирана продукция за моментите, които наистина имат значение." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl hover:border-accent/60 transition-all hover:-translate-y-2"
            >
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-[oklch(0.72_0.22_240)]/0 to-[oklch(0.68_0.26_300)]/0 blur-3xl group-hover:from-[oklch(0.72_0.22_240)]/40 group-hover:to-[oklch(0.68_0.26_300)]/30 transition-all duration-500" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.22_240)]/20 to-[oklch(0.68_0.26_300)]/20 text-accent group-hover:scale-110 transition-transform">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-[Space_Grotesk] text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                  Запитване <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages() {
  const included = [
    "Основно озвучаване",
    "Безплатен транспорт в рамките на гр. София",
    "1 специален ефект, комплимент от нас",
  ];

  const extras = [
    "Сценично осветление",
    "Светлинно оформление на залата",
    "Хейз машина",
    "Машина за балончета",
    "Фонтани със студени (безопасни) искри",
    "Файър машини (само за външни партита)",
    "Машина за тежък дим",
    "Професионален водещ на събития",
    "Гост музикант — саксофон (три сета по 20 мин.)",
    "Гост музикант — рототони (договаря се на час)",
  ];

  return (
    <section id="packages" className="relative py-28 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Пакети"
          title="Основен"
          subtitle="Всичко необходимо за страхотно събитие, с възможност да добавите допълнителни ефекти според бюджета."
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/40 p-8 md:p-12 backdrop-blur-xl"
        >
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[oklch(0.72_0.22_240)]/30 to-[oklch(0.68_0.26_300)]/20 blur-[100px]" />
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.22_240)]/20 to-[oklch(0.68_0.26_300)]/20 text-accent">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-[Space_Grotesk] text-2xl md:text-3xl font-bold">Пакет „Основен"</h3>
                  <p className="text-sm text-muted-foreground">Идеален за сватби, рождени дни и корпоративни събития.</p>
                </div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Цена</div>
                <div className="text-xl font-bold text-accent">По запитване</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground/90">Включено в пакета</h4>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                        <Check className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground/90">Допълнителни опции</h4>
                <ul className="space-y-3">
                  {extras.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/30 text-accent">
                        <Sparkles className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-accent/20 bg-accent/5 p-5 md:p-6">
              <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
                За ваше удобство можете сами да изберете какво да включва допълнителният пакет, в зависимост от бюджета. За цени ще се свържем с вас в рамките на <span className="font-semibold text-accent">един час</span> след подаване на запитването!
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">Безплатен транспорт в София · Гъвкави допълнения</p>
              <a
                href="#booking"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_oklch(0.72_0.22_285/0.35)] hover:scale-105 transition"
              >
                Запитване за оферта <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DurationSection() {
  const durations = [
    {
      icon: Heart,
      title: "Сватби",
      hours: "6",
      label: "астрономически часа",
      desc: "Пълен звуков и светлинен сет, включващ подготовка, коктейл, вечеря и купон до късно.",
    },
    {
      icon: PartyPopper,
      title: "Други събития и частни партита",
      hours: "5",
      label: "астрономически часа",
      desc: "Рождени дни, корпоративни партита, клубни вечери и частни празненства.",
    },
  ];

  return (
    <section id="duration" className="relative py-28 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Времетраене"
          title="Колко време включва всяка оферта"
          subtitle="Ясни рамки, без изненади. Всичко извън посоченото време се таксува допълнително на започнат час."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {durations.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-8 md:p-10 backdrop-blur-xl"
            >
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-[oklch(0.72_0.22_240)]/20 to-[oklch(0.68_0.26_300)]/20 blur-[80px]" />
              <div className="relative flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.22_240)]/20 to-[oklch(0.68_0.26_300)]/20 text-accent">
                  <d.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-[Space_Grotesk] text-xl font-semibold">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
                </div>
              </div>
              <div className="relative mt-8 flex items-baseline gap-2">
                <span className="font-[Space_Grotesk] text-5xl md:text-6xl font-bold text-gradient">{d.hours}</span>
                <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">{d.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-5 md:p-6"
        >
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 shrink-0 text-accent mt-0.5" />
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              Всичко извън посоченото време е допълнително и се таксува отделно, <span className="font-semibold text-accent">на започнат час</span>!
              За точна оферта за удължаване, попитайте при запитването или директно на телефона.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <section id="gallery" className="relative py-28 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Галерия" title="Иззад пулта" subtitle="Поглед към последните вечери, сватби и фестивални сцени." />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
          {gallery.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setLightbox(img.src)}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 ${img.h || ""}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-background/0 opacity-0 group-hover:opacity-100 transition" />
              <div className="absolute bottom-3 left-3 right-3 text-left text-xs text-white/90 opacity-0 group-hover:opacity-100 transition">
                {img.alt}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-background/90 backdrop-blur-xl p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 rounded-full glass p-3" aria-label="Затвори">
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightbox} alt="" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Videos() {
  return (
    <section id="videos" className="relative py-28 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Видеа" title="Живи сетове и акценти" />
        <div className="grid gap-6 md:grid-cols-3">
          {videos.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl hover:border-accent/60 transition"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.ytId}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="p-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-[Space_Grotesk] text-lg font-semibold">{v.title}</h3>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{v.views}</div>
                </div>
                <Youtube className="h-5 w-5 text-accent shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MusicSection() {
  return (
    <section id="music" className="relative py-28 px-4">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Музика" title="Чуй" subtitle="Авторски миксове и подбрани плейлисти." />
        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl mx-auto w-full max-w-3xl"
          >
            <div className="p-5 flex items-center gap-3 border-b border-border/60">
              <Music2 className="h-5 w-5 text-accent" />
              <div className="font-[Space_Grotesk] font-semibold">Spotify — DJ Vasconi Essentials</div>
            </div>
            <iframe
              title="Spotify playlist"
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0"
              width="100%"
              height="400"
              frameBorder="0"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Events() {
  return (
    <section id="events" className="relative py-28 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Тур" title="Предстоящи събития" subtitle="Хвани сет из България този сезон." />
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent md:-translate-x-1/2" />
          <div className="space-y-8">
            {events.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative md:grid md:grid-cols-2 md:gap-10 items-center ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}
              >
                <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-to-br from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] neon-glow" />
                <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:pl-10"}`}>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-widest">
                      <Calendar className="h-3.5 w-3.5" /> {e.date}
                    </div>
                    <h3 className="mt-2 font-[Space_Grotesk] text-xl font-semibold">{e.venue}</h3>
                    <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2 md:justify-inherit">
                      <MapPin className="h-3.5 w-3.5" /> {e.city} · {e.type}
                    </div>
                  </div>
                </div>
                <div />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="testimonials" className="relative py-28 px-4">
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeader eyebrow="Отзиви" title="Одобрено от дансинга" />
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-3xl p-8 md:p-12"
            >
              <Quote className="mx-auto h-8 w-8 text-accent" />
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: testimonials[i].rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-6 text-lg md:text-2xl font-[Space_Grotesk] leading-snug">
                &ldquo;{testimonials[i].text}&rdquo;
              </p>
              <div className="mt-6 text-sm">
                <div className="font-semibold">{testimonials[i].name}</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">{testimonials[i].role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, k) => (
            <button
              key={k} onClick={() => setI(k)}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-accent" : "w-1.5 bg-muted-foreground/30"}`}
              aria-label={`Testimonial ${k + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Booking ----------

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Името е задължително").max(80),
  email: z.string().trim().email("Невалиден имейл").max(120),
  phone: z.string().trim().min(6, "Телефонът е задължителен").max(30),
  eventType: z.string().min(1, "Избери тип събитие"),
  date: z.string().min(1, "Избери дата"),
  location: z.string().trim().min(2, "Локацията е задължителна").max(120),
  guests: z.string().min(1, "Задължително"),
  budget: z.string().min(1, "Избери бюджет"),
  message: z.string().trim().max(1000).optional(),
});
type BookingValues = z.infer<typeof bookingSchema>;

function Booking() {
  const {
    register, handleSubmit, reset, formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<BookingValues>({ resolver: zodResolver(bookingSchema) });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: BookingValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let payload: Record<string, unknown> = {};
      const text = await res.text();
      if (text) {
        try {
          payload = JSON.parse(text) as Record<string, unknown>;
        } catch {
          payload = {};
        }
      }

      if (!res.ok || payload.ok === false) {
        throw new Error((payload as Record<string, unknown>).error ? String((payload as Record<string, unknown>).error) : "send_failed");
      }

      reset();
    } catch (err) {
      console.error("Booking submit failed", err);
      setSubmitError("Възникна грешка при изпращането. Моля, опитайте отново или ни пишете на service@djvasconi.bg.");
    }
  };

  const input = "w-full rounded-xl border border-border bg-card/40 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition";
  const label = "text-xs uppercase tracking-widest text-muted-foreground mb-2 block";

  return (
    <section id="booking" className="relative py-28 px-4">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Резервация" title="Запази своята дата" subtitle="Разкажи ми за събитието и ще се свържа с теб до 24 часа." />
        <motion.form
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="glass rounded-3xl p-6 md:p-10 grid gap-5 md:grid-cols-2"
          noValidate
        >
          {/* Honeypot против ботове — трябва да остане празно */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("company" as never)}
            className="hidden"
            aria-hidden="true"
          />
          <div>
            <label className={label} htmlFor="name">Име и фамилия</label>
            <input id="name" {...register("name")} className={input} placeholder="Иван Иванов" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="email">Имейл</label>
            <input id="email" type="email" {...register("email")} className={input} placeholder="ivan@example.bg" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="phone">Телефон</label>
            <input id="phone" {...register("phone")} className={input} placeholder="+359 877 333 500" />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="eventType">Тип събитие</label>
            <select id="eventType" {...register("eventType")} defaultValue="" className={input}>
              <option value="" disabled>Избери…</option>
              {["Сватба", "Корпоративно", "Частно парти", "Рожден ден", "Клуб", "Фестивал", "Луксозно събитие"].map(o => <option key={o}>{o}</option>)}
            </select>
            {errors.eventType && <p className="mt-1 text-xs text-destructive">{errors.eventType.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="date">Дата на събитието</label>
            <input id="date" type="date" {...register("date")} className={input} />
            {errors.date && <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="location">Локация</label>
            <input id="location" {...register("location")} className={input} placeholder="Град, зала" />
            {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="guests">Гости</label>
            <select id="guests" {...register("guests")} defaultValue="" className={input}>
              <option value="" disabled>Избери…</option>
              {["<50", "50–150", "150–500", "500–1500", "1500+"].map(o => <option key={o}>{o}</option>)}
            </select>
            {errors.guests && <p className="mt-1 text-xs text-destructive">{errors.guests.message}</p>}
          </div>
          <div>
            <label className={label} htmlFor="budget">Бюджет</label>
            <select id="budget" {...register("budget")} defaultValue="" className={input}>
              <option value="" disabled>Избери…</option>
              {["< 500 €", "500 – 1 500 €", "1 500 – 3 000 €", "3 000 – 6 000 €", "6 000+ €"].map(o => <option key={o}>{o}</option>)}
            </select>
            {errors.budget && <p className="mt-1 text-xs text-destructive">{errors.budget.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className={label} htmlFor="message">Съобщение</label>
            <textarea id="message" rows={4} {...register("message")} className={input} placeholder="Разкажи за събитието, атмосферата, задължителни песни…" />
          </div>
          <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-4">
            <div className="text-xs text-muted-foreground">
              {submitError
                ? <span className="text-destructive">{submitError}</span>
                : "Отговор до 24 часа · Депозит запазва датата."}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_40px_oklch(0.72_0.22_285/0.4)] hover:scale-105 transition disabled:opacity-60"
            >
              {isSubmitting ? "Изпращане…" : isSubmitSuccessful ? "Изпратено ✓" : "Изпрати запитване"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Contact() {
  const items = [
    { icon: Phone, label: "Телефон", value: "+359 877 333 500", href: "tel:+359877333500" },
    { icon: Mail, label: "Имейл", value: "service@djvasconi.bg", href: "mailto:service@djvasconi.bg" },
    { icon: MessageCircle, label: "WhatsApp", value: "Пиши в WhatsApp", href: "https://wa.me/359877333500" },
    { icon: Instagram, label: "Instagram", value: "@djvasconi", href: "https://instagram.com/djvasconi" },
    { icon: Facebook, label: "Facebook", value: "/djvasconiofficial", href: "https://facebook.com/djvasconiofficial" },
    { icon: Music2, label: "TikTok", value: "@djvasconi", href: "https://www.tiktok.com/@djvasconi" },
  ];
  return (
    <section id="contact" className="relative py-28 px-4">
      <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2 items-stretch">
        <div>
          <SectionHeader eyebrow="Контакти" title="Свържи се с мен" />
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("mailto:") || c.href.startsWith("tel:") ? "_self" : "_self"}
                rel="noopener noreferrer"
                className="group glass rounded-2xl p-5 flex items-center gap-4 hover:border-accent transition"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.22_240)]/20 to-[oklch(0.68_0.26_300)]/20 text-accent">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="text-sm font-medium truncate">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border/60 min-h-[420px]">
          <iframe
            title="Карта на локация"
            className="h-full w-full grayscale contrast-125 invert"
            style={{ colorScheme: "dark" }}
            src="https://www.google.com/maps?q=Sofia,%20Bulgaria&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-3 items-center">
        <div>
          <div className="flex items-center gap-2 font-[Space_Grotesk] text-xl font-bold tracking-widest">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.72_0.22_240)] to-[oklch(0.68_0.26_300)] text-primary-foreground">
              <Headphones className="h-4 w-4" />
            </span>
            DJ <span className="text-gradient">{DJ_NAME}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">Професионален DJ за сватби, частни събития, клубове и фестивали в цяла България.</p>
        </div>
        <div className="flex justify-center gap-4">
          {[Instagram, Facebook, Youtube, Music2, MessageCircle].map((Icon, i) => {
            const hrefs = [
              "https://instagram.com/djvasconi",
              "https://facebook.com/djvasconiofficial",
              "https://www.youtube.com/@djvasconi",
             "https://www.tiktok.com/@djvasconi",
              "https://wa.me/359877333500",
            ];
            return (
              <a
                key={i}
                href={hrefs[i]}
               target="_self"
                rel="noopener noreferrer"
               className="grid h-10 w-10 place-items-center rounded-full glass hover:text-accent transition"
               aria-label="social"
             >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
        <div className="flex md:justify-end items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Поверителност</a>
          <a href="#" className="hover:text-foreground">Условия</a>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} DJ {DJ_NAME}. Всички права запазени.</div>
          <div>Създадено за дансинга.</div>
        </div>
      </div>
    </footer>
  );
}

export function Index() {
  return (
    <main className="relative overflow-x-hidden bg-background text-foreground">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-[oklch(0.7_0.24_240)]/10 blur-[120px]" />
        <div className="absolute top-[60%] right-[5%] h-[500px] w-[500px] rounded-full bg-[oklch(0.68_0.26_300)]/10 blur-[120px]" />
      </div>
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Packages />
      <DurationSection />
      <Gallery />
      <Videos />
      <MusicSection />
      <Events />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
    </main>
  );
}
