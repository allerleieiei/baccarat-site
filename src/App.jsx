import React, { useEffect, useState } from "react";

/**
 * Minimal White/Gold Landing (single page)
 * - White background, gold typography
 * - Top-right triangle mosaic (light/dark gold)
 * - 2-field form: First name + Contact (email/phone/telegram in one field)
 * - Web3Forms compatible
 */
const WEB3FORMS_ACCESS_KEY = ""; // <-- your Web3Forms access key (optional)

const SITE = {
  brand: "Baccarat Entertainment",
  subbrand: "by Romano",
  contactEmail: "info@allerleieiei.com",
  whatsappLink:
    "https://wa.me/41792154270?text=Hoi%20Romano%2C%20ich%20komme%20vom%20QR-Code%20(Baccarat)%20und%20m%C3%B6chte%20starten.%20Mein%20Name%3A%20",
  telegramLink: "https://t.me/allerleieiei",
  formEndpoint: "https://api.web3forms.com/submit",
};

const I18N = {
  de: {
    badge: "Unverbindlich",
    title: "Einfach eintragen.\nUnd auf persönliche Antwort warten.",
    subtitle:
      "Gib uns Vorname und dein bevorzugter Kontakt (E‑Mail / Telefon / Telegram) an.\nWir melden uns persönlich bei dir",
    firstName: "Vorname",
    contact: "E‑Mail / Telefon / Telegram",
    consent:
      "Ich bin einverstanden, dass meine Angaben zur Kontaktaufnahme gespeichert werden.",
    privacy: (email) => `Datenschutz: Löschung jederzeit via ${email}.`,
    submit: "Jetzt eintragen",
    successTitle: "Danke!",
    successText: "Wir melden uns zeitnah über deinen gewünschten Kanal.",
    contactError:
      "Bitte eine gültige E‑Mail, Telefonnummer oder Telegram‑Handle angeben.",
    consentError: "Bitte den Datenschutzhinweis bestätigen.",
    note:
      "Hinweis: Unterhaltung, keine Finanzanlage. Keine Gewinn‑Garantie. Teilnahme ab 18 – spiele verantwortungsbewusst.",
    ctas: { whatsapp: "WhatsApp", telegram: "Telegram", email: "E‑Mail" },
  },
  ch: {
    badge: "Unverbindlich",
    title: "Eifach iiträge.\nUnd uf persönlichi Antwort warte.",
    subtitle:
      "Gib ois diin Vorname und diin Kontakt (E‑Mail / Telefon / Telegram) aa.\nMir melded ois persönlich bi dir.",
    firstName: "Vorname",
    contact: "E‑Mail / Telefon / Telegram",
    consent:
      "Ich bi iiverstande, dass mini Aagabe für d'Kontaktuufnahm gspeicheret werded.",
    privacy: (email) => `Dateschutz: Löschig jeder Ziit via ${email}.`,
    submit: "Jetzt iiträge",
    successTitle: "Merci!",
    successText: "Mir mälded ois bald über diin gwünschte Kanal.",
    contactError:
      "Bitte gültigi E‑Mail, Tel‑Nummer oder Telegram‑Handle aagä.",
    consentError: "Bitte Dateschutz bestätige.",
    note:
      "Hiiwiis: Unterhaltig, kei Finanzaalage. Kei Gewünn‑Garantie. Nur ab 18ni – spiel verantwortigsvoll.",
    ctas: { whatsapp: "WhatsApp", telegram: "Telegram", email: "E‑Mail" },
  },
  en: {
    badge: "No obligation · 2 fields",
    title: "Sign up in seconds.\nPersonal reply.",
    subtitle:
      "First name + your preferred contact (Email / Phone / Telegram). Clear answers, no spam.",
    firstName: "First name",
    contact: "Email / Phone / Telegram",
    consent: "I agree my details are stored to contact me.",
    privacy: (email) => `Privacy: deletion anytime via ${email}.`,
    submit: "Sign up",
    successTitle: "Thank you!",
    successText: "We’ll reach out shortly via your chosen channel.",
    contactError: "Please enter a valid email, phone or Telegram handle.",
    consentError: "Please accept the privacy note.",
    note:
      "Note: Entertainment, not an investment. No profit guarantee. 18+ only – play responsibly.",
    ctas: { whatsapp: "WhatsApp", telegram: "Telegram", email: "Email" },
  },
};

