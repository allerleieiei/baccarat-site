import React, { useEffect, useMemo, useState } from "react";

/**
 * One-Page Landing (violet casino theme)
 * - Minimal friction: 2 fields (First name + single contact field)
 * - Auto-detects Email / Phone/WhatsApp / Telegram
 * - Single page (no subpages); compact info + footer legal
 * - Inline SVG cards + baccarat-table vibe in violet tones
 *
 * Set your Web3Forms Access Key below (optional but recommended).
 */
const WEB3FORMS_ACCESS_KEY = ""; // ← your key (optional)

const SITE = {
  brand: "Baccarat Entertainment",
  subbrand: "by Romano",
  gradient: "from-violet-700 via-fuchsia-600 to-rose-500",
  contactEmail: "info@baccarat.allerleieiei.com",
  whatsappLink: "https://wa.me/41792154270?text=Hoi%20Romano%2C%20ich%20komme%20vom%20QR-Code%20(Baccarat)%20und%20m%C3%B6chte%20starten.%20Mein%20Name%3A%20",
  telegramLink: "https://t.me/allerleieiei",
  formEndpoint: "https://api.web3forms.com/submit", // or Formspree / Make webhook
  legalCompany: "Baccarat Entertainment by allerleieiei",
  legalAddress: "Zürich, Schweiz",
};

const I18N = {
  de: {
    badge: "2 Felder · 30 Sekunden",
    heroTitle: (brand) => `Starte jetzt mit ${brand}`,
    heroText: "Vorname + dein Kontakt (E‑Mail / Telefon / Telegram) – wir melden uns persönlich.",
    firstName: "Vorname",
    contact: "E‑Mail / Telefon / Telegram",
    submit: "Jetzt unverbindlich eintragen",
    consentLabel: (email) => "Ich bin einverstanden, dass meine Angaben zur Kontaktaufnahme gespeichert werden.",
    consentMore: (email) => `Datenschutz: Fragen an ${email}`,
    contactError: "Bitte eine gültige E‑Mail, Telefonnummer oder Telegram‑Handle angeben.",
    consentError: "Bitte den Datenschutzhinweis bestätigen.",
    promise1: "Kein Spam. Persönliche Rückmeldung.",
    promise2: "Ehrlich & transparent – keine Garantien.",
    promise3: "Community‑Support.",
    legalNote: (brand) => `${brand} ist Unterhaltung, keine Finanzanlage. Keine Gewinn­garantie. Teilnahme ab 18 – spiele verantwortungsbewusst.`,
    buttons: { whatsapp: "WhatsApp", telegram: "Telegram", email: "E‑Mail" },
    success: "Danke! Wir melden uns zeitnah.",
  },
  ch: {
    badge: "2 Fälder · 30 Sek.",
    heroTitle: (brand) => `Start mit ${brand}`,
    heroText: "Vorname + din Kontakt (E‑Mail / Tel / Telegram) – mir melded üüs persönlich.",
    firstName: "Vorname",
    contact: "E‑Mail / Telefon / Telegram",
    submit: "Jetzt iitrage",
    consentLabel: (email) => "Ich bi iiverstande, dass mini Aagabe für d'Kontakt gspeichert wärde.",
    consentMore: (email) => `Datenschutz: Fragä a ${email}`,
    contactError: "Bitte gültigi E‑Mail, Tel‑Nummer oder Telegram‑Handle aage.",
    consentError: "Bitte Datenschutz bestätige.",
    promise1: "Kei Spam. Persönlichi Rückmändig.",
    promise2: "Ehrlich & transparent – kei Garantie.",
    promise3: "Community‑Support.",
    legalNote: (brand) => `${brand} isch Unterhaltig, kei Anlage. Kei Gewinn‑Garantie. Nur ab 18 – bitte verantwortigsvoll.`,
    buttons: { whatsapp: "WhatsApp", telegram: "Telegram", email: "E‑Mail" },
    success: "Merci! Mir melded üüs bäld.",
  },
  en: {
    badge: "2 fields · 30 seconds",
    heroTitle: (brand) => `Get started with ${brand}`,
    heroText: "First name + your contact (Email / Phone / Telegram) – we'll reach out personally.",
    firstName: "First name",
    contact: "Email / Phone / Telegram",
    submit: "Join (free & no obligation)",
    consentLabel: (email) => "I agree my details are stored to contact me.",
    consentMore: (email) => `Privacy: questions → ${email}`,
    contactError: "Please enter a valid email, phone or Telegram handle.",
    consentError: "Please accept the privacy note.",
    promise1: "No spam. Personal reply.",
    promise2: "Honest & transparent – no guarantees.",
    promise3: "Community support.",
    legalNote: (brand) => `${brand} is entertainment, not an investment. No profit guarantee. 18+ only – play responsibly.`,
    buttons: { whatsapp: "WhatsApp", telegram: "Telegram", email: "Email" },
    success: "Thank you! We'll reach out shortly.",
  },
};

