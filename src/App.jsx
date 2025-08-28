import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

/**
 * Trendy Landing – 2-field form (First name + single contact field)
 * - Accepts Email OR Phone/WhatsApp OR Telegram (@handle or t.me link)
 * - Auto-detects contact method and routes to Danke page with correct VIA
 * - DE / EN / DE-CH supported
 * - Minimal friction, hero-focused, social proof, trust badges
 *
 * NOTE: If you use Web3Forms, set your access key below.
 */
const WEB3FORMS_ACCESS_KEY = ""; // <-- set your Web3Forms Access Key (optional but recommended)

const SITE = {
  brand: "Baccarat Entertainment",
  subbrand: "by Romano",
  primaryGradient: "from-fuchsia-600 via-rose-500 to-amber-400",
  formEndpoint: "https://api.web3forms.com/submit", // or your webhook/Formspree endpoint
  contactEmail: "info@baccarat.allerleieiei.com",
  whatsappLink: "https://wa.me/41792154270?text=Hoi%20Romano%2C%20ich%20komme%20vom%20QR-Code%20(Baccarat)%20und%20m%C3%B6chte%20starten.%20Mein%20Name%3A%20",
  telegramLink: "https://t.me/allerleieiei",
  legalCompany: "Baccarat Entertainment by Allerleieiei",
  legalAddress: "Zürich, Schweiz",
};