function detectContact(raw) {
  const v = (raw || "").trim();
  if (!v) return { ok: false, method: null, normalized: "" };
  const email = /\S+@\S+\.\S+/.test(v);
  const telegram = v.startsWith("@") || v.includes("t.me/") || v.includes("telegram.me/");
  const digits = v.replace(/[^\d+]/g, "");
  const phone = !email && !telegram && (digits.startsWith("+") ? digits.length >= 8 : digits.length >= 7);
  if (email) return { ok: true, method: "email", normalized: v };
  if (telegram) {
    const handle = v.replace(/^.*(@|t\.me\/|telegram\.me\/)/, "@").replace(/^(@?)/, "@");
    return { ok: true, method: "telegram", normalized: handle };
  }
  if (phone) return { ok: true, method: "phone", normalized: digits };
  if (/^@?[\w\d_]{3,}$/.test(v)) return { ok: true, method: "telegram", normalized: v.startsWith("@") ? v : "@"+v };
  return { ok: false, method: null, normalized: v };
}

const Gold = {
  text: "text-[#9B7B2F]",
  textDark: "text-[#6E5520]",
  border: "border-[#E7D7B0]",
  bgSoft: "bg-[#FFFBF1]",
  btn: "bg-[#9B7B2F]",
  btnHover: "hover:bg-[#846625]",
};

