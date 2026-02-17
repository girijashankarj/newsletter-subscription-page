/*
 NEWSLETTER SUBSCRIPTION PAGE
 ==============================
 Google Sheet Column Order (13 columns):
   A: Subscriber ID  B: First Name   C: Last Name      D: Email
   E: Country Code   F: Mobile       (null; mobile removed from form) G: Tags (JSON arr) H: Article Mode
   I: Total Count    J: Topic Dist.  K: Status          L: Subscribed At
   M: Unsubscribed At

 Apps Script Setup:
   1. Create Apps Script project linked to your Google Sheet
   2. Deploy as Web App (Execute as: Me, Who can access: Anyone)
   3. Copy deployment URL and replace APPS_SCRIPT_URL constant below
   4. doPost() handles two actions:
      - "subscribe"   → appendRow with all 13 columns
      - "unsubscribe" → find row by email, update col K and M
   5. Return: ContentService.createTextOutput(JSON.stringify(res))
                             .setMimeType(ContentService.MimeType.JSON)

 CORS Note:
   Apps Script needs proper response headers for fetch() to read the body.
   If you see CORS errors, add these headers in your doPost():
   var output = ContentService.createTextOutput(JSON.stringify(res));
   output.setMimeType(ContentService.MimeType.JSON);
   return output;
*/

import React from "react";
import { useTheme } from "./ThemeContext.jsx";

const APPS_SCRIPT_URL = import.meta.env.VITE_NEWSLETTER_SCRIPT_URL || "";

const PREDEFINED_TAGS = [
  "AI", "Machine Learning", "JavaScript", "TypeScript", "React", "Node.js",
  "Cloud & AWS", "DevOps", "MLOps", "Generative AI", "Data Engineering",
  "System Design", "Open Source", "Tech Career", "Finance & Markets", "History & Culture",
];

const SIMPLE_COUNTS = [5, 10, 15, 20, 25];
const PER_TOPIC_OPTIONS = [0, 1, 2, 3, 4, 5];
const MAX_TAGS = 10;
const CUSTOM_TAG_MAX_LEN = 30;