function detectContact(raw) {
  const v = (raw || "").trim();
  if (!v) return { method: null, normalized: "" };
  const email = /\S+@\S+\.\S+/.test(v);
  const telegram = v.startsWith("@") || v.includes("t.me/") || v.includes("telegram.me/");
  const digits = v.replace(/[^\d+]/g, "");
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

const LangToggle = ({ lang, setLang }) => (
  <select
    value={lang}
    onChange={(e) => {
      setLang(e.target.value);
      try { localStorage.setItem("lang", e.target.value); } catch {}
    }}
    className="rounded-xl bg-white/10 border border-white/20 px-2 py-1 text-white"
    title="Language"
  >
    <option value="de">DE</option>
    <option value="ch">DE/CH</option>
    <option value="en">EN</option>
  </select>
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

function CardsSVG() {
  return (
    <svg width="360" height="200" viewBox="0 0 360 200" className="drop-shadow-xl">
      <ellipse cx="180" cy="170" rx="140" ry="18" fill="rgba(0,0,0,0.25)" />
      <g transform="translate(90,20) rotate(-12)">
        <rect x="0" y="0" rx="14" ry="14" width="105" height="150" fill="#fff" />
        <text x="14" y="24" fontSize="18" fill="#d946ef">A</text>
        <circle cx="52" cy="75" r="16" fill="#ef4444" />
        <path d="M52 66 L56 72 L48 72 Z" fill="#fff" opacity="0.7"/>
      </g>
      <g transform="translate(145,10) rotate(6)">
        <rect x="0" y="0" rx="14" ry="14" width="105" height="150" fill="#fff" />
        <text x="14" y="24" fontSize="18" fill="#7c3aed">K</text>
        <path d="M52 60
                 c20 0 20 28 0 40
                 c-20 12 -20 -28 0 -40z" fill="#10b981" />
      </g>
      <g transform="translate(200,25) rotate(14)">
        <rect x="0" y="0" rx="14" ry="14" width="105" height="150" fill="#fff" />
        <text x="14" y="24" fontSize="18" fill="#ef4444">9</text>
        <rect x="44" y="62" width="16" height="16" transform="rotate(45 52 70)" fill="#ef4444" />
      </g>
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "de"; } catch { return "de"; }
  });
  const t = I18N[lang];

  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => { document.title = `${SITE.brand} – Start`; }, [lang]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const det = detectContact(contact);
    if (!det.method) {
      setError(t.contactError);
      return;
    }
    if (!consent) {
      setError(t.consentError);
      return;
    }
    setSending(true);

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY || undefined,
      subject: "Neue Landing-Anmeldung",
      from_name: SITE.brand,
      firstName,
      contactRaw: contact,
      contactMethod: det.method,
      contactNormalized: det.normalized,
      lang,
      submittedAt: new Date().toISOString(),
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
    setOk(true);
    setFirstName("");
    setContact("");
    setConsent(false);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-gradient-to-br from-violet-800/20 via-fuchsia-700/10 to-rose-600/10 blur-3xl" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-72 md:h-80 rounded-[100px] border border-violet-500/30 bg-violet-700/10"
             style={{boxShadow:"inset 0 0 120px rgba(139,92,246,0.25)"}} />
      </div>

      <header className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-2xl bg-gradient-to-br ${SITE.gradient} shadow-lg`} />
            <div>
              <div className="text-xs uppercase tracking-widest text-white/70">{SITE.subbrand}</div>
              <div className="text-xl font-semibold">{SITE.brand}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={SITE.whatsappLink} className="hidden md:inline-block rounded-xl border border-white/20 px-3 py-1.5 bg-white/5 hover:bg-white/10">WhatsApp</a>
            <a href={SITE.telegramLink} className="hidden md:inline-block rounded-xl border border-white/20 px-3 py-1.5 bg-white/5 hover:bg-white/10">Telegram</a>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-4 md:px-6 pt-10 pb-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-white/80">
              {t.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1]">
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${SITE.gradient}`}>
                {t.heroTitle(SITE.brand)}
              </span>
            </h1>
            <p className="text-white/80 text-lg">{t.heroText}</p>
            <div className="hidden md:block">
              <CardsSVG />
            </div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur">
            {!ok ? (
              <form onSubmit={submit} className="space-y-4">
                <Input id="firstName" label={t.firstName} required placeholder="Romano" value={firstName} onChange={setFirstName} autoComplete="given-name" />
                <Input id="contact" label={t.contact} required placeholder="z.B. name@mail.com · +41 79 ... · @telegram" value={contact} onChange={setContact} autoComplete="off" />
                <div className="space-y-3">
                  <Checkbox id="consent" checked={consent} onChange={setConsent}>
                    {t.consentLabel(SITE.contactEmail)} <span className="opacity-75">— {t.consentMore(SITE.contactEmail)}</span>
                  </Checkbox>
                  {error && <div className="text-sm text-rose-300">{error}</div>}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className={`w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold shadow-lg bg-gradient-to-r ${SITE.gradient} disabled:opacity-60`}
                >
                  {sending ? (lang === "en" ? "Sending…" : "Senden…") : t.submit}
                </button>
                <p className="text-[11px] text-white/60">{t.legalNote(SITE.brand)}</p>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${SITE.gradient}`} />
                <div className="text-2xl font-bold">{t.success}</div>
                <div className="text-white/80">{t.promise1}</div>
                <div className="flex gap-3 justify-center mt-4">
                  <a href={SITE.whatsappLink} className="inline-flex rounded-xl px-4 py-2 bg-white text-gray-900 font-semibold">WhatsApp</a>
                  <a href={SITE.telegramLink} className="inline-flex rounded-xl px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10">Telegram</a>
                  <a href={`mailto:${SITE.contactEmail}`} className="inline-flex rounded-xl px-4 py-2 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10">{t.buttons.email}</a>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 md:px-6 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="text-lg font-semibold mb-2">✨ {t.promise1}</div>
              <div className="text-white/80 text-sm">—</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="text-lg font-semibold mb-2">📈 {t.promise2}</div>
              <div className="text-white/80 text-sm">—</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <div className="text-lg font-semibold mb-2">🤝 {t.promise3}</div>
              <div className="text-white/80 text-sm">—</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 text-xs text-white/70 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {SITE.legalCompany}. {SITE.legalAddress}</div>
          <div className="flex gap-4">
            <a href={SITE.whatsappLink} className="hover:text-white">WhatsApp</a>
            <a href={SITE.telegramLink} className="hover:text-white">Telegram</a>
            <a href={`mailto:${SITE.contactEmail}`} className="hover:text-white">E‑Mail</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
