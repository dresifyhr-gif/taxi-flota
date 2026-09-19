"use client";

import {
  BadgeCheck,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  CalendarCheck,
  Headphones,
  Percent,
  PhoneCall,
  MessageSquareText,
  MinusCircle,
  ShieldCheck,
  TimerReset,
  UserRoundPlus,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { AnimateIn, CountUp, PulseDot } from "@/components/animate";
import { ApplicationForm } from "@/components/application-form";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import { blogPosts } from "@/lib/blog";
import { useLanguage } from "@/lib/i18n";

const HeroCity3D = dynamic(() => import("@/components/hero-city-3d"), { ssr: false });

const comparisonRows = [
  { label: "Podrška kroz onboarding", us: true, aggregatori: false, knjigovodstvo: false },
  { label: "Uber & Bolt profili", us: true, aggregatori: true, knjigovodstvo: false },
  { label: "Voditelj voznog parka", us: true, aggregatori: false, knjigovodstvo: false },
  { label: "Najam vozila", us: true, aggregatori: false, knjigovodstvo: false },
  { label: "Fleksibilni sati rada", us: true, aggregatori: false, knjigovodstvo: false },
  { label: "Besplatno savjetovanje", us: true, aggregatori: false, knjigovodstvo: false },
];

const stepIcons = [ClipboardCheck, FileCheck2, ShieldCheck, UserRoundPlus];
const benefitIcons = [BadgeCheck, TimerReset, ClipboardCheck, Handshake, MessageSquareText, ShieldCheck];

export function RouteBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="animate-glow-drift absolute -right-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-[110px]" />
      <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-accent/10 blur-[120px]" />
      <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
        <path className="animate-dash" d="M-40 470 C 220 470, 320 250, 560 250 S 940 120, 1240 150" stroke="rgba(52,209,134,0.4)" strokeWidth="2" />
        <path d="M-40 560 C 260 560, 430 430, 660 430 S 1010 330, 1240 360" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <circle className="animate-pin" cx="560" cy="250" r="6" fill="#34d186" />
        <circle className="animate-pin" cx="220" cy="470" r="5" fill="#34d186" style={{ animationDelay: "1.1s" }} />
        <circle className="animate-pin" cx="1000" cy="150" r="5" fill="#34d186" style={{ animationDelay: "2.1s" }} />
      </svg>
    </div>
  );
}

const cityBuildings: [number, number, number][] = [
  [0, 70, 118], [74, 46, 78], [124, 60, 150], [188, 40, 96], [232, 82, 176],
  [318, 52, 110], [374, 64, 138], [442, 44, 90], [490, 74, 166], [568, 48, 120],
  [620, 70, 188], [694, 50, 100], [748, 84, 154], [836, 46, 124], [886, 66, 146],
  [956, 54, 104], [1014, 80, 172], [1098, 50, 116], [1152, 60, 150],
];

const skyRoute1 = "M-40 250 C 220 250, 320 120, 560 120 S 940 60, 1240 80";
const skyRoute2 = "M-40 330 C 260 330, 430 200, 660 200 S 1010 150, 1240 170";