const I18N = {
  de: {
    nav: { start: "Start", info: "Info", legal: "Rechtliches", whatsapp: "WhatsApp", telegram: "Telegram" },
    heroBadge: "2 Felder · 30 Sekunden",
    heroTitle: (brand) => `Starte jetzt mit ${brand}`,
    heroText: "Vorname + dein bevorzugter Kontakt – wir melden uns persönlich.",
    cta: "Kostenlos & unverbindlich eintragen",
    form: {
      firstName: "Vorname",
      contact: "E‑Mail / Telefon / Telegram",
      consent: (email) => ({
        label: "Ich bin einverstanden, dass meine Angaben zur Kontaktaufnahme gespeichert werden.",
        more: `Datenschutz-Kurzinfo bei Fragen: ${email}`,
        error: "Bitte den Datenschutzhinweis bestätigen.",
      }),
      submit: "Jetzt eintragen",
      successTip: "Tipp: Speichere unsere Nummer, damit die Nachricht sicher ankommt.",
      age: (brand) => `Hinweis: ${brand} ist Unterhaltung, keine Finanzanlage. Keine Gewinn­garantie. Teilnahme ab 18 Jahren – spiele verantwortungsbewusst.`,
      contactError: "Bitte eine gültige E‑Mail, Telefonnummer oder Telegram‑Handle angeben.",
    },
    proof: { p1: "Hunderte Teilnehmende", p2: "Transparente Updates", p3: "Community‑Support" },
    bullets: [
      { title: "Einfach starten", text: "Nur 2 Felder. Wir melden uns persönlich." },
      { title: "Klar & transparent", text: "Klare Regeln, keine falschen Versprechen." },
      { title: "Community", text: "Lerne gemeinsam – Austausch & Support." },
    ],
    thanks: (name, via) => ({
      title: `Merci, ${name}! 🎉`,
      line: `Wir melden uns zeitnah via ${via}.`,
      moreInfo: "Mehr über uns",
    }),
    info: {
      title: (brand) => `So funktioniert ${brand}`,
      p1: (brand) => `${brand} ist Community‑basierte Unterhaltung rund um Baccarat mit Fokus auf Disziplin statt Spekulation.`,
      expect: "Was du erwarten kannst",
      expectList: [
        "Regelmäßige Updates (5×/Woche).",
        "Flexible Auszahlungen oder Re‑Stake.",
        "Klare Stop‑Loss & Tagesziele.",
        "Optionales Empfehlungssystem.",
      ],
      next: "Nächste Schritte",
      nextList: ["Eintragen", "Kurze Einführung", "In Ruhe entscheiden"],
    },
    legal: {
      title: "Rechtliches & Datenschutz",
      privacy: (email) => `Deine Angaben werden ausschließlich zur Kontaktaufnahme genutzt. Keine Weitergabe/Verkauf. Löschung jederzeit per E‑Mail an ${email}.`,
      disclaimer: "Unterhaltung – keine Finanzanlage. Keine Gewinn‑Garantie. Teilnahme ab 18.",
    },
    buttons: { info: "Zur Info", signup: "Zur Anmeldung", emailUs: "Fragen? E‑Mail", whatsapp: "WhatsApp", telegram: "Telegram" },
    via: { email: "E‑Mail", phone: "Telefon/WhatsApp", telegram: "Telegram" },
  },
  ch: {
    nav: { start: "Start", info: "Info", legal: "Rechtlichs", whatsapp: "WhatsApp", telegram: "Telegram" },
    heroBadge: "2 Fälder · 30 Sek.",
    heroTitle: (brand) => `Start mit ${brand}`,
    heroText: "Vorname + diner liebschte Kontakt – mir melded üüs persönlich.",
    cta: "Gratis & unverbindlich iitrage",
    form: {
      firstName: "Vorname",
      contact: "E‑Mail / Telefon / Telegram",
      consent: (email) => ({
        label: "Ich bi iiverstande, dass mini Aagabe für d'Kontakt gspeichert wärde.",
        more: `Kurz‑Datenschutz: Fragä a ${email}`,
        error: "Bitte Datenschutz bestätige.",
      }),
      submit: "Jetzt iitrage",
      successTip: "Tipp: Speicher üsi Nummer, so chunt d'Nachricht aa.",
      age: (brand) => `Hinwiis: ${brand} isch Unterhaltung, kei Anlage. Kei Gewinn‑Garantie. Nume ab 18 – bitte verantwortigsvoll.`,
      contactError: "Bitte gültigi E‑Mail, Tel‑Nummer oder Telegram‑Handle aage.",
    },
    proof: { p1: "Hundert+ Mitgliider", p2: "Transparent", p3: "Support" },
    bullets: [
      { title: "Eifach", text: "Nur 2 Fälder. Mir melded üüs." },
      { title: "Klar", text: "Klare Regle, kei Luftschlösser." },
      { title: "Community", text: "Zäme besser werde." },
    ],
    thanks: (name, via) => ({ title: `Merci, ${name}! 🎉`, line: `Mir melded üüs bald per ${via}.`, moreInfo: "Meh über üüs" }),
    info: {
      title: (brand) => `So laufts bi ${brand}`,
      p1: (brand) => `${brand} isch Community‑Unterhaltig rund um Baccarat mit Disziplin im Fokus.`,
      expect: "Was chasch erwarte",
      expectList: ["Updates 5×/Wuche", "Uuszahlige oder Re‑Stake", "Stop‑Loss & Ziel", "Option Empfehlig"],
      next: "Nächsti Schritt",
      nextList: ["Iitrage", "Churzii Intro", "I Rueh entscheide"],
    },
    legal: {
      title: "Rechtlichs & Datenschutz",
      privacy: (email) => `Dini Date nume für d'Kontakt. Kei Witergab. Löschig jedi Zyyt per Mail a ${email}.`,
      disclaimer: "Unterhaltig – kei Anlage. Kei Garantie. Nume ab 18.",
    },
    buttons: { info: "Zur Info", signup: "Zur Aamäldig", emailUs: "Fragä? Mail", whatsapp: "WhatsApp", telegram: "Telegram" },
    via: { email: "E‑Mail", phone: "Telefon/WhatsApp", telegram: "Telegram" },
  },
  en: {
    nav: { start: "Start", info: "Info", legal: "Legal", whatsapp: "WhatsApp", telegram: "Telegram" },
    heroBadge: "2 fields · 30 seconds",
    heroTitle: (brand) => `Get started with ${brand}`,
    heroText: "First name + your preferred contact – we'll reach out personally.",
    cta: "Join (free & no obligation)",
    form: {
      firstName: "First name",
      contact: "Email / Phone / Telegram",
      consent: (email) => ({
        label: "I agree my details are stored to contact me.",
        more: `Privacy quick note: questions → ${email}`,
        error: "Please accept the privacy notice.",
      }),
      submit: "Sign up",
      successTip: "Tip: Save our number so the message arrives.",
      age: (brand) => `Note: ${brand} is entertainment, not an investment. No profit guarantee. 18+ only – play responsibly.`,
      contactError: "Please enter a valid email, phone, or Telegram handle.",
    },
    proof: { p1: "Hundreds of members", p2: "Transparent updates", p3: "Community support" },
    bullets: [
      { title: "Frictionless", text: "Only 2 fields. We reach out personally." },
      { title: "Clear & honest", text: "Disciplined approach, no hype." },
      { title: "Community", text: "Learn together, get support." },
    ],
    thanks: (name, via) => ({ title: `Thank you, ${name}! 🎉`, line: `We'll reach out via ${via}.`, moreInfo: "More about us" }),
    info: {
      title: (brand) => `How ${brand} works`,
      p1: (brand) => `${brand} is community-based entertainment around Baccarat with discipline over speculation.`,
      expect: "What to expect",
      expectList: ["Updates 5×/week", "Withdraw or re‑stake", "Stop‑loss & goals", "Optional referrals"],
      next: "Next steps",
      nextList: ["Sign up", "Short intro", "Decide calmly"],
    },
    legal: {
      title: "Legal & Privacy",
      privacy: (email) => `Your data is only used to contact you. No selling/sharing. You can request deletion anytime via ${email}.`,
      disclaimer: "Entertainment – not an investment. No profit guarantee. 18+.",
    },
    buttons: { info: "Go to Info", signup: "Go to signup", emailUs: "Questions? Email", whatsapp: "WhatsApp", telegram: "Telegram" },
    via: { email: "Email", phone: "Phone/WhatsApp", telegram: "Telegram" },
  },
};