function TriangleCorner() {
  const style = {
    backgroundImage: `
      linear-gradient(135deg, rgba(155,123,47,0.35) 25%, transparent 25%),
      linear-gradient(225deg, rgba(155,123,47,0.18) 25%, transparent 25%),
      linear-gradient(45deg,  rgba(155,123,47,0.12) 25%, transparent 25%),
      linear-gradient(315deg, rgba(155,123,47,0.28) 25%, transparent 25%)
    `,
    backgroundSize: "28px 28px",
    backgroundPosition: "0 0, 14px 0, 0 14px, 14px 14px",
    clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
  };
  return (
    <div
      className="absolute top-0 right-0 h-56 w-56 md:h-80 md:w-80 opacity-90"
      style={style}
      aria-hidden="true"
    />
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
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    document.title = `${SITE.brand} – Landing`;
  }, [lang]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const det = detectContact(contact);
    if (!det.ok) {
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

    try {
      const res = await fetch(SITE.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      await res.json().catch(() => ({}));
    } catch {}

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
    <div className="min-h-screen bg-white relative overflow-hidden">
      <TriangleCorner />

      <header className="relative z-10">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-2xl ${Gold.bgSoft} border ${Gold.border} grid place-items-center`}>
              <div className={`h-6 w-6 rounded-xl ${Gold.btn}`} />
            </div>
            <div>
              <div className={`text-xs uppercase tracking-[0.25em] ${Gold.textDark}`}>{SITE.subbrand}</div>
              <div className={`text-xl font-semibold ${Gold.text}`}>{SITE.brand}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href={SITE.whatsappLink} className={`hidden md:inline-flex items-center rounded-xl px-3 py-2 border ${Gold.border} ${Gold.text} hover:bg-[#FFFBF1]`}>
              WhatsApp
            </a>
            <a href={SITE.telegramLink} className={`hidden md:inline-flex items-center rounded-xl px-3 py-2 border ${Gold.border} ${Gold.text} hover:bg-[#FFFBF1]`}>
              Telegram
            </a>
            <select
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                try { localStorage.setItem("lang", e.target.value); } catch {}
              }}
              className={`rounded-xl border ${Gold.border} px-3 py-2 ${Gold.text} bg-white`}
              title="Language"
            >
              <option value="de">DE</option>
              <option value="ch">DE/CH</option>
              <option value="en">EN</option>
            </select>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-4 md:px-6 pt-10 pb-16">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <div className={`inline-flex items-center rounded-full px-4 py-2 border ${Gold.border} ${Gold.text} ${Gold.bgSoft}`}>
                {t.badge}
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${Gold.text}`}>
                {t.title}
              </h1>
              <p className="text-gray-700 text-lg max-w-prose" style={{ whiteSpace: "pre-line" }}>
                {t.subtitle}
              </p>

              <div className="grid gap-3">
                <div className={`rounded-2xl border ${Gold.border} p-4 ${Gold.bgSoft}`}>
                  <div className={`text-sm font-semibold ${Gold.text}`}>Schlicht. Seriös. Schnell.</div>
                  <div className="text-sm text-gray-700 mt-1">Du gibst nur das an, womit du kontaktiert werden willst.</div>
                </div>
                <div className={`rounded-2xl border ${Gold.border} p-4 bg-white`}>
                  <div className="text-sm text-gray-700">
                    {t.note}
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-3xl border ${Gold.border} bg-white shadow-sm p-6 md:p-8`}>
              {!ok ? (
                <form onSubmit={submit} className="space-y-4" id="lead-form">
                  <div className="space-y-1">
                    <label className={`block text-sm font-medium ${Gold.textDark}`}>{t.firstName} <span className="text-red-500">*</span></label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Romano"
                      className={`w-full rounded-2xl border ${Gold.border} px-4 py-3 outline-none focus:ring-2 focus:ring-[#E7D7B0]`}
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`block text-sm font-medium ${Gold.textDark}`}>{t.contact} <span className="text-red-500">*</span></label>
                    <input
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      placeholder="name@mail.com  ·  +41 79 ...  ·  @telegram"
                      className={`w-full rounded-2xl border ${Gold.border} px-4 py-3 outline-none focus:ring-2 focus:ring-[#E7D7B0]`}
                      autoComplete="off"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded-md border-gray-300"
                    />
                    <div className="text-sm text-gray-700">
                      {t.consent}
                      <div className="text-xs text-gray-500 mt-1">{t.privacy(SITE.contactEmail)}</div>
                    </div>
                  </label>

                  {error && <div className="text-sm text-red-600">{error}</div>}

                  <button
                    type="submit"
                    disabled={sending}
                    className={`w-full rounded-2xl px-5 py-3 text-white font-semibold ${Gold.btn} ${Gold.btnHover} disabled:opacity-60`}
                  >
                    {sending ? "…" : t.submit}
                  </button>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <a href={SITE.whatsappLink} className={`inline-flex items-center rounded-xl px-3 py-2 border ${Gold.border} ${Gold.text} hover:bg-[#FFFBF1]`}>
                      {t.ctas.whatsapp}
                    </a>
                    <a href={SITE.telegramLink} className={`inline-flex items-center rounded-xl px-3 py-2 border ${Gold.border} ${Gold.text} hover:bg-[#FFFBF1]`}>
                      {t.ctas.telegram}
                    </a>
                    <a href={`mailto:${SITE.contactEmail}`} className={`inline-flex items-center rounded-xl px-3 py-2 border ${Gold.border} ${Gold.text} hover:bg-[#FFFBF1]`}>
                      {t.ctas.email}
                    </a>
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-3">
                  <div className={`mx-auto h-12 w-12 rounded-2xl ${Gold.bgSoft} border ${Gold.border} grid place-items-center`}>
                    <div className={`h-6 w-6 rounded-xl ${Gold.btn}`} />
                  </div>
                  <div className={`text-2xl font-bold ${Gold.text}`}>{t.successTitle}</div>
                  <div className="text-gray-700">{t.successText}</div>
                  <div className="flex justify-center gap-2 pt-2">
                    <a href={SITE.whatsappLink} className={`rounded-xl px-4 py-2 text-white font-semibold ${Gold.btn} ${Gold.btnHover}`}>
                      {t.ctas.whatsapp}
                    </a>
                    <a href={SITE.telegramLink} className={`rounded-xl px-4 py-2 border ${Gold.border} ${Gold.text} hover:bg-[#FFFBF1]`}>
                      {t.ctas.telegram}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#F3E8C9]">
        <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 text-xs text-gray-500 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {SITE.brand}. {SITE.subbrand}.</div>
          <div>{SITE.contactEmail}</div>
        </div>
      </footer>
    </div>
  );
}