export function CyberCityBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* zeleni glow */}
      <div className="animate-glow-drift absolute -right-24 -top-28 h-[26rem] w-[26rem] rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -left-16 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

      {/* neonska perspektivna mreža (pod) */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] [perspective:360px]">
        <div
          className="animate-grid absolute inset-0 origin-bottom"
          style={{
            transform: "rotateX(74deg)",
            backgroundImage:
              "linear-gradient(rgba(52,209,134,0.30) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(52,209,134,0.30) 1.5px, transparent 1.5px)",
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to top, #000 6%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to top, #000 6%, transparent 70%)",
          }}
        />
      </div>

      {/* horizont sjaj */}
      <div className="absolute inset-x-0 bottom-[46%] h-24 -translate-y-1/2 bg-gradient-to-t from-accent/15 to-transparent blur-2xl" />
      <div className="absolute inset-x-0 bottom-[46%] h-px bg-accent/40" />

      {/* silueta grada */}
      <div className="absolute inset-x-0 bottom-[46%] h-[20%] min-h-[92px]">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="h-full w-full">
          {cityBuildings.map(([x, w, h], i) => {
            const top = 200 - h;
            return (
              <g key={i}>
                <rect x={x} y={top} width={w} height={h} fill="#0a0f0b" />
                <rect x={x} y={top} width={w} height="2.5" fill="rgba(52,209,134,0.5)" />
                {[0, 1, 2].map((j) => {
                  const wx = x + 8 + ((i * 13 + j * 29) % Math.max(1, w - 16));
                  const wy = top + 10 + ((i * 17 + j * 23) % Math.max(1, h - 20));
                  const flick = (i + j) % 3 === 0;
                  return (
                    <rect
                      key={j}
                      x={wx}
                      y={wy}
                      width="4"
                      height="4"
                      rx="1"
                      fill="#34d186"
                      opacity={flick ? undefined : 0.45}
                      className={flick ? "animate-win" : undefined}
                      style={flick ? { animationDelay: `${((i * 0.3 + j * 0.7) % 3).toFixed(2)}s` } : undefined}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* nebo: rute + auti + pinovi */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <filter id="carGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="animate-dash" d={skyRoute1} stroke="rgba(52,209,134,0.4)" strokeWidth="2" />
        <path d={skyRoute2} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <circle r="3.5" fill="#7defb4" filter="url(#carGlow)">
          <animateMotion dur="7s" repeatCount="indefinite" path={skyRoute1} />
        </circle>
        <circle r="3" fill="#34d186" filter="url(#carGlow)">
          <animateMotion dur="9s" begin="-3s" repeatCount="indefinite" path={skyRoute1} />
        </circle>
        <circle r="3" fill="#34d186" filter="url(#carGlow)">
          <animateMotion dur="11s" begin="-6s" repeatCount="indefinite" path={skyRoute2} />
        </circle>
        <circle className="animate-pin" cx="560" cy="120" r="6" fill="#34d186" />
        <circle className="animate-pin" cx="220" cy="250" r="5" fill="#34d186" style={{ animationDelay: "1.1s" }} />
        <circle className="animate-pin" cx="1000" cy="70" r="5" fill="#34d186" style={{ animationDelay: "2.1s" }} />
      </svg>

      {/* tamni sloj iza teksta radi čitljivosti */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18,24,20,0.5) 0%, rgba(13,18,15,0.88) 30%, rgba(13,18,15,0.82) 52%, rgba(13,18,15,0.3) 73%, rgba(18,24,20,0) 100%)",
        }}
      />
    </div>
  );
}

export function HeroSection() {
  const { t } = useLanguage();
  return (
    <section id="pocetna" className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#04060a]">
      <div className="absolute inset-0 overflow-hidden">
        <HeroCity3D />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,6,10,0.35) 0%, rgba(3,5,7,0.72) 34%, rgba(3,5,7,0.66) 58%, rgba(3,5,7,0.25) 82%, rgba(4,6,10,0) 100%)",
          }}
        />
      </div>
      <Container className="relative w-full">
        <div className="mx-auto max-w-3xl py-16 text-center sm:py-20">
          <AnimateIn direction="none" immediate>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 backdrop-blur">
              <PulseDot />
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">{t.hero_eyebrow}</span>
            </div>
          </AnimateIn>

          <AnimateIn delay={90} immediate>
            <h1 className="mt-6 text-[2rem] font-bold tracking-tight text-white sm:text-5xl lg:text-[4rem]" style={{ lineHeight: 1.05 }}>
              <span className="hero-gradient-dark block pb-1">{t.hero_h1a}</span>
              <span className="mt-1 block text-white/95">{t.hero_h1b} {t.hero_h1c}</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={180} immediate>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">{t.hero_desc}</p>
          </AnimateIn>

          <AnimateIn delay={260} immediate>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/prijava" className="w-full shadow-[0_10px_40px_rgba(52,209,134,0.28)] sm:w-auto">{t.hero_cta1}</ButtonLink>
              <Link
                href="/zatrazi-poziv"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-accent/50 hover:bg-white/10 sm:w-auto"
              >
                <PhoneCall className="h-4 w-4" />
                {t.hero_cta2}
              </Link>
            </div>
          </AnimateIn>

          <AnimateIn delay={340} immediate>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {t.hero_badges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/60">
                  {badge}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}

const avatarPoints = [
  "Direktno primamo vozače u našu flotu",
  "Vodimo te kroz cijeli onboarding bez stresa",
  "Voziš na Uber i Bolt — zarada stiže tjedno",
  "Vozilo možemo osigurati ako ga nemaš",
];

export function AvatarVideoSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* Video */}
          <AnimateIn className="w-full lg:w-1/2">
            <div className="overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]">
              <video
                src="/avatar-video.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full"
              />
            </div>
          </AnimateIn>

          {/* Tekst sa strane */}
          <AnimateIn delay={100} className="w-full lg:w-1/2">
            <span className="inline-flex rounded-full border border-black/10 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Kako funkcionira
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#111] sm:text-3xl lg:text-4xl">
              Klasično knjigovodstvo vodi papire.{" "}
              <span className="text-accent">Mi vodimo tvoj taxi biznis.</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-black/55">
              Ne gubiš vrijeme na papirologiju. Ne moraš ništa znati — FleetHub preuzima cijeli proces od prvog dana.
            </p>
            <ul className="mt-6 space-y-3">
              {avatarPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm leading-6 text-black/70">{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/prijava" className="rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white shadow-none hover:bg-black/85 hover:text-white">
                Prijavi se →
              </ButtonLink>
              <Link
                href="/zatrazi-poziv"
                className="inline-flex items-center gap-2 rounded-2xl border border-black/15 px-6 py-3 text-sm font-bold text-black transition hover:border-accent hover:text-accent"
              >
                <PhoneCall className="h-4 w-4" />
                Zatraži poziv
              </Link>
            </div>
          </AnimateIn>

        </div>
      </Container>
    </section>
  );
}