const LangContext = createContext({ lang: "de", setLang: () => {} });
const useLang = () => useContext(LangContext);
const useQuery = () => new URLSearchParams(useLocation().search);

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 md:px-6 ${className}`}>{children}</div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
    {children}
  </span>
);

const Input = ({ label, id, type = "text", required, placeholder, value, onChange, autoComplete }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-white/80">
      {label} {required && <span className="text-rose-300">*</span>}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl bg-white/10 focus:bg-white/15 border border-white/20 focus:border-white/40 outline-none px-4 py-3 text-white placeholder-white/60 shadow-sm transition"
    />
  </div>
);

const Checkbox = ({ id, checked, onChange, children }) => (
  <label htmlFor={id} className="flex items-start gap-3 select-none cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 h-5 w-5 rounded-md border-white/30 bg-white/10 text-white accent-white"
    />
    <span className="text-sm text-white/80">{children}</span>
  </label>
);

// Contact detection
function detectContact(raw) {
  const v = (raw || "").trim();
  if (!v) return { method: null, normalized: "" };
  const email = /\S+@\S+\.\S+/.test(v);
  const telegram = v.startsWith("@") || v.includes("t.me/") || v.includes("telegram.me/");
  const digits = v.replace(/[^\d+]/g, ""); // allow + and numbers
  const phone = !email && !telegram && (digits.startsWith("+") ? digits.length >= 8 : digits.length >= 7);
  if (email) return { method: "email", normalized: v };
  if (telegram) {
    const handle = v.replace(/^.*(@|t\.me\/|telegram\.me\/)/, "@").replace(/^(@?)/, "@");
    return { method: "telegram", normalized: handle };
  }
  if (phone) return { method: "phone", normalized: digits };
  if (/^@?[\w\d_]{3,}$/.test(v)) return { method: "telegram", normalized: v.startsWith("@") ? v : "@"+v };
  return { method: null, normalized: v };
}

const Shell = ({ children }) => {
  const { lang, setLang } = useLang();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-600/30 via-rose-500/30 to-amber-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-amber-400/20 via-fuchsia-600/20 to-cyan-400/20 blur-3xl" />

      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
        <Container className="py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${SITE.primaryGradient} shadow-lg group-hover:scale-105 transition`} />
            <div>
              <div className="text-xs uppercase tracking-widest text-white/70">{SITE.subbrand}</div>
              <div className="text-xl font-semibold">{SITE.brand}</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-white/80 hover:text-white">{I18N[lang].nav.start}</Link>
            <Link to="/info" className="text-white/80 hover:text-white">{I18N[lang].nav.info}</Link>
            <Link to="/legal" className="text-white/80 hover:text-white">{I18N[lang].nav.legal}</Link>
            <a href={SITE.whatsappLink} className="rounded-xl border border-white/20 px-3 py-1.5 bg-white/5 hover:bg-white/10">{I18N[lang].nav.whatsapp}</a>
            <a href={SITE.telegramLink} className="rounded-xl border border-white/20 px-3 py-1.5 bg-white/5 hover:bg-white/10">{I18N[lang].nav.telegram}</a>
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                try { localStorage.setItem("lang", e.target.value); } catch {}
              }}
              className="rounded-xl bg-white/10 border border-white/20 px-2 py-1"
            >
              <option value="de">DE</option>
              <option value="ch">DE/CH</option>
              <option value="en">EN</option>
            </select>
          </nav>
        </Container>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-white/10">
        <Container className="py-8 text-xs text-white/70 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {SITE.legalCompany}. {SITE.legalAddress}</div>
          <div className="flex gap-4">
            <Link to="/info" className="hover:text-white">Info</Link>
            <Link to="/legal" className="hover:text-white">Legal</Link>
            <a href={`mailto:${SITE.contactEmail}`} className="hover:text-white">Kontakt</a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