function NewsletterPage() {
  const [activeTab, setActiveTab] = React.useState("subscribe");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-body antialiased page-gradient">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');
        .font-heading { font-family: 'Cormorant Garamond', serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide { animation: fadeSlideIn 0.35s ease-out forwards; }
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-success { animation: successPop 0.4s ease-out forwards; }
      `}</style>

      <header className="relative pt-10 pb-6">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-4 md:right-8 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors z-10"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <div className="max-w-xl mx-auto px-5 flex flex-col items-center text-center">
          <a href="https://girijashankarj.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="block mb-4">
            <img
              src="https://girijashankarj.github.io/portfolio/assets/profile-header.jpeg"
              alt="Girijashankar Jambhale"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-2 ring-[var(--border)] shadow-md hover:ring-[var(--accent)]/50 transition-all"
            />
          </a>
          <p className="text-sm font-medium text-[var(--accent)] tracking-wide uppercase mb-1">AI Platform Engineer · Pune, India</p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
            Girijashankar Jambhale
          </h1>
          <p className="mt-1 font-heading text-xl text-[var(--text-muted)]">Garry&apos;s Daily Digest</p>
          <p className="mt-2 text-[var(--text-muted)] text-base md:text-lg max-w-md">
            Personalized tech digest — pick your topics, get articles that match. Delivered daily at 3:30 AM UTC.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://www.linkedin.com/in/girijashankarj" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://github.com/girijashankarj" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://girijashankarj.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors" aria-label="Portfolio">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-5 pb-24">
        <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-[var(--text)] mb-3">Why subscribe?</h2>
          <ul className="space-y-2 text-sm text-[var(--text-muted)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">→</span>
              <span><strong className="text-[var(--text)]">Personalized for you</strong> — Pick topics: AI, web dev, DevOps, MLOps, system design, career, finance, culture, and more. Custom tags supported.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">→</span>
              <span><strong className="text-[var(--text)]">Powered by Tech News Aggregator</strong> — Curated from 18+ sources, filtered by relevance. One crisp digest per day.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] mt-0.5">→</span>
              <span><strong className="text-[var(--text)]">Daily at 3:30 AM UTC</strong> — Choose 5–25 articles per digest. Unsubscribe anytime.</span>
            </li>
          </ul>
        </div>

        <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "subscribe" && <SubscribeSection />}
        {activeTab === "unsubscribe" && <UnsubscribeSection />}
      </div>

      <footer className="py-10 text-center border-t border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-sm mb-2">Girijashankar Jambhale · AI Platform Engineer</p>
        <p className="text-[var(--text-muted)] text-xs mb-3">Synechron · 8+ years · Gen AI · MLOps · Data Engineering</p>
        <a href="https://girijashankarj.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline text-sm">View full portfolio →</a>
      </footer>
    </div>
  );
}

function TabSwitcher({ activeTab, setActiveTab }) {
  return (
    <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1 mb-8 shadow-sm">
      <button
        type="button"
        onClick={() => setActiveTab("subscribe")}
        className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "subscribe"
            ? "bg-[var(--accent)] text-white shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
      >
        Subscribe
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("unsubscribe")}
        className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
          activeTab === "unsubscribe"
            ? "bg-[var(--accent)] text-white shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
      >
        Unsubscribe
      </button>
    </div>
  );
}

function SubscribeSection() {
  const [step, setStep] = React.useState(1);
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    tags: [],
    customTagInput: "",
    articleMode: "simple",
    simpleCount: 10,
    topicDistribution: {},
    step1Error: "",
    step2Error: "",
    step3Error: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const selectedTags = form.tags;
  const tagCount = selectedTags.length;
  const canAddMoreTags = tagCount < MAX_TAGS;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      update("tags", selectedTags.filter((t) => t !== tag));
      setForm((f) => {
        const next = { ...f.topicDistribution };
        delete next[tag];
        return { ...f, topicDistribution: next };
      });
    } else if (canAddMoreTags) {
      update("tags", [...selectedTags, tag]);
      if (form.articleMode === "perTopic" && !(tag in form.topicDistribution)) {
        setForm((f) => ({ ...f, topicDistribution: { ...f.topicDistribution, [tag]: 0 } }));
      }
    }
  };

  const addCustomTag = () => {
    const raw = form.customTagInput.trim().slice(0, CUSTOM_TAG_MAX_LEN);
    if (!raw || !canAddMoreTags) return;
    const tag = raw;
    const exists = [...PREDEFINED_TAGS, ...selectedTags].some((t) => t.toLowerCase() === tag.toLowerCase());
    if (exists) return;
    update("tags", [...selectedTags, tag]);
    update("customTagInput", "");
    if (form.articleMode === "perTopic") {
      setForm((f) => ({ ...f, topicDistribution: { ...f.topicDistribution, [tag]: 0 } }));
    }
  };

  const setTopicCount = (tag, count) => {
    setForm((f) => ({
      ...f,
      topicDistribution: { ...f.topicDistribution, [tag]: count },
    }));
  };

  const topicTotal = Object.values(form.topicDistribution).reduce((a, b) => a + b, 0);
  const topicValid = topicTotal > 0 && topicTotal % 5 === 0;

  const validateStep1 = () => {
    let err = "";
    if (!form.firstName.trim()) err = "First name is required.";
    else if (!form.lastName.trim()) err = "Last name is required.";
    else if (!form.email.trim()) err = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err = "Please enter a valid email.";
    update("step1Error", err);
    return !err;
  };

  const validateStep2 = () => {
    const err = selectedTags.length === 0 ? "Select at least one topic tag." : "";
    update("step2Error", err);
    return !err;
  };

  const validateStep3 = () => {
    let err = "";
    if (form.articleMode === "simple") {
      if (![5, 10, 15, 20, 25].includes(form.simpleCount)) err = "Select articles per newsletter.";
    } else {
      if (topicTotal === 0) err = "Total must be greater than 0.";
      else if (topicTotal % 5 !== 0) err = "Total must be a multiple of 5.";
    }
    update("step3Error", err);
    return !err;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    setSubmitError("");
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;
    setSubmitError("");
    setLoading(true);
    const subscriberId = `SUB_${Date.now()}`;
    const now = new Date().toISOString();
    const payload = {
      action: "subscribe",
      subscriberId,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      countryCode: null,
      mobile: null,
      tags: selectedTags,
      articleMode: form.articleMode,
      totalCount: form.articleMode === "simple" ? form.simpleCount : topicTotal,
      topicDistribution: form.articleMode === "perTopic" ? form.topicDistribution : null,
      status: "active",
      subscribedAt: now,
      unsubscribedAt: null,
    };
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.status === "success") {
        setSubmitted(true);
      } else {
        setSubmitError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check the Apps Script URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-success rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[var(--success-muted)] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-semibold text-[var(--text)]">You&apos;re in</h2>
        <p className="mt-2 text-[var(--text-muted)] text-sm">Thanks for subscribing. Your first digest arrives at 3:30 AM UTC.</p>
        <a href="https://girijashankarj.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-sm text-[var(--accent)] hover:underline">Explore my portfolio →</a>
      </div>
    );
  }

  return (
    <div className="animate-fade-slide rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 text-sm text-[var(--text-muted)] mb-8">
        <span>Step {step} of 3</span>
        <div className="flex-1 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
          <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <Step1PersonalInfo form={form} update={update} error={form.step1Error} />
      )}
      {step === 2 && (
        <Step2TagSelection
          form={form}
          update={update}
          predefinedTags={PREDEFINED_TAGS}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          addCustomTag={addCustomTag}
          canAddMoreTags={canAddMoreTags}
          tagCount={tagCount}
          maxTags={MAX_TAGS}
          error={form.step2Error}
        />
      )}
      {step === 3 && (
        <Step3ArticleConfig
          form={form}
          update={update}
          selectedTags={selectedTags}
          setTopicCount={setTopicCount}
          topicTotal={topicTotal}
          topicValid={topicValid}
          error={form.step3Error}
        />
      )}

      <div className="mt-10 flex gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)]/30 transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <div className="flex-1" />
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "Subscribing…" : "Subscribe Now"}
          </button>
        )}
      </div>

      {submitError && <p className="mt-4 text-sm" style={{ color: "var(--error)" }}>{submitError}</p>}
    </div>
  );
}

function Step1PersonalInfo({ form, update, error }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="First Name *"
        value={form.firstName}
        onChange={(e) => update("firstName", e.target.value)}
        className="input-field w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] outline-none transition"
      />
      <input
        type="text"
        placeholder="Last Name *"
        value={form.lastName}
        onChange={(e) => update("lastName", e.target.value)}
        className="input-field w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] outline-none transition"
      />
      <input
        type="email"
        placeholder="Email ID *"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        className="input-field w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] outline-none transition"
      />
      {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}

function Step2TagSelection({
  form,
  update,
  predefinedTags,
  selectedTags,
  toggleTag,
  addCustomTag,
  canAddMoreTags,
  tagCount,
  maxTags,
  error,
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-[var(--text-muted)]">
        {tagCount} / {maxTags} tags selected
        {!canAddMoreTags && <span className="ml-2 opacity-80">(max reached)</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {predefinedTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            disabled={!selectedTags.includes(tag) && !canAddMoreTags}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
              selectedTags.includes(tag)
                ? "bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]/50 hover:text-[var(--text)] disabled:opacity-40"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          placeholder="Custom tag (max 30 chars)"
          maxLength={CUSTOM_TAG_MAX_LEN}
          value={form.customTagInput}
          onChange={(e) => update("customTagInput", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
          disabled={!canAddMoreTags}
          className="input-field flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] outline-none disabled:opacity-50 transition"
        />
        <button
          type="button"
          onClick={addCustomTag}
          disabled={!canAddMoreTags || !form.customTagInput.trim()}
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--accent-muted)] hover:border-[var(--accent)] disabled:opacity-50 transition"
        >
          Add
        </button>
      </div>
      {selectedTags.some((t) => !predefinedTags.includes(t)) && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.filter((t) => !predefinedTags.includes(t)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="px-3.5 py-2 rounded-lg text-sm font-medium bg-[var(--accent-muted)] border border-[var(--accent)]/50 text-[var(--accent)] hover:opacity-80"
            >
              {tag} ×
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}

function Step3ArticleConfig({ form, update, selectedTags, setTopicCount, topicTotal, topicValid, error }) {
  const showPerTopic = selectedTags.length >= 2;
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--text-muted)] mb-2">Article count</p>
        <div className="flex gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
          <button
            type="button"
            onClick={() => update("articleMode", "simple")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              form.articleMode === "simple" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Simple
          </button>
          <button
            type="button"
            onClick={() => update("articleMode", "perTopic")}
            disabled={!showPerTopic}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
              form.articleMode === "perTopic" ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            Per topic
          </button>
        </div>
      </div>

      {form.articleMode === "simple" && (
        <div className="flex flex-wrap gap-2">
          {SIMPLE_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update("simpleCount", n)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                form.simpleCount === n
                  ? "bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]/50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {form.articleMode === "perTopic" && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-muted)]">
            Total: {topicTotal} articles {topicValid ? "(multiple of 5 ✓)" : "(must be multiple of 5)"}
          </p>
          {selectedTags.map((tag) => (
            <div key={tag} className="flex items-center justify-between gap-4 py-1">
              <span className="text-sm text-[var(--text)] truncate">{tag}</span>
              <div className="flex gap-1 shrink-0">
                {PER_TOPIC_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setTopicCount(tag, n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium border transition ${
                      (form.topicDistribution[tag] ?? 0) === n
                        ? "bg-[var(--accent-muted)] border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}

function UnsubscribeSection() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          action: "unsubscribe",
          email: email.trim(),
          unsubscribedAt: new Date().toISOString(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      setResult(data);
    } catch {
      setResult({ status: "error", message: "Network error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-slide rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 md:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] outline-none transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Unsubscribing…" : "Unsubscribe Me"}
        </button>
      </form>
      <UnsubscribeResult result={result} />
    </div>
  );
}

function UnsubscribeResult({ result }) {
  if (!result) return null;
  if (result.status === "success") {
    return (
      <div className="mt-6 p-4 rounded-xl border bg-[var(--success-muted)] text-[var(--success)] text-sm animate-fade-slide" style={{ borderColor: "var(--success)" }}>
        You have been unsubscribed. Sorry to see you go.
      </div>
    );
  }
  if (result.status === "not_found") {
    return (
      <div className="mt-6 p-4 rounded-xl border bg-[var(--warning-muted)] text-[var(--warning)] text-sm animate-fade-slide" style={{ borderColor: "var(--warning)" }}>
        This email is not in our subscriber list. Please check and try again.
      </div>
    );
  }
  return (
    <div className="mt-6 p-4 rounded-xl border bg-[var(--error-muted)] text-[var(--error)] text-sm animate-fade-slide" style={{ borderColor: "var(--error)" }}>
      {result.message || "Something went wrong. Please try again."}
    </div>
  );
}

export default NewsletterPage;
