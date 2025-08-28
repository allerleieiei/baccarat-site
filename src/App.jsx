import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

const SITE = {
  brand: "Baccarat Entertainment",
  subbrand: "by Romano",
  primaryGradient: "from-rose-600 via-pink-500 to-amber-500",
  accent: "rose-600",
  formEndpoint: "https://api.web3forms.com/submit",
  contactEmail: "info@baccarat.allerleieiei.com",
  whatsappLink: "https://wa.me/41792154270",
  telegramLink: "https://t.me/allerleieiei",
  legalCompany: "Baccarat-Entertainment by allerleieiei",
  legalAddress: "Zürich, Schweiz",
};

const I18N = {
  de: {
    nav: { start: "Start", info: "Info", legal: "Rechtliches", whatsapp: "WhatsApp", telegram: "Telegram" },
    heroBadge: "Offizielle Anmeldung",
    heroTitle: (brand) => `Starte mit ${brand}`,
    heroText: (via) => `Werde Teil unserer Community. Trag dich ein und wir melden uns in Kürze mit allen Infos – unkompliziert per ${via}.`,
    bullets: [
      { title: "Einfacher Start", text: "Schnelle Anmeldung – wir begleiten dich persönlich beim Einstieg." },
      { title: "Transparente Resultate", text: "Regelmäßige Updates, klar kommuniziert (5×/Woche)." },
      { title: "Community", text: "Profitiere vom Austausch mit über 700 Mitgliedern." },
    ],
    form: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E‑Mail",
      phone: "Telefon (optional)",
      whatsapp: "WhatsApp (optional)",
      telegram: "Telegram (optional)",
      contactMethod: "Bevorzugter Kontaktkanal",
      message: "Nachricht (optional)",
      submit: "Jetzt unverbindlich eintragen",
      age: (brand) => `Mit Absenden erklärst du, dass du mindestens 18 Jahre alt bist. ${brand} ist Unterhaltung, keine Finanzanlage. Es gibt keine Gewinn­garantie. Spiele verantwortungsbewusst.`,
      consent: (email) => ({
        label: "Ich bin einverstanden, dass meine Angaben zur Kontaktaufnahme gespeichert und verwendet werden.",
        more: `Mehr dazu unter Datenschutz: ${email}`,
        error: "Bitte bestätige die Datenschutzhinweise.",
      }),
    },
    thanks: {
      title: (name) => `Merci, ${name}! 🎉`,
      line: (via) => `Wir haben deine Angaben erhalten und melden uns zeitnah via ${via}.`,
      tip: "Tipp: Speichere unsere Nummer, damit unsere Nachricht sicher ankommt.",
      moreInfo: (brand) => `Mehr über ${brand}`,
    },
    info: {
      title: (brand) => `So funktioniert ${brand}`,
      p1: (brand) => `${brand} ist eine Community‑basierte Unterhaltung rund um Baccarat. Wir spielen nach klaren Regeln und mit diszipliniertem Risiko‑Management. Ziel ist Konstanz statt Spekulation.`,
      expect: "Was du erwarten kannst",
      expectList: [
        "Resultate an fünf Tagen pro Woche (Veröffentlichung Di–Fr).",
        "Flexible Auszahlungen (Mo–Fr) oder Re‑Stake für Zins‑Effekt.",
        "Klare Stop‑Loss und Tagesziele für diszipliniertes Vorgehen.",
        "Optionales 2‑Level Empfehlungssystem für zusätzliche Erträge.",
      ],
      notes: "Wichtige Hinweise",
      notesList: [
        "Kein Anlageprodukt: Es gibt keine Gewinn‑ oder Einkommensgarantie.",
        "Verantwortung: Teilnahme nur ab 18 Jahren. Setze nur Beträge ein, deren Verlust du tragen kannst.",
        "Transparenz: Teilnahme jederzeit beendbar; Auszahlungen nach den gültigen Regeln.",
      ],
      next: "Nächste Schritte",
      nextList: [
        "Trag dich auf der Startseite ein.",
        "Wir melden uns mit einer kurzen Einführung und beantworten deine Fragen.",
        "Du entscheidest in Ruhe, ob und wie du starten möchtest.",
      ],
    },
    legal: {
      title: "Rechtliches & Datenschutz",
      privacy: (email) => `Kurzfassung Datenschutz: Deine Angaben werden ausschließlich zur Kontaktaufnahme verwendet und nicht an Dritte verkauft. Du kannst jederzeit die Löschung verlangen – schreib an ${email}.`,
      disclaimer: "Hinweis: Baccarat Entertainment ist Unterhaltung – keine Finanzanlage, keine Gewinn­garantie. Spiele verantwortungsbewusst.",
    },
    buttons: { info: "Zur Info", signup: "Zur Anmeldung", emailUs: "Fragen? Schreib uns", whatsapp: "Per WhatsApp schreiben", telegram: "Per Telegram schreiben" },
  },
  ch: {
    nav: { start: "Start", info: "Info", legal: "Rechtlichs", whatsapp: "WhatsApp", telegram: "Telegram" },
    heroBadge: "Offizielli Aamäldig",
    heroTitle: (brand) => `Start mit ${brand}`,
    heroText: (via) => `Werd Teil vo oisere Community. Träg di ii, mir mälded ois schnäll und unkompliziert per ${via}.`,
    bullets: [
      { title: "Eifacher Start", text: "Schnäll aagmäldet – mir begleited di bim Iistiig." },
      { title: "Klare Resultat", text: "Regelmässigi Updates (5× i dä Wuche)." },
      { title: "Community", text: "Profiitier vom Uustausch mit über 1700 Lüüt." },
    ],
    form: {
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E‑Mail",
      phone: "Telefon (optional)",
      whatsapp: "WhatsApp (optional)",
      telegram: "Telegram (optional)",
      contactMethod: "Liebscht Kanal",
      message: "Nachricht (optional)",
      submit: "Jetzt unverbindlich iiträge",
      age: (brand) => `Mit äm Absände bestätigsch, dass du mind. 18ni bisch. ${brand} isch Unterhaltig, kei Aalag. Kei Gewünn‑Garantie. Bitte verantwortigsvoll mitmache.`,
      consent: (email) => ({
        label: "Ich bi iiverstande, dass mini Aagabe zur Kontaktuufnahm gspeicheret wärded.",
        more: `Meh i de Datenschutz – schriib a ${email}.`,
        error: "Bitte Dateschutz bestätige.",
      }),
    },
    thanks: {
      title: (name) => `Merci vielmal, ${name}! 🎉`,
      line: (via) => `Mir händ dini Aagabe übercho und mälded ois bald per ${via}.`,
      tip: "Tipp: Speichere oisi Nummere, das d'Nachrichte aachöched.",
      moreInfo: (brand) => `Meh über ${brand}`,
    },
    info: {
      title: (brand) => `So funktioniert ${brand}`,
      p1: (brand) => `${brand} isch e Community rund um Baccarat. Mir spiele mit klare Regle und Disziplin biim Risiko. Ziel isch Konstanz statt Spekulation.`,
      expect: "Was chasch erwarte",
      expectList: [
        "Resultat 5 Täg i de Wuche (Veröffentligi Di–Fr).",
        "Flexibli Uuszahlige (Mo–Fr) oder Re‑Stake für Zins‑Effäkt.",
        "Klare Stop‑Loss und Tagesziel.",
        "Optional 2‑Level Empfehligssystem.",
      ],
      notes: "Wichtig",
      notesList: [
        "Kei Anlageprodukt – kei Gewinn‑/Einkommensgarantie.",
        "Verantwortig – nur ab 18. Nüt iisetzä, wo du würkli chaasch verlüre.",
        "Transparenz – chasch jedi Zyyt ufhöre; Uuszahlige nach Regle.",
      ],
      next: "Nächsti Schritt",
      nextList: ["Iitrage uf de Startsiite.", "Mir melded üüs mit e Churzii Füehrig.", "Du entschidisch i Rueh, wie witer."],
    },
    legal: {
      title: "Rechtlichs & Datenschutz",
      privacy: (email) => `Kurz: Dini Date sind nume für d'Kontaktufnahm. Kei Witergab a Dritti. Löschig jedi Zyyt – schriib a ${email}.`,
      disclaimer: "Hinwiis: Unterhaltung, kei Anlage; kei Gewinn‑Garantie. Bitte verantwortigsvoll spille.",
    },
    buttons: { info: "Zur Info", signup: "Zur Aamäldig", emailUs: "Fragä? Schriib üüs", whatsapp: "Per WhatsApp schriibe", telegram: "Per Telegram schriibe" },
  },
  en: {
    nav: { start: "Start", info: "Info", legal: "Legal", whatsapp: "WhatsApp", telegram: "Telegram" },
    heroBadge: "Official Signup",
    heroTitle: (brand) => `Get started with ${brand}`,
    heroText: (via) => `Join our community. Leave your details and we'll reach out soon – easiest via ${via}.`,
    bullets: [
      { title: "Easy onboarding", text: "Quick signup – we guide you personally." },
      { title: "Transparent results", text: "Regular updates (5×/week)." },
      { title: "Community", text: "Learn with 700+ members." },
    ],
    form: {
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone (optional)",
      whatsapp: "WhatsApp (optional)",
      telegram: "Telegram (optional)",
      contactMethod: "Preferred contact channel",
      message: "Message (optional)",
      submit: "Sign up (no obligation)",
      age: (brand) => `By submitting you confirm you are 18+. ${brand} is entertainment, not an investment. No guarantee of profits. Play responsibly.`,
      consent: (email) => ({
        label: "I agree my details are stored and used to contact me.",
        more: `More in our privacy notes – email ${email}.`,
        error: "Please accept the privacy notice.",
      }),
    },
    thanks: {
      title: (name) => `Thank you, ${name}! 🎉`,
      line: (via) => `We've received your details and will reach out via ${via}.`,
      tip: "Tip: Save our number so the message arrives.",
      moreInfo: (brand) => `More about ${brand}`,
    },
    info: {
      title: (brand) => `How ${brand} works`,
      p1: (brand) => `${brand} is community‑based entertainment around Baccarat. We play with clear rules and disciplined risk management. The goal is consistency, not speculation.`,
      expect: "What to expect",
      expectList: [
        "Results five days per week (published Tue–Fri).",
        "Flexible withdrawals (Mon–Fri) or re‑stake for compounding.",
        "Clear stop‑loss and daily targets.",
        "Optional 2‑level referral system.",
      ],
      notes: "Important notes",
      notesList: [
        "Not an investment product; no profit or income guarantee.",
        "Responsibility: 18+ only. Use only funds you can afford to lose.",
        "Transparency: Stop any time; withdrawals per current rules.",
      ],
      next: "Next steps",
      nextList: ["Sign up on the start page.", "We'll send a short intro and answer questions.", "You decide calmly if and how to start."],
    },
    legal: {
      title: "Legal & Privacy",
      privacy: (email) => `Short privacy note: Your data is used only to contact you and is not sold. You can request deletion any time – email ${email}.`,
      disclaimer: "Note: Entertainment only – not an investment, no profit guarantee. Play responsibly.",
    },
    buttons: { info: "Go to Info", signup: "Go to signup", emailUs: "Questions? Email us", whatsapp: "Message on WhatsApp", telegram: "Message on Telegram" },
  },
};