const Landing = () => {
  const { lang } = useLang();
  const t = I18N[lang];
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { document.title = `${SITE.brand} – Start`; }, [lang]);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const utm = useMemo(() => ({
    source: query.get("utm_source") || "",
    medium: query.get("utm_medium") || "",
    campaign: query.get("utm_campaign") || "",
    content: query.get("utm_content") || "",
    term: query.get("utm_term") || "",
    ref: query.get("ref") || "",
  }), [query]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const detected = detectContact(contact);
    if (!detected.method) {
      setError(t.form.contactError);
      return;
    }
    if (!consent) {
      setError(t.form.consent(SITE.contactEmail).error);
      return;
    }

    setSending(true);

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY || undefined, // Web3Forms optional
      subject: "Neue Landing-Anmeldung",
      from_name: SITE.brand,
      firstName,
      contactRaw: contact,
      contactMethod: detected.method,
      contactNormalized: detected.normalized,
      lang,
      submittedAt: new Date().toISOString(),
      utm,
      page: window.location.href,
    };

    let posted = false;
    if (SITE.formEndpoint) {
      try {
        const res = await fetch(SITE.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        posted = (data && (data.success === true || res.ok));
      } catch {}
    }

    try {
      const all = JSON.parse(localStorage.getItem("leads") || "[]");
      all.push(payload);
      localStorage.setItem("leads", JSON.stringify(all));
    } catch {}

    setSending(false);
    const viaLabel = detected.method === "email" ? t.via.email
                    : detected.method === "phone" ? t.via.phone
                    : t.via.telegram;
    navigate(`/danke?name=${encodeURIComponent(firstName || "Danke")}&via=${encodeURIComponent(viaLabel)}`);
  };

  return (
    <Shell>
      <section className="relative">
        <Container className="py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge>{t.heroBadge}</Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1]">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${SITE.primaryGradient}`}>
                {t.heroTitle(SITE.brand)}
              </span>
            </h1>
            <p className="text-white/80 text-lg">{t.heroText}</p>

            <div className="flex gap-4 text-sm text-white/70">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">✨ {t.proof.p1}</div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">📈 {t.proof.p2}</div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">🤝 {t.proof.p3}</div>
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur">
            <form onSubmit={submit} className="space-y-4">
              <Input id="firstName" label={t.form.firstName} required placeholder="Romano" value={firstName} onChange={setFirstName} autoComplete="given-name" />
              <Input id="contact" label={t.form.contact} required placeholder="z.B. name@mail.com · +41 79 ... · @telegram" value={contact} onChange={setContact} autoComplete="off" />

              <Checkbox id="consent" checked={consent} onChange={setConsent}>
                {t.form.consent(SITE.contactEmail).label} <span className="opacity-75">— {t.form.consent(SITE.contactEmail).more}</span>
              </Checkbox>
              {error && <div className="text-sm text-rose-300">{error}</div>}

              <button
                type="submit"
                disabled={sending}
                className={`w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold shadow-lg bg-gradient-to-r ${SITE.primaryGradient} disabled:opacity-60`}
              >
                {sending ? (lang === "en" ? "Sending…" : "Senden…") : t.form.submit}
              </button>

              <p className="text-[11px] text-white/60">{t.form.age(SITE.brand)}</p>
            </form>
          </div>
        </Container>
      </section>

      <Container className="py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {I18N[lang].bullets.map((b, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="text-lg font-semibold mb-2">{b.title}</div>
              <div className="text-white/80 text-sm">{b.text}</div>
            </div>
          ))}
        </div>
      </Container>
    </Shell>
  );
};

const Danke = () => {
  const { lang } = useLang();
  const t = I18N[lang];
  const q = useQuery();
  const name = q.get("name") || "Danke";
  const via = q.get("via") || t.via.email;

  useEffect(() => { document.title = `Danke – ${SITE.brand}`; }, [lang]);

  return (
    <Shell>
      <Container className="py-20 md:py-28 text-center max-w-3xl">
        <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${SITE.primaryGradient} mb-6`} />
        <h1 className="text-4xl font-bold mb-3">{t.thanks(name, via).title}</h1>
        <p className="text-white/80 text-lg">{t.thanks(name, via).line}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/info" className="inline-flex justify-center rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10">
            {t.thanks(name, via).moreInfo}
          </Link>
          <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex justify-center rounded-xl px-5 py-3 bg-white text-gray-900 font-semibold">
            {I18N[lang].buttons.whatsapp}
          </a>
          <a href={SITE.telegramLink} target="_blank" rel="noreferrer" className="inline-flex justify-center rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10">
            {I18N[lang].buttons.telegram}
          </a>
        </div>

        <p className="text-xs text-white/60 mt-6">{t.form.successTip}</p>
      </Container>
    </Shell>
  );
};