export function CommissionSection() {
  return (
    <section className="bg-[#0e1512] pb-6">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimateIn direction="up" className="group flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-accent/30">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105">
              <Percent className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold text-white">Provizija 10%</p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                Standardna provizija, transparentno i bez skrivenih troškova.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={100} direction="up" className="group flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-accent/30">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105">
              <CalendarCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-lg font-bold text-white">Isplata svaki tjedan — četvrtkom</p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                Zarada ti sjeda redovito, svaki četvrtak.
              </p>
            </div>
          </AnimateIn>
        </div>
      </Container>
    </section>
  );
}

export function ReferralBonusSection() {
  const steps = [
    { icon: UserRoundPlus, title: "Preporučiš vozača", desc: "Pošalji nam nekoga tko želi voziti." },
    { icon: CarFront, title: "Ostvari 2.000 € prometa", desc: "Vozač kojeg si doveo vozi kroz našu flotu." },
    { icon: BadgeCheck, title: "Dobiješ 100 €", desc: "Bonus isplaćujemo tebi — jednostavno." },
  ];
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <AnimateIn>
          <div className="overflow-hidden rounded-[2rem] bg-[#141d18] px-6 py-9 sm:px-10 sm:py-11">
            <div className="grid items-center gap-9 lg:grid-cols-[1.35fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  <Handshake className="h-4 w-4" /> Bonus za preporuku
                </span>
                <h2 className="mt-4 text-2xl font-bold text-white sm:text-[2rem]" style={{ lineHeight: 1.12 }}>
                  Preporuči vozača i zaradi <span className="text-accent">100&nbsp;€</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Poznaješ nekoga tko želi voziti? Dovedi ga u našu flotu. Čim vozač kojeg si
                  preporučio ostvari 2.000&nbsp;€ neto prometa, isplaćujemo ti 100&nbsp;€ bonusa.
                </p>
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  {steps.map((s) => (
                    <div key={s.title} className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                        <s.icon className="h-5 w-5" />
                      </span>
                      <p className="mt-3 text-sm font-bold text-white">{s.title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full rounded-[1.75rem] border border-accent/25 bg-gradient-to-br from-accent/15 to-transparent px-8 py-9 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">Tvoj bonus</p>
                  <p className="mt-2 text-6xl font-bold text-white sm:text-7xl">100&nbsp;€</p>
                  <p className="mt-2 text-sm text-white/60">po preporučenom vozaču</p>
                  <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-white/45">
                    Isplata nakon što preporučeni vozač ostvari 2.000&nbsp;€ neto prometa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}

export function StatsSection() {
  const { t } = useLanguage();
  const values = [2, 4.9, 20];
  return (
    <section className="bg-[#0e1512] py-6 sm:py-10">
      <Container>
        <AnimateIn>
          <div className="grid grid-cols-3 divide-x divide-white/10 rounded-[1.75rem] border border-white/10 bg-white/[0.03] py-7">
            {t.stats.map((s, i) => (
              <div key={s.label} className="px-2 text-center sm:px-4">
                <p className="text-3xl font-bold text-white sm:text-4xl">
                  <CountUp end={values[i]} suffix={s.suffix} prefix={"prefix" in s ? s.prefix : ""} duration={1800} />
                </p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}

export function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-[#131f16] py-20 text-white sm:py-24">
      <Container>
        <AnimateIn>
          <SectionHeading invert
            eyebrow={t.test_eyebrow}
            title={t.test_title}
            description={t.test_desc}
          />
        </AnimateIn>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {t.testimonials.map((testimonial, i) => (
            <AnimateIn key={testimonial.name} delay={i * 120} direction="up">
              <div className="flex h-full flex-col rounded-[1.75rem] border border-white/8 bg-[#1e2820] p-7">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.stars }).map((_, j) => (
                    <span key={j} className="text-accent">★</span>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-7 text-white/75">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/8 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-white/45">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/8 bg-[#182219] px-6 py-5 text-sm text-white/55">
            <span className="flex items-center gap-2">
              <PulseDot />
              {t.test_social1}
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span>{t.test_social2}<strong className="text-white">{t.test_social2b}</strong></span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span>{t.test_social3}<strong className="text-accent">4.9 / 5.0</strong></span>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}

export function HowItWorksSection({ dark = true }: { dark?: boolean }) {
  const { t } = useLanguage();
  return (
    <section id="kako-radi" className={dark ? "bg-[#131b17] py-20 sm:py-24" : "bg-[#eef0ef] py-20 sm:py-24"}>
      <Container>
        <AnimateIn>
          <SectionHeading
            invert={dark}
            eyebrow={t.how_eyebrow}
            title={t.how_title}
            description={t.how_desc}
          />
        </AnimateIn>
        <AnimateIn delay={100}>
          <div className={`mx-auto mt-8 max-w-3xl rounded-[1.75rem] border border-accent/20 bg-accent/10 p-5 text-center text-sm leading-7 ${dark ? "text-white/70" : "text-black/60"}`}>
            {t.how_info}
          </div>
        </AnimateIn>
        <div className="mt-14 grid gap-5 lg:grid-cols-4">
          {t.steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <AnimateIn key={step.title} delay={index * 100} direction="up">
                <div className={`group h-full rounded-[1.75rem] border p-6 transition-all duration-300 hover:-translate-y-1 ${dark ? "border-white/10 bg-white/[0.04] hover:border-accent/30" : "border-black/8 bg-white hover:border-accent/30"}`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className={`mt-5 text-sm font-semibold uppercase tracking-[0.24em] ${dark ? "text-white/40" : "text-black/40"}`}>{t.how_step} {index + 1}</p>
                  <h3 className={`mt-3 text-xl font-semibold ${dark ? "text-white" : "text-[#111]"}`}>{step.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${dark ? "text-white/60" : "text-black/60"}`}>{step.description}</p>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function BenefitsSection({ dark = true }: { dark?: boolean }) {
  const { t } = useLanguage();
  return (
    <section className={dark ? "bg-[#0e1512] py-20 sm:py-24" : "bg-white py-20 sm:py-24"}>
      <Container>
        <AnimateIn>
          <SectionHeading
            invert={dark}
            eyebrow={t.ben_eyebrow}
            title={t.ben_title}
            description={t.ben_desc}
          />
        </AnimateIn>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.benefits.map((benefit, i) => {
            const Icon = benefitIcons[i];
            return (
              <AnimateIn key={benefit.title} delay={i * 80} direction="up">
                <div className={`group h-full rounded-[1.8rem] border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 ${dark ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]" : "border-black/8 bg-white hover:bg-[#f4f5f4]"}`}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-all duration-300 group-hover:bg-accent/25">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-5 text-xl font-semibold ${dark ? "text-white" : "text-[#111]"}`}>{benefit.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${dark ? "text-white/60" : "text-black/60"}`}>{benefit.description}</p>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function RentalSection() {
  const { t } = useLanguage();
  return (
    <section id="najam" className="overflow-hidden bg-[#131b17] py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            {t.rental_eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.rental_title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/60">{t.rental_desc}</p>
          <ul className="mt-8 space-y-4 text-sm leading-7 text-white/60">
            {t.rental_list.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 rounded-full bg-accent/15 p-1.5 text-accent">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/prijava">{t.rental_cta1}</ButtonLink>
            <Link
              href="/najam-vozila"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/50 hover:bg-white/10"
            >
              {t.rental_cta2}
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-x-10 top-6 h-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="rounded-[1.7rem] border border-white/10 bg-[#0e1512] p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent/15 text-accent">
                  <CarFront className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/40">{t.rental_card_label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{t.rental_card_title}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {t.rental_card_items.map((item) => (
                  <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-white/60">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FaqSection({ dark = true }: { dark?: boolean }) {
  const { t } = useLanguage();
  return (
    <section id="faq" className={dark ? "bg-[#0e1512] py-20 sm:py-24" : "bg-[#f4f5f4] py-20 sm:py-24"}>
      <Container>
        <SectionHeading
          invert={dark}
          eyebrow={t.faq_eyebrow}
          title={t.faq_title}
          description={t.faq_desc}
        />
        <div className="mx-auto mt-14 max-w-4xl space-y-4">
          {t.faqItems.map((item) => (
            <details
              key={item.question}
              className={`group rounded-[1.75rem] border p-6 transition-colors ${dark ? "border-white/10 bg-white/[0.04] open:border-accent/20" : "border-black/8 bg-white"}`}
            >
              <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-semibold ${dark ? "text-white" : "text-[#111]"}`}>
                {item.question}
                <CircleHelp className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-45" />
              </summary>
              <p className={`mt-4 max-w-3xl text-sm leading-7 ${dark ? "text-white/60" : "text-black/60"}`}>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ApplicationSection() {
  const { t } = useLanguage();
  return (
    <section id="prijava" className="bg-[#eef0ef] py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.app_eyebrow}
          title={t.app_title}
          description={t.app_desc}
        />
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="order-2 lg:order-1 rounded-[2rem] bg-white p-8 border border-black/8">
            <h3 className="text-2xl font-semibold text-[#111]">{t.app_prepare}</h3>
            <div className="mt-8 space-y-4">
              {t.app_checklist.map((item) => (
                <div key={item} className="flex gap-3 rounded-3xl border border-black/8 bg-[#f4f5f4] p-4">
                  <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm leading-7 text-black/70">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[1.6rem] border border-black/8 bg-[#f4f5f4] p-5">
              <p className="text-sm font-semibold text-accent">{t.app_privacy_title}</p>
              <p className="mt-3 text-sm leading-7 text-black/70">{t.app_privacy_desc}</p>
            </div>
          </div>
          <div className="order-1 lg:order-2"><ApplicationForm /></div>
        </div>
      </Container>
    </section>
  );
}

export function HomeNavigationSection() {
  const { t } = useLanguage();
  const hrefs = ["/kako-radi", "/rad-kroz-flotu", "/najam-vozila", "/prijava"];
  return (
    <section className="bg-[#f4f5f4] py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.homenav_eyebrow}
          title={t.homenav_title}
          description={t.homenav_desc}
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {t.homenav_pages.map((page, i) => (
            <Link
              key={hrefs[i]}
              href={hrefs[i]}
              className="rounded-[1.8rem] border border-black/8 bg-white p-6 transition hover:-translate-y-0.5 hover:border-black/20"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/40">{t.homenav_label}</p>
              <h3 className="mt-4 text-2xl font-semibold text-[#111]">{page.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/60">{page.description}</p>
              <p className="mt-6 text-sm font-semibold text-black/40">{t.homenav_open}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function BlogPreviewSection() {
  const { t } = useLanguage();
  return (
    <section className="bg-[#131b17] py-20 sm:py-24">
      <Container>
        <SectionHeading
          invert
          eyebrow={t.blog_eyebrow}
          title={t.blog_title}
          description={t.blog_desc}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <AnimateIn key={post.slug} delay={i * 90} direction="up">
              <Link
                href={`/blog/${post.slug}`}
                className="block h-full rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">{post.category}</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{post.excerpt}</p>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {post.date} · {post.readTime}
                </p>
              </Link>
            </AnimateIn>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/blog">{t.blog_cta}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function ContactSection() {
  const { t } = useLanguage();
  return (
    <section id="kontakt" className="bg-[#141d18] py-20 text-white sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
            {t.contact_eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.contact_title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
            {t.contact_desc}
          </p>
          <Link
            href="/zatrazi-poziv"
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-accent px-7 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(52,209,134,0.3)] transition hover:bg-accentDark hover:text-white"
          >
            <PhoneCall className="h-5 w-5" />
            {t.contact_cta_wa}
          </Link>
          <p className="mt-4 text-sm text-white/40">{t.contact_response}</p>
        </div>

        <div className="rounded-[2rem] border border-white/8 bg-white/4 p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-white/35">{t.contact_or}</p>
          <div className="mt-6 space-y-5 text-sm leading-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8">
                <ClipboardCheck className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <p className="text-xs text-white/40">Brza online prijava</p>
                <p className="font-semibold text-white">Treba samo osobna iskaznica</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/8 pt-6">
            <ButtonLink href="/prijava" className="w-full justify-center">
              {t.contact_cta_online}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ComparisonSection() {
  const Da = () => <span className="inline-flex items-center gap-1 font-semibold text-accent"><CheckCircle2 className="h-4 w-4" /> Da</span>;
  const Ne = () => <span className="inline-flex items-center gap-1 text-black/30"><MinusCircle className="h-4 w-4" /> Ne</span>;

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center mb-12">
          <span className="mb-4 inline-flex rounded-full border border-black/10 bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Usporedba
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">Zašto FleetHub?</h2>
          <p className="mt-4 text-base leading-7 text-black/60">Jedino mjesto gdje dobivaš sve — direktan prijem, podršku i jasne uvjete rada od prvog dana.</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-black/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#111] text-white">
                <th className="px-6 py-4 text-left font-semibold">Usluga</th>
                <th className="px-6 py-4 text-center font-bold text-accent">FleetHub</th>
                <th className="px-6 py-4 text-center font-semibold text-white/60">Aggregatori</th>
                <th className="px-6 py-4 text-center font-semibold text-white/60">Klasično knjigovodstvo</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(({ label, us, aggregatori, knjigovodstvo }, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#f9faf9]"}>
                  <td className="px-6 py-4 font-medium text-[#111]">{label}</td>
                  <td className="px-6 py-4 text-center">{us ? <Da /> : <Ne />}</td>
                  <td className="px-6 py-4 text-center">{aggregatori ? <Da /> : <Ne />}</td>
                  <td className="px-6 py-4 text-center">{knjigovodstvo ? <Da /> : <Ne />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-2xl font-bold text-[#111]">Sve ovo za samo <span className="text-accent">80 € / mj</span></p>
          <p className="mt-2 text-sm text-black/50">Bez skrivenih troškova. Otkaz kad god želite.</p>
        </div>
      </Container>
    </section>
  );
}