const LangContext = createContext({ lang: "de", setLang: () => {} });
const useLang = () => useContext(LangContext);
const useQuery = () => new URLSearchParams(useLocation().search);

const Input = ({ label, id, type = "text", required, placeholder, value, onChange, autoComplete }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-white/10 focus:bg-white/20 border border-white/20 focus:border-white/40 outline-none px-4 py-3 text-white placeholder-white/60 shadow-sm"
    />
  </div>
);

const TextArea = ({ label, id, required, placeholder, value, onChange }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <textarea
      id={id}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      className="w-full rounded-xl bg-white/10 focus:bg-white/20 border border-white/20 focus:border-white/40 outline-none px-4 py-3 text-white placeholder-white/60 shadow-sm"
    />
  </div>
);

const Select = ({ label, id, required, value, onChange, options }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-200">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <select
      id={id}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-white/10 focus:bg-white/20 border border-white/20 focus:border-white/40 outline-none px-4 py-3 text-white placeholder-white/60 shadow-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-gray-900">
          {opt.label}
        </option>
      ))}
    </select>
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
    <span className="text-sm text-gray-200">{children}</span>
  </label>
);

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-5xl px-4 md:px-6 ${className}`}>{children}</div>
);

const Shell = ({ children }) => {
  const { lang, setLang } = useLang();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/20 border-b border-white/10">
        <Container className="py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${SITE.primaryGradient} shadow-lg`} />
            <div>
              <div className="text-sm uppercase tracking-widest text-white/70">{SITE.subbrand}</div>
              <div className="text-xl font-semibold">{SITE.brand}</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/" i18nKey="nav.start" />
            <NavLink to="/info" i18nKey="nav.info" />
            <NavLink to="/legal" i18nKey="nav.legal" />
            <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-white/40 px-4 py-2 bg-white/5 hover:bg-white/10 transition">
              {I18N[lang].nav.whatsapp}
            </a>
            <a href={SITE.telegramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-white/40 px-4 py-2 bg-white/5 hover:bg-white/10 transition">
              {I18N[lang].nav.telegram}
            </a>
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                try { localStorage.setItem("lang", e.target.value); } catch {}
              }}
              className="rounded-xl bg-white/10 border border-white/20 px-2 py-1"
              title="Language"
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
          <div>
            © {new Date().getFullYear()} {SITE.legalCompany}. {SITE.legalAddress}
          </div>
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