const Info = () => {
  const { lang } = useLang();
  const t = I18N[lang];
  useEffect(() => { document.title = `Info – ${SITE.brand}`; }, [lang]);

  return (
    <Shell>
      <Container className="py-14 md:py-20 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{t.info.title(SITE.brand)}</h1>
        <div className="prose prose-invert max-w-none">
          <p>{t.info.p1(SITE.brand)}</p>
          <h3>{t.info.expect}</h3>
          <ul>{t.info.expectList.map((li, i) => (<li key={i}>{li}</li>))}</ul>
          <h3>{t.info.next}</h3>
          <ol>{t.info.nextList.map((li, i) => (<li key={i}>{li}</li>))}</ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="inline-flex rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10">{I18N[lang].buttons.signup}</Link>
          <a href={`mailto:${SITE.contactEmail}`} className="inline-flex rounded-xl px-5 py-3 bg-white text-gray-900 font-semibold">{I18N[lang].buttons.emailUs}</a>
        </div>
      </Container>
    </Shell>
  );
};

const Legal = () => {
  const { lang } = useLang();
  const t = I18N[lang];
  useEffect(() => { document.title = `Legal – ${SITE.brand}`; }, [lang]);

  return (
    <Shell>
      <Container className="py-14 md:py-20 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{t.legal.title}</h1>
        <div className="space-y-4 text-white/80">
          <p>{t.legal.privacy(SITE.contactEmail)}</p>
          <p>{t.legal.disclaimer}</p>
        </div>
        <div className="mt-8">
          <a href={`mailto:${SITE.contactEmail}`} className="inline-flex rounded-xl px-5 py-3 bg-white text-gray-900 font-semibold">{I18N[lang].buttons.emailUs}</a>
        </div>
      </Container>
    </Shell>
  );
};

export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "de"; } catch { return "de"; }
  });
  const ctx = useMemo(() => ({ lang, setLang }), [lang]);

  return (
    <LangContext.Provider value={ctx}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/danke" element={<Danke />} />
          <Route path="/info" element={<Info />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </Router>
    </LangContext.Provider>
  );
}