const NavLink = ({ to, i18nKey }) => {
  const { lang } = useLang();
  const key = i18nKey.split(".")[1];
  return (
    <Link to={to} className="text-white/80 hover:text-white">
      {I18N[lang].nav[key]}
    </Link>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();
  const t = I18N[lang];

  useEffect(() => {
    document.title = `${SITE.brand} – Landing`;
  }, [lang]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    telegram: "",
    contactMethod: "WhatsApp",
    message: "",
    consent: false,
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const utm = useMemo(() => ({
    source: query.get("utm_source") || "",
    medium: query.get("utm_medium") || "",
    campaign: query.get("utm_campaign") || "",
    content: query.get("utm_content") || "",
    term: query.get("utm_term") || "",
    ref: query.get("ref") || "",
  }), [query]);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.consent) {
      setError(t.form.consent(SITE.contactEmail).error);
      return;
    }
    setSending(true);
    const payload = {
      access_key: "d87b98ed-072d-48a3-aec6-ea147a9a1f36",              // ← deinen Web3Forms Access Key einsetzen
      subject: "Neue Landing-Anmeldung",          // Betreff der E-Mail
      from_name: "Baccarat Entertainment",        // Absendername in der E-Mail
      ...form,                                    // Vorname, Nachname, Email, etc.
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
          headers: { "Content-Type": "application/json",
                   "Accept": "application/json",
                   },
          body: JSON.stringify(payload),
        });
        posted = res.ok;
      } catch (err) {
        posted = false;
      }
    }

    try {
      const all = JSON.parse(localStorage.getItem("leads") || "[]");
      all.push(payload);
      localStorage.setItem("leads", JSON.stringify(all));
    } catch {}

    setSending(false);
    const via = form.contactMethod || "Kontakt";
    navigate(`/danke?name=${encodeURIComponent(form.firstName)}&via=${encodeURIComponent(via)}`);
  };

  return (
    <Shell>
      <section className="relative overflow-hidden">
        <div className={`absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br ${SITE.primaryGradient} opacity-30 blur-3xl`} />
        <Container className="py-14 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/80">{t.heroBadge}</span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t.heroTitle(SITE.brand).split(" ").slice(0, 2).join(" ")} <span className={`bg-clip-text text-transparent bg-gradient-to-r ${SITE.primaryGradient}`}>{SITE.brand}</span>
            </h1>
            <p className="text-white/80 text-lg">
              {t.heroText(form.contactMethod)}
            </p>
            <ul className="text-white/80 text-sm space-y-2">
              {t.bullets.map((b, i) => (
                <li key={i}>• <span className="font-semibold">{b.title}</span> – {b.text}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="firstName" label={t.form.firstName} required placeholder="Romano" value={form.firstName} onChange={(v)=>onChange("firstName", v)} autoComplete="given-name" />
                <Input id="lastName" label={t.form.lastName} required placeholder="Muster" value={form.lastName} onChange={(v)=>onChange("lastName", v)} autoComplete="family-name" />
              </div>
              <Input id="email" type="email" label={t.form.email} required placeholder="name@example.com" value={form.email} onChange={(v)=>onChange("email", v)} autoComplete="email" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="phone" label={t.form.phone} placeholder="079 000 00 00" value={form.phone} onChange={(v)=>onChange("phone", v)} autoComplete="tel" />
                <Input id="whatsapp" label={t.form.whatsapp} placeholder="+41 79 000 00 00" value={form.whatsapp} onChange={(v)=>onChange("whatsapp", v)} autoComplete="tel" />
              </div>
              <Input id="telegram" label={t.form.telegram} placeholder="@username" value={form.telegram} onChange={(v)=>onChange("telegram", v)} autoComplete="off" />

              <Select
                id="method"
                label={t.form.contactMethod}
                required
                value={form.contactMethod}
                onChange={(v)=>onChange("contactMethod", v)}
                options={[
                  { value: "WhatsApp", label: "WhatsApp" },
                  { value: lang === "en" ? "Email" : "E‑Mail", label: lang === "en" ? "Email" : "E‑Mail" },
                  { value: lang === "en" ? "Phone" : "Telefon", label: lang === "en" ? "Phone" : "Telefon" },
                  { value: "Telegram", label: "Telegram" },
                ]}
              />

              <TextArea id="msg" label={t.form.message} placeholder="…" value={form.message} onChange={(v)=>onChange("message", v)} />

              <div className="space-y-3">
                <Checkbox id="consent" checked={form.consent} onChange={(v)=>onChange("consent", v)}>
                  {t.form.consent(SITE.contactEmail).label} <span className="opacity-75">— {t.form.consent(SITE.contactEmail).more}</span>
                </Checkbox>
                {error && <div className="text-sm text-rose-300">{error}</div>}
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold shadow-lg bg-gradient-to-r ${SITE.primaryGradient} disabled:opacity-60`}
              >
                {sending ? (lang === "en" ? "Sending…" : "Senden…") : t.form.submit}
              </button>

              <p className="text-[11px] text-white/60">
                {t.form.age(SITE.brand)}
              </p>
            </form>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {I18N[lang].bullets.map((b, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
  const query = useQuery();
  const name = query.get("name") || "Danke";
  const via = query.get("via") || "Kontakt";
  const { lang } = useLang();
  const t = I18N[lang];

  useEffect(() => {
    document.title = `Danke – ${SITE.brand}`;
  }, [lang]);

  return (
    <Shell>
      <Container className="py-20 md:py-28 text-center max-w-3xl">
        <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${SITE.primaryGradient} mb-6`} />
        <h1 className="text-4xl font-bold mb-3">{t.thanks.title(name)}</h1>
        <p className="text-white/80 text-lg">{t.thanks.line(via)}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/info" className={`inline-flex justify-center rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10`}>
            {t.thanks.moreInfo(SITE.brand)}
          </Link>
          <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className={`inline-flex justify-center rounded-xl px-5 py-3 bg-white text-gray-900 font-semibold`}>
            {I18N[lang].buttons.whatsapp}
          </a>
          <a href={SITE.telegramLink} target="_blank" rel="noreferrer" className={`inline-flex justify-center rounded-xl px-5 py-3 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10`}>
            {I18N[lang].buttons.telegram}
          </a>
        </div>

        <p className="text-xs text-white/60 mt-6">{t.thanks.tip}</p>
      </Container>
    </Shell>
  );
};

const Info = () => {
  const { lang } = useLang();
  const t = I18N[lang];
  useEffect(() => {
    document.title = `Info – ${SITE.brand}`;
  }, [lang]);

  return (
    <Shell>
      <Container className="py-14 md:py-20 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{t.info.title(SITE.brand)}</h1>
        <div className="prose prose-invert max-w-none">
          <p>{t.info.p1(SITE.brand)}</p>
          <h3>{t.info.expect}</h3>
          <ul>
            {t.info.expectList.map((li, i) => (<li key={i}>{li}</li>))}
          </ul>
          <h3>{t.info.notes}</h3>
          <ul>
            {t.info.notesList.map((li, i) => (<li key={i}>{li}</li>))}
          </ul>
          <h3>{t.info.next}</h3>
          <ol>
            {t.info.nextList.map((li, i) => (<li key={i}>{li}</li>))}
          </ol>
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
