import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  LayoutDashboard, FileText, Users, ShoppingCart, MessageSquare,
  BarChart3, Settings, Bell, Search, Plus, Trash2, Download,
  Send, CheckCircle, Clock, XCircle, TrendingUp, TrendingDown,
  Menu, X, ChevronRight, Star, Moon, Sun, Zap, Shield, Globe,
  Phone, Mail, MapPin, ArrowRight, Sparkles, Bot, Package,
  Truck, Home, ChevronDown, Filter, Edit, Eye, MoreVertical,
  IndianRupee, MessageCircle, QrCode, Printer, RefreshCw,
  AlertCircle, Activity, Users2, Receipt, Wallet, Award,
  Milk, Smartphone, Pill, GraduationCap, Shirt, Leaf,
} from "lucide-react";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { id: 1, name: "Raj Mobile Shop", mobile: "9876543210", orders: 47, pending: 4500, lastInvoice: "2026-05-14", city: "Lucknow", status: "active" },
  { id: 2, name: "Sharma Dairy", mobile: "9812345678", orders: 132, pending: 0, lastInvoice: "2026-05-15", city: "Kanpur", status: "active" },
  { id: 3, name: "Kuldeep Fertilizers", mobile: "9900112233", orders: 89, pending: 12000, lastInvoice: "2026-05-13", city: "Agra", status: "active" },
  { id: 4, name: "Alex Coaching Classes", mobile: "9123456789", orders: 214, pending: 0, lastInvoice: "2026-05-15", city: "Varanasi", status: "active" },
  { id: 5, name: "Priya Clothing Store", mobile: "9988776655", orders: 61, pending: 7200, lastInvoice: "2026-05-12", city: "Meerut", status: "pending" },
  { id: 6, name: "Gupta Medical", mobile: "9871234560", orders: 178, pending: 0, lastInvoice: "2026-05-15", city: "Allahabad", status: "active" },
  { id: 7, name: "Singh Electronics", mobile: "9765432100", orders: 34, pending: 3400, lastInvoice: "2026-05-10", city: "Bareilly", status: "inactive" },
  { id: 8, name: "Verma Kirana Store", mobile: "9654321098", orders: 95, pending: 1800, lastInvoice: "2026-05-14", city: "Mathura", status: "active" },
];

const INVOICES = [
  { id: "INV-2026-108", customer: "Raj Mobile Shop", amount: 4500, gst: 810, status: "paid", date: "2026-05-15" },
  { id: "INV-2026-107", customer: "Sharma Dairy", amount: 1200, gst: 216, status: "paid", date: "2026-05-15" },
  { id: "INV-2026-106", customer: "Kuldeep Fertilizers", amount: 12000, gst: 2160, status: "pending", date: "2026-05-13" },
  { id: "INV-2026-105", customer: "Alex Coaching Classes", amount: 8500, gst: 0, status: "paid", date: "2026-05-13" },
  { id: "INV-2026-104", customer: "Priya Clothing Store", amount: 7200, gst: 1296, status: "overdue", date: "2026-05-12" },
  { id: "INV-2026-103", customer: "Gupta Medical", amount: 3400, gst: 612, status: "paid", date: "2026-05-11" },
];

const ACTIVITY = [
  { id: 1, type: "invoice", text: "INV-2026-108 sent to Raj Mobile Shop", time: "2 min ago", icon: FileText, color: "text-blue-400" },
  { id: 2, type: "whatsapp", text: "WhatsApp sent to Sharma Dairy", time: "8 min ago", icon: MessageSquare, color: "text-green-400" },
  { id: 3, type: "payment", text: "₹8,500 received from Alex Coaching", time: "22 min ago", icon: IndianRupee, color: "text-emerald-400" },
  { id: 4, type: "customer", text: "New customer: Singh Electronics added", time: "1 hr ago", icon: Users, color: "text-violet-400" },
  { id: 5, type: "reminder", text: "Payment reminder sent to Priya Clothing", time: "2 hr ago", icon: Bell, color: "text-amber-400" },
];

const MONTHLY_REVENUE = [42000, 58000, 47000, 73000, 61000, 89000, 95000, 78000, 102000, 88000, 114000, 127000];
const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];

const TESTIMONIALS = [
  { name: "Ramesh Sharma", business: "Sharma Dairy, Kanpur", text: "Pehle manually bills banate the, ab 2 minute mein invoice ready ho jaata hai aur WhatsApp bhi chala jaata hai. Bahut accha software hai!", rating: 5, avatar: "RS" },
  { name: "Kuldeep Verma", business: "Kuldeep Fertilizers, Agra", text: "Season mein bahut busy rehta hoon, ye software ne meri bahut madad ki. Customers ko automatic reminder bhi chala jaata hai.", rating: 5, avatar: "KV" },
  { name: "Priya Agarwal", business: "Priya Clothing, Meerut", text: "Professional invoices dekh ke customers impress ho jaate hain. Download bhi ho jaata hai, GST bhi calculate ho jaata hai.", rating: 5, avatar: "PA" },
  { name: "Alex Thomas", business: "Alex Coaching, Varanasi", text: "Monthly fees reminder automatically students ko chala jaata hai. Arrears track karna ab easy ho gaya.", rating: 5, avatar: "AT" },
];

const PRICING = [
  { name: "Starter", price: 499, period: "month", features: ["50 Invoices/month", "100 WhatsApp Messages", "5 Customers", "PDF Download", "Basic Analytics"], popular: false, color: "from-slate-600 to-slate-700" },
  { name: "Professional", price: 1499, period: "month", features: ["Unlimited Invoices", "1000 WhatsApp Messages", "Unlimited Customers", "PDF Download", "Advanced Analytics", "Payment Reminders", "Priority Support"], popular: true, color: "from-violet-600 to-indigo-600" },
  { name: "Enterprise", price: 3999, period: "month", features: ["Everything in Pro", "Unlimited WhatsApp", "Multi Branch", "Custom Branding", "API Access", "Dedicated Support", "White Label"], popular: false, color: "from-amber-500 to-orange-600" },
];

// ─── UTILS ─────────────────────────────────────────────────────────────────
const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

function useCounter(end, duration = 1500, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration, start]);
  return [count, ref];
}

// ─── THEME ─────────────────────────────────────────────────────────────────
const DARK = {
  bg: "bg-[#09090f]",
  card: "bg-[#111118] border border-[#1e1e2e]",
  sidebar: "bg-[#0d0d16] border-r border-[#1e1e2e]",
  nav: "bg-[#09090f]/80 border-b border-[#1e1e2e]",
  text: "text-slate-100",
  muted: "text-slate-400",
  input: "bg-[#1a1a26] border-[#2a2a3e] text-slate-100 placeholder-slate-500",
};
const LIGHT = {
  bg: "bg-slate-50",
  card: "bg-white border border-slate-200",
  sidebar: "bg-white border-r border-slate-200",
  nav: "bg-white/90 border-b border-slate-200",
  text: "text-slate-900",
  muted: "text-slate-500",
  input: "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400",
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [page, setPage] = useState("landing");
  const [dashPage, setDashPage] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const T = dark ? DARK : LIGHT;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className={`${T.bg} ${T.text} min-h-screen font-sans transition-colors duration-300`}
      style={{ fontFamily: "'DM Sans', 'Sora', system-ui, sans-serif" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Sora:wght@300;400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3b3b5c; border-radius: 4px; }
        .gradient-text {
          background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glow { box-shadow: 0 0 40px rgba(139,92,246,0.25); }
        .glow-green { box-shadow: 0 0 30px rgba(52,211,153,0.2); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-glow { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .float { animation: float 4s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -60, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-medium text-sm ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            <CheckCircle size={18} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI FLOATING BUTTON */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => { setAiOpen(!aiOpen); if (!aiOpen) showToast("AI Assistant activated!"); }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl glow"
      >
        <Bot size={24} className="text-white" />
      </motion.button>

      {/* WA FLOATING BUTTON */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        href="https://wa.me/919876543210"
        target="_blank" rel="noopener"
        className="fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-2xl"
      >
        <MessageCircle size={22} className="text-white" />
      </motion.a>

      {/* DARK TOGGLE */}
      {page !== "dashboard" && (
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={() => setDark(!dark)}
          className={`fixed top-5 right-20 z-50 w-9 h-9 rounded-full ${T.card} flex items-center justify-center`}
        >
          {dark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-600" />}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {page === "landing" ? (
          <motion.div key="landing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage T={T} dark={dark} setPage={setPage} showToast={showToast} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} />
          </motion.div>
        ) : (
          <motion.div key="dashboard"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardLayout T={T} dark={dark} setDark={setDark} dashPage={dashPage} setDashPage={setDashPage} setPage={setPage} showToast={showToast} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LANDING PAGE ──────────────────────────────────────────────────────────
function LandingPage({ T, dark, setPage, showToast, mobileMenu, setMobileMenu }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* NAV */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? T.nav + " backdrop-blur-xl" : "bg-transparent"} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "Sora, sans-serif" }}>Kuldeep Billing <span className="gradient-text">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Features", "How It Works", "Pricing", "FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className={`${T.muted} hover:text-violet-400 transition-colors`}>{l}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setPage("dashboard")}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold glow"
            >
              View Demo →
            </motion.button>
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`md:hidden mt-4 ${T.card} rounded-2xl p-4 flex flex-col gap-3`}>
            {["Features", "Pricing", "FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className={T.muted + " text-sm"} onClick={() => setMobileMenu(false)}>{l}</a>
            ))}
            <button onClick={() => setPage("dashboard")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold">View Demo</button>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 pb-16 px-6 relative overflow-hidden">
        {/* Bg blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pulse-glow pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pulse-glow pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pulse-glow pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
              <Sparkles size={12} /> AI-Powered Billing System • Made for India
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "Sora, sans-serif" }}>
              Generate Invoices &<br />
              <span className="gradient-text">Send WhatsApp</span><br />
              Updates Automatically
            </h1>
            <p className={`${T.muted} text-lg mb-8 leading-relaxed max-w-lg`}>
              Perfect for <strong className="text-violet-400">shops, dairy businesses, coaching centers, mobile stores,</strong> and local businesses across India. Bill smarter, grow faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setPage("dashboard")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-base glow flex items-center gap-2"
              >
                <Eye size={18} /> View Demo
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => { setPage("dashboard"); }}
                className={`px-8 py-4 rounded-2xl ${T.card} font-semibold text-base flex items-center gap-2`}
              >
                <FileText size={18} /> Generate Invoice
              </motion.button>
            </div>
            <div className="mt-10 flex items-center gap-6">
              {[["2,400+", "Businesses"], ["₹12 Cr+", "Revenue Processed"], ["4.9★", "Rating"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-xl font-bold text-violet-400">{v}</div>
                  <div className={`text-xs ${T.muted}`}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* DASHBOARD PREVIEW */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="float hidden md:block">
            <DashboardPreview T={T} dark={dark} />
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <StatsSection T={T} />

      {/* FEATURES */}
      <FeaturesSection T={T} dark={dark} />

      {/* HOW IT WORKS */}
      <HowItWorks T={T} dark={dark} />

      {/* BUSINESS TYPES */}
      <BusinessTypes T={T} dark={dark} />

      {/* TESTIMONIALS */}
      <TestimonialsSection T={T} dark={dark} />

      {/* PRICING */}
      <PricingSection T={T} dark={dark} showToast={showToast} />

      {/* FAQ */}
      <FAQSection T={T} dark={dark} />

      {/* CONTACT */}
      <ContactSection T={T} dark={dark} showToast={showToast} />

      {/* FOOTER */}
      <Footer T={T} dark={dark} />
    </div>
  );
}

// ─── MINI DASHBOARD PREVIEW ────────────────────────────────────────────────
function DashboardPreview({ T, dark }) {
  return (
    <div className={`${T.card} rounded-3xl p-4 shadow-2xl glow relative max-w-md`}>
      <div className={`flex items-center gap-2 mb-3 px-2`}>
        {["#ef4444","#f59e0b","#22c55e"].map(c=><div key={c} style={{background:c}} className="w-3 h-3 rounded-full"/>)}
        <span className={`text-xs ${T.muted} ml-2`}>kuldeep-billing.ai</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[["₹1,14,200", "Revenue", "↑12%", "from-violet-600/20 to-indigo-600/20"],
          ["108", "Invoices", "↑8%", "from-emerald-600/20 to-teal-600/20"],
          ["2,847", "Messages", "↑22%", "from-blue-600/20 to-cyan-600/20"],
          ["₹23,700", "Pending", "3 due", "from-amber-600/20 to-orange-600/20"]].map(([v,l,s,g])=>(
          <div key={l} className={`bg-gradient-to-br ${g} rounded-2xl p-3 border ${dark?"border-white/5":"border-black/5"}`}>
            <div className="text-sm font-bold">{v}</div>
            <div className={`text-xs ${T.muted}`}>{l}</div>
            <div className="text-xs text-emerald-400">{s}</div>
          </div>
        ))}
      </div>
      {/* Mini bar chart */}
      <div className={`bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-2xl p-3 border ${dark?"border-white/5":"border-black/5"}`}>
        <div className={`text-xs font-medium mb-2`}>Monthly Revenue</div>
        <div className="flex items-end gap-1 h-14">
          {[42,58,47,73,61,89,95,78,102,88,114,127].map((v,i)=>(
            <motion.div key={i}
              initial={{ height: 0 }} animate={{ height: `${(v/127)*100}%` }} transition={{ delay: i*0.05, duration: 0.5 }}
              className="flex-1 rounded-t-sm"
              style={{ background: i === 11 ? "linear-gradient(to top, #7c3aed, #4f46e5)" : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
            />
          ))}
        </div>
      </div>
      {/* Recent activity */}
      <div className="mt-3 space-y-1">
        {ACTIVITY.slice(0,3).map(a=>(
          <div key={a.id} className={`flex items-center gap-2 text-xs ${T.muted} p-2 rounded-xl ${dark?"hover:bg-white/5":"hover:bg-black/3"}`}>
            <a.icon size={12} className={a.color} />
            <span className="truncate">{a.text}</span>
            <span className="ml-auto whitespace-nowrap opacity-60">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STATS ─────────────────────────────────────────────────────────────────
function StatsSection({ T }) {
  const [c1, r1] = useCounter(2400);
  const [c2, r2] = useCounter(108000);
  const [c3, r3] = useCounter(1200000000);
  const [c4, r4] = useCounter(99);

  return (
    <section ref={r1} className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { ref: r1, val: c1, suffix: "+", label: "Businesses Using" },
          { ref: r2, val: c2, suffix: "+", label: "Invoices Generated" },
          { ref: r3, val: c3, suffix: "+", label: "Revenue Processed", prefix: "₹", divide: 10000000, unit: "Cr" },
          { ref: r4, val: c4, suffix: "%", label: "Uptime Guaranteed" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className={`${T.card} rounded-2xl p-6 text-center`}>
            <div className="text-3xl font-bold gradient-text" style={{ fontFamily: "Sora, sans-serif" }}>
              {s.prefix || ""}{s.divide ? (s.val / s.divide).toFixed(0) : s.val.toLocaleString("en-IN")}{s.unit || ""}{s.suffix}
            </div>
            <div className={`text-sm ${T.muted} mt-1`}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── FEATURES ──────────────────────────────────────────────────────────────
function FeaturesSection({ T, dark }) {
  const features = [
    { icon: FileText, title: "Smart Invoice Generator", desc: "Professional GST invoices with auto-calculation, QR codes and your business branding.", color: "from-violet-500 to-indigo-500" },
    { icon: MessageSquare, title: "WhatsApp Auto Sender", desc: "Send invoices directly to customer WhatsApp with one click. No extra apps needed.", color: "from-green-500 to-emerald-500" },
    { icon: Users, title: "Customer Management", desc: "Complete customer database with purchase history, pending dues, and contact details.", color: "from-blue-500 to-cyan-500" },
    { icon: Download, title: "PDF Download", desc: "Download beautifully designed PDF invoices instantly for printing or email.", color: "from-amber-500 to-orange-500" },
    { icon: Bell, title: "Payment Reminders", desc: "Automatic payment reminder messages to customers with overdue invoices.", color: "from-red-500 to-pink-500" },
    { icon: Package, title: "Order Tracking", desc: "Track order status from placement to delivery with animated timeline view.", color: "from-teal-500 to-cyan-500" },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
            <Sparkles size={12} /> Powerful Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Everything Your Business Needs
          </h2>
          <p className={`${T.muted} text-lg max-w-2xl mx-auto`}>
            From invoice generation to WhatsApp delivery — complete billing automation for Indian small businesses.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`${T.card} rounded-3xl p-6 cursor-pointer group transition-all duration-300`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className={`${T.muted} text-sm leading-relaxed`}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────
function HowItWorks({ T, dark }) {
  const steps = [
    { icon: Users, title: "Add Customer", desc: "Enter customer name, mobile number and business details in seconds.", color: "from-violet-500 to-indigo-500", num: "01" },
    { icon: FileText, title: "Generate Bill", desc: "Add products, quantities, prices and GST. Invoice auto-calculates total.", color: "from-blue-500 to-cyan-500", num: "02" },
    { icon: MessageSquare, title: "Send WhatsApp", desc: "Click one button — invoice and payment link sent to customer's WhatsApp.", color: "from-green-500 to-emerald-500", num: "03" },
    { icon: CheckCircle, title: "Customer Receives", desc: "Customer gets a beautiful PDF invoice instantly on their phone.", color: "from-amber-500 to-orange-500", num: "04" },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className={`${T.muted} text-lg`}>4 simple steps to automate your billing</p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-violet-500 via-blue-500 via-green-500 to-amber-500 opacity-30" />
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className={`${T.card} rounded-3xl p-6 text-center relative`}>
              <div className="absolute -top-3 right-4 text-5xl font-black opacity-10" style={{ fontFamily: "Sora" }}>{s.num}</div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4`}>
                <s.icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className={`${T.muted} text-sm`}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BUSINESS TYPES ────────────────────────────────────────────────────────
function BusinessTypes({ T, dark }) {
  const types = [
    { icon: Milk, title: "Dairy Shop", stat: "Daily milk bills", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/20" },
    { icon: Smartphone, title: "Mobile Store", stat: "Repair & sales billing", color: "from-violet-500/20 to-indigo-500/20", border: "border-violet-500/20" },
    { icon: Pill, title: "Medical Store", stat: "Medicine invoices", color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/20" },
    { icon: GraduationCap, title: "Coaching Class", stat: "Monthly fee receipts", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20" },
    { icon: Shirt, title: "Clothing Shop", stat: "GST billing", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20" },
    { icon: Leaf, title: "Fertilizer Shop", stat: "Seasonal invoices", color: "from-teal-500/20 to-green-500/20", border: "border-teal-500/20" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Built for <span className="gradient-text">Every Business</span>
          </h2>
          <p className={`${T.muted} text-lg`}>Works perfectly for all types of local businesses</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {types.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.05 }}
              className={`bg-gradient-to-br ${t.color} border ${t.border} rounded-3xl p-5 text-center cursor-pointer transition-all duration-300`}>
              <t.icon size={32} className="mx-auto mb-3 opacity-80" />
              <div className="font-semibold text-sm">{t.title}</div>
              <div className={`text-xs ${T.muted} mt-1`}>{t.stat}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────
function TestimonialsSection({ T, dark }) {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Loved by <span className="gradient-text">Business Owners</span>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`${T.card} rounded-3xl p-6`}>
              <div className="flex gap-1 mb-4">
                {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className={`${T.muted} text-sm leading-relaxed mb-4`}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className={`text-xs ${T.muted}`}>{t.business}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ───────────────────────────────────────────────────────────────
function PricingSection({ T, dark, showToast }) {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className={`${T.muted} text-lg`}>No hidden charges. Cancel anytime.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRICING.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`${T.card} rounded-3xl p-6 relative ${p.popular ? "glow ring-2 ring-violet-500/50" : ""}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-xs font-semibold text-white">Most Popular</div>
              )}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} mb-4`} />
              <div className="font-bold text-lg mb-1">{p.name}</div>
              <div className="mb-4">
                <span className="text-4xl font-black" style={{ fontFamily: "Sora" }}>₹{p.price}</span>
                <span className={`${T.muted} text-sm`}>/{p.period}</span>
              </div>
              <div className="space-y-2 mb-6">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                    <span className={T.muted}>{f}</span>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => showToast(`${p.name} plan selected! Demo only.`)}
                className={`w-full py-3 rounded-2xl font-semibold text-sm ${p.popular ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : `${T.card} border`}`}>
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function FAQSection({ T, dark }) {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Kya yeh software GST invoice banata hai?", a: "Haan, Kuldeep Billing AI automatically CGST, SGST aur IGST calculate karta hai aur GST-compliant invoices generate karta hai." },
    { q: "WhatsApp message kaise bhejta hai?", a: "System customer ke registered mobile number par directly WhatsApp Business API ke through invoice PDF aur payment link bhejta hai." },
    { q: "Kya internet zaruri hai?", a: "Basic invoicing ke liye minimal internet chahiye. WhatsApp sending ke liye active internet connection zaroori hai." },
    { q: "Multiple branches ke liye kaam karta hai?", a: "Enterprise plan mein multiple branches aur locations support hai. Har branch ka alag dashboard hota hai." },
    { q: "Data safe hai?", a: "Haan, sab data encrypted cloud servers par store hota hai. Regular backups bhi hote hain." },
    { q: "Free trial milega?", a: "Haan, 14 din ka free trial milta hai. Koi credit card nahi chahiye." },
  ];

  return (
    <section id="faq" className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`${T.card} rounded-2xl overflow-hidden cursor-pointer`} onClick={() => setOpen(open === i ? null : i)}>
              <div className="p-5 flex items-center justify-between">
                <span className="font-medium text-sm">{f.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }}><ChevronDown size={18} className={T.muted} /></motion.div>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.25 }}>
                    <div className={`px-5 pb-5 text-sm ${T.muted}`}>{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ───────────────────────────────────────────────────────────────
function ContactSection({ T, dark, showToast }) {
  const [form, setForm] = useState({ name: "", mobile: "", message: "" });

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "Sora" }}>
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className={`${T.muted} mb-8`}>Ready to automate your billing? Contact us for a free demo.</p>
          {[
            [Phone, "+91 98765 43210"],
            [Mail, "kuldeep@billingai.in"],
            [MapPin, "Lucknow, Uttar Pradesh, India"],
          ].map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Icon size={18} className="text-violet-400" />
              </div>
              <span className={`text-sm ${T.muted}`}>{text}</span>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          className={`${T.card} rounded-3xl p-6`}>
          {["name", "mobile", "message"].map(field => (
            <div key={field} className="mb-4">
              <label className={`text-xs font-medium ${T.muted} uppercase tracking-wide mb-1 block`}>{field}</label>
              {field === "message" ? (
                <textarea rows={4} className={`w-full px-4 py-3 rounded-xl border ${T.input} text-sm outline-none focus:border-violet-500 resize-none`}
                  placeholder={`Enter your ${field}`} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
              ) : (
                <input className={`w-full px-4 py-3 rounded-xl border ${T.input} text-sm outline-none focus:border-violet-500`}
                  placeholder={`Enter your ${field}`} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
              )}
            </div>
          ))}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { showToast("Message sent! We'll contact you soon."); setForm({ name: "", mobile: "", message: "" }); }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm">
            Send Message →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer({ T, dark }) {
  return (
    <footer className={`border-t ${dark ? "border-[#1e1e2e]" : "border-slate-200"} py-12 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-bold" style={{ fontFamily: "Sora" }}>Kuldeep Billing AI</span>
            </div>
            <p className={`text-sm ${T.muted}`}>Smart billing software for Indian small businesses.</p>
          </div>
          {[
            ["Product", ["Features", "Pricing", "Updates", "Roadmap"]],
            ["Company", ["About", "Blog", "Careers", "Press"]],
            ["Support", ["Help Center", "WhatsApp Support", "Contact", "Privacy Policy"]],
          ].map(([title, links]) => (
            <div key={title}>
              <div className="font-semibold text-sm mb-3">{title}</div>
              {links.map(l => <div key={l} className={`text-sm ${T.muted} mb-2 cursor-pointer hover:text-violet-400 transition-colors`}>{l}</div>)}
            </div>
          ))}
        </div>
        <div className={`border-t ${dark ? "border-[#1e1e2e]" : "border-slate-200"} pt-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
          <p className={`text-sm ${T.muted}`}>© 2026 Kuldeep Billing AI. All rights reserved.</p>
          <p className={`text-sm ${T.muted}`}>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

// ─── DASHBOARD LAYOUT ──────────────────────────────────────────────────────
function DashboardLayout({ T, dark, setDark, dashPage, setDashPage, setPage, showToast }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "invoice", icon: FileText, label: "Create Invoice" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
    { id: "whatsapp", icon: MessageSquare, label: "WhatsApp" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${T.bg}`}>
      {/* Sidebar */}
      <motion.div
        className={`${T.sidebar} flex-shrink-0 flex flex-col z-30 ${sidebarOpen ? "w-64" : "w-16 md:w-56"} transition-all duration-300 fixed md:relative h-full`}
        animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -224 }}
      >
        <div className="p-4 flex items-center gap-3 h-16 border-b border-inherit">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm hidden md:block" style={{ fontFamily: "Sora" }}>Kuldeep Billing</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <motion.button key={item.id} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setDashPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${dashPage === item.id ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-400 border border-violet-500/20" : `${T.muted} hover:bg-white/5`}`}>
              <item.icon size={18} className="shrink-0" />
              <span className="hidden md:block">{item.label}</span>
            </motion.button>
          ))}
        </nav>
        <div className="p-3 border-t border-inherit">
          <button onClick={() => setPage("landing")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${T.muted} hover:bg-white/5`}>
            <Globe size={18} className="shrink-0" />
            <span className="hidden md:block">View Landing</span>
          </button>
        </div>
      </motion.div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className={`${T.nav} backdrop-blur-xl h-16 flex items-center px-4 gap-4 shrink-0`}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2">
            <Menu size={20} />
          </button>
          <div className={`flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl border ${T.input} text-sm`}>
            <Search size={14} className={T.muted} />
            <input className="bg-transparent outline-none flex-1 text-sm" placeholder="Search..." />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className={`w-9 h-9 rounded-xl ${T.card} flex items-center justify-center`}>
              {dark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
            </button>
            <button className={`w-9 h-9 rounded-xl ${T.card} flex items-center justify-center relative`}>
              <Bell size={15} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">KV</div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={dashPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {dashPage === "dashboard" && <DashboardHome T={T} dark={dark} />}
              {dashPage === "invoice" && <InvoicePage T={T} dark={dark} showToast={showToast} />}
              {dashPage === "customers" && <CustomersPage T={T} dark={dark} showToast={showToast} />}
              {dashPage === "orders" && <OrdersPage T={T} dark={dark} />}
              {dashPage === "whatsapp" && <WhatsAppPage T={T} dark={dark} showToast={showToast} />}
              {dashPage === "analytics" && <AnalyticsPage T={T} dark={dark} />}
              {dashPage === "settings" && <SettingsPage T={T} dark={dark} showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden" />}
    </div>
  );
}

// ─── DASHBOARD HOME ────────────────────────────────────────────────────────
function DashboardHome({ T, dark }) {
  const [rev, revRef] = useCounter(114200);
  const [inv, invRef] = useCounter(108);
  const [msg, msgRef] = useCounter(2847);
  const [pen, penRef] = useCounter(23700);

  const cards = [
    { ref: revRef, val: rev, label: "Total Revenue", icon: IndianRupee, change: "+12.4%", up: true, color: "from-violet-600 to-indigo-600", prefix: "₹" },
    { ref: invRef, val: inv, label: "Invoices Generated", icon: FileText, change: "+8.2%", up: true, color: "from-blue-600 to-cyan-600" },
    { ref: msgRef, val: msg, label: "WhatsApp Sent", icon: MessageSquare, change: "+22.1%", up: true, color: "from-green-600 to-emerald-600" },
    { ref: penRef, val: pen, label: "Pending Payments", icon: Wallet, change: "3 overdue", up: false, color: "from-amber-500 to-orange-500", prefix: "₹" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>Good Morning, Kuldeep! 👋</h1>
        <p className={T.muted + " text-sm mt-1"}>Here's what's happening with your business today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <motion.div key={i} ref={c.ref} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`${T.card} rounded-2xl p-4 relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${c.color} opacity-10 rounded-full -translate-y-6 translate-x-6`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
              <c.icon size={18} className="text-white" />
            </div>
            <div className="text-xl font-bold">{c.prefix || ""}{c.val.toLocaleString("en-IN")}</div>
            <div className={`text-xs ${T.muted} mt-1`}>{c.label}</div>
            <div className={`text-xs mt-1 font-medium ${c.up ? "text-emerald-400" : "text-amber-400"}`}>
              {c.up ? <TrendingUp size={10} className="inline mr-1" /> : <AlertCircle size={10} className="inline mr-1" />}
              {c.change}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className={`${T.card} rounded-2xl p-4 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold">Revenue Overview</div>
              <div className={`text-xs ${T.muted}`}>Last 12 months</div>
            </div>
            <div className="text-sm font-semibold text-emerald-400">↑ 12.4% vs last year</div>
          </div>
          <div className="flex items-end gap-1.5 h-32">
            {MONTHLY_REVENUE.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(v / 127000) * 100}%` }}
                  transition={{ delay: i * 0.04, duration: 0.6, ease: "easeOut" }}
                  className="w-full rounded-t-md"
                  style={{ background: i === 11 ? "linear-gradient(to top, #7c3aed, #4f46e5)" : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
                />
                <span className={`text-[9px] ${T.muted}`}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className={`${T.card} rounded-2xl p-4`}>
          <div className="font-semibold mb-4">Live Activity</div>
          <div className="space-y-3">
            {ACTIVITY.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-3 text-xs p-2 rounded-xl ${dark ? "hover:bg-white/5" : "hover:bg-black/3"}`}>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br from-${a.color.split("-")[1]}-500/20 to-${a.color.split("-")[1]}-600/20 flex items-center justify-center shrink-0`}>
                  <a.icon size={13} className={a.color} />
                </div>
                <div className="flex-1">
                  <div className="leading-snug">{a.text}</div>
                  <div className={T.muted + " mt-0.5"}>{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className={`${T.card} rounded-2xl p-4 mt-4`}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">Recent Invoices</div>
          <button className="text-violet-400 text-xs font-medium">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={T.muted + " text-xs"}>
                {["Invoice ID", "Customer", "Amount", "Status", "Date"].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className={`border-t ${dark ? "border-white/5" : "border-slate-100"}`}>
                  <td className="py-3 pr-4 font-mono text-xs text-violet-400">{inv.id}</td>
                  <td className="py-3 pr-4 font-medium text-sm">{inv.customer}</td>
                  <td className="py-3 pr-4 font-semibold">{formatINR(inv.amount)}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className={`py-3 text-xs ${T.muted}`}>{inv.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${map[status] || map.pending}`}>{status}</span>
  );
}

// ─── INVOICE PAGE ──────────────────────────────────────────────────────────
function InvoicePage({ T, dark, showToast }) {
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
  const [form, setForm] = useState({ customer: "", mobile: "", gst: 18, status: "unpaid", business: "Kuldeep Enterprises" });
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const invoiceId = "INV-2026-" + Math.floor(100 + Math.random() * 900);
  const today = new Date().toLocaleDateString("en-IN");
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const gstAmt = (subtotal * form.gst) / 100;
  const total = subtotal + gstAmt;

  const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const handleSend = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); showToast("Invoice sent on WhatsApp!"); }, 2200);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>Create Invoice</h1>
          <p className={T.muted + " text-sm mt-1"}>Generate professional GST invoice</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setPreview(!preview)}
            className={`px-4 py-2 rounded-xl ${T.card} text-sm font-medium flex items-center gap-2`}>
            <Eye size={16} /> {preview ? "Edit" : "Preview"}
          </motion.button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div className={`${T.card} rounded-2xl p-5`}>
            <div className="font-semibold mb-4 text-sm">Customer Details</div>
            <div className="grid grid-cols-2 gap-3">
              {[["customer", "Customer Name", "Raj Mobile Shop"], ["mobile", "Mobile Number", "9876543210"]].map(([k, l, p]) => (
                <div key={k}>
                  <label className={`text-xs ${T.muted} mb-1 block`}>{l}</label>
                  <input className={`w-full px-3 py-2.5 rounded-xl border ${T.input} text-sm outline-none focus:border-violet-500`}
                    placeholder={p} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>

          <div className={`${T.card} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold text-sm">Products / Services</div>
              <button onClick={addItem} className="flex items-center gap-1 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-lg bg-violet-500/10">
                <Plus size={14} /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-[1fr_60px_80px_32px] gap-2 items-center">
                  <input className={`px-3 py-2 rounded-xl border ${T.input} text-xs outline-none focus:border-violet-500`}
                    placeholder="Item name" value={it.name} onChange={e => updateItem(i, "name", e.target.value)} />
                  <input type="number" className={`px-2 py-2 rounded-xl border ${T.input} text-xs outline-none text-center focus:border-violet-500`}
                    placeholder="Qty" value={it.qty} onChange={e => updateItem(i, "qty", +e.target.value)} />
                  <input type="number" className={`px-2 py-2 rounded-xl border ${T.input} text-xs outline-none focus:border-violet-500`}
                    placeholder="Price" value={it.price} onChange={e => updateItem(i, "price", +e.target.value)} />
                  <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={`${T.card} rounded-2xl p-5`}>
            <div className="font-semibold mb-4 text-sm">Billing Details</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={`text-xs ${T.muted} mb-1 block`}>GST %</label>
                <select className={`w-full px-3 py-2.5 rounded-xl border ${T.input} text-sm outline-none`} value={form.gst} onChange={e => setForm({ ...form, gst: +e.target.value })}>
                  {[0, 5, 12, 18, 28].map(g => <option key={g} value={g}>{g}%</option>)}
                </select>
              </div>
              <div>
                <label className={`text-xs ${T.muted} mb-1 block`}>Payment Status</label>
                <select className={`w-full px-3 py-2.5 rounded-xl border ${T.input} text-sm outline-none`} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
            <div className={`border-t ${dark ? "border-white/10" : "border-slate-100"} pt-3 space-y-2 text-sm`}>
              <div className="flex justify-between"><span className={T.muted}>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className={T.muted}>GST ({form.gst}%)</span><span>{formatINR(gstAmt)}</span></div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span className="text-violet-400">{formatINR(total)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => showToast("PDF downloaded!")}
              className={`flex-1 py-3 rounded-2xl ${T.card} text-sm font-semibold flex items-center justify-center gap-2`}>
              <Download size={16} /> Download PDF
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSend}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2">
              {sending ? <RefreshCw size={16} className="animate-spin" /> : sent ? <CheckCircle size={16} /> : <MessageSquare size={16} />}
              {sending ? "Sending..." : sent ? "Sent!" : "Send WhatsApp"}
            </motion.button>
          </div>
        </div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={`${T.card} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-black text-xl gradient-text" style={{ fontFamily: "Sora" }}>INVOICE</div>
                <div className={`text-xs ${T.muted}`}>{invoiceId}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{form.business || "Your Business"}</div>
                <div className={`text-xs ${T.muted}`}>Lucknow, UP</div>
                <div className={`text-xs ${T.muted}`}>GSTIN: 09AAAA1234P1Z5</div>
              </div>
            </div>

            <div className={`flex justify-between mb-6 pb-4 border-b ${dark ? "border-white/10" : "border-slate-100"}`}>
              <div>
                <div className={`text-xs ${T.muted} mb-1`}>Bill To:</div>
                <div className="font-semibold">{form.customer || "Customer Name"}</div>
                <div className={`text-xs ${T.muted}`}>{form.mobile || "Mobile Number"}</div>
              </div>
              <div className="text-right">
                <div className={`text-xs ${T.muted}`}>Date: {today}</div>
                <div className={`text-xs ${T.muted} mt-1`}>Due: {today}</div>
                <div className="mt-2"><StatusBadge status={form.status === "paid" ? "paid" : form.status === "partial" ? "pending" : "pending"} /></div>
              </div>
            </div>

            <table className="w-full text-sm mb-4">
              <thead>
                <tr className={`${T.muted} text-xs`}>
                  <th className="text-left pb-2">Item</th>
                  <th className="text-center pb-2">Qty</th>
                  <th className="text-right pb-2">Price</th>
                  <th className="text-right pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className={`border-t ${dark ? "border-white/5" : "border-slate-50"}`}>
                    <td className="py-1.5">{it.name || `Item ${i + 1}`}</td>
                    <td className="py-1.5 text-center">{it.qty}</td>
                    <td className={`py-1.5 text-right ${T.muted}`}>{formatINR(it.price)}</td>
                    <td className="py-1.5 text-right font-medium">{formatINR(it.qty * it.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={`border-t ${dark ? "border-white/10" : "border-slate-100"} pt-3 space-y-1 text-sm`}>
              <div className="flex justify-between text-xs"><span className={T.muted}>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between text-xs"><span className={T.muted}>GST ({form.gst}%)</span><span>{formatINR(gstAmt)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-dashed pt-2 mt-2">
                <span>Total Amount</span><span className="text-violet-400">{formatINR(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl ${dark ? "bg-white/10" : "bg-slate-100"} flex items-center justify-center`}>
                <QrCode size={28} className={T.muted} />
              </div>
              <div>
                <div className={`text-xs ${T.muted}`}>Scan to pay</div>
                <div className="text-xs font-medium text-violet-400">UPI / PhonePe / GPay</div>
              </div>
              <div className="ml-auto">
                <div className={`text-xs ${T.muted}`}>Powered by</div>
                <div className="text-xs font-bold gradient-text">Kuldeep Billing AI</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── CUSTOMERS PAGE ────────────────────────────────────────────────────────
function CustomersPage({ T, dark, showToast }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search)
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>Customers</h1>
          <p className={T.muted + " text-sm mt-1"}>{CUSTOMERS.length} total customers</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => showToast("Add customer form opened!")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Customer
        </motion.button>
      </div>

      <div className={`${T.card} rounded-2xl p-4 mb-4`}>
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${T.input} text-sm w-full max-w-sm`}>
          <Search size={14} className={T.muted} />
          <input className="bg-transparent outline-none flex-1 text-sm"
            placeholder="Search customers..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className={`${T.card} rounded-2xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${T.muted} text-xs border-b ${dark ? "border-white/10" : "border-slate-100"}`}>
                {["Customer", "Mobile", "City", "Orders", "Pending", "Last Invoice", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className={`border-b ${dark ? "border-white/5" : "border-slate-50"} hover:${dark ? "bg-white/3" : "bg-slate-50"} transition-colors`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${T.muted}`}>{c.mobile}</td>
                  <td className={`px-4 py-3 text-sm ${T.muted}`}>{c.city}</td>
                  <td className="px-4 py-3 text-sm font-medium">{c.orders}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{c.pending > 0 ? <span className="text-amber-400">{formatINR(c.pending)}</span> : <span className="text-emerald-400">Clear</span>}</td>
                  <td className={`px-4 py-3 text-xs ${T.muted}`}>{c.lastInvoice}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => showToast(`Invoice for ${c.name} created!`)} className="text-violet-400 hover:text-violet-300 p-1"><FileText size={14} /></button>
                      <button onClick={() => showToast(`WhatsApp sent to ${c.name}!`)} className="text-green-400 hover:text-green-300 p-1"><MessageSquare size={14} /></button>
                      <button className={`${T.muted} hover:text-slate-200 p-1`}><Edit size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`px-4 py-3 flex items-center justify-between border-t ${dark ? "border-white/10" : "border-slate-100"}`}>
          <span className={`text-xs ${T.muted}`}>Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-medium ${page === i + 1 ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white" : `${T.card}`}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ORDERS PAGE ───────────────────────────────────────────────────────────
function OrdersPage({ T, dark }) {
  const orders = [
    { id: "ORD-2026-089", customer: "Raj Mobile Shop", item: "Samsung Charger x3", amount: 1800, status: 3, date: "May 15" },
    { id: "ORD-2026-088", customer: "Sharma Dairy", item: "Packaging Material x50", amount: 2400, status: 4, date: "May 14" },
    { id: "ORD-2026-087", customer: "Kuldeep Fertilizers", item: "DAP Fertilizer x10 bags", amount: 8500, status: 2, date: "May 13" },
    { id: "ORD-2026-086", customer: "Priya Clothing Store", item: "Cotton Fabric x20m", amount: 4200, status: 1, date: "May 13" },
  ];
  const stages = ["Ordered", "Processing", "Packed", "Delivered"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>Order Tracking</h1>
        <p className={T.muted + " text-sm mt-1"}>Real-time order status updates</p>
      </div>
      <div className="space-y-4">
        {orders.map((o, i) => (
          <motion.div key={o.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`${T.card} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-violet-400">{o.id}</span>
                  <span className={`text-xs ${T.muted}`}>• {o.date}</span>
                </div>
                <div className="font-semibold mt-0.5">{o.customer}</div>
                <div className={`text-xs ${T.muted}`}>{o.item}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-violet-400">{formatINR(o.amount)}</div>
              </div>
            </div>
            {/* Timeline */}
            <div className="flex items-center">
              {stages.map((s, si) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: si * 0.1 + i * 0.1 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${si < o.status ? "bg-gradient-to-br from-violet-600 to-indigo-600 border-violet-500 text-white" : si === o.status - 1 ? "border-violet-400 text-violet-400 bg-violet-500/10" : `${dark ? "border-white/20 text-slate-500" : "border-slate-200 text-slate-400"}`}`}>
                      {si < o.status ? <CheckCircle size={14} /> : si + 1}
                    </motion.div>
                    <span className={`text-[10px] mt-1 whitespace-nowrap ${si < o.status ? "text-violet-400" : T.muted}`}>{s}</span>
                  </div>
                  {si < stages.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1 mb-4 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }} animate={{ width: si < o.status - 1 ? "100%" : "0%" }}
                        transition={{ duration: 0.6, delay: si * 0.15 }}
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      />
                      <div className={`h-full w-full ${dark ? "bg-white/10" : "bg-slate-100"} -mt-0.5`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── WHATSAPP PAGE ─────────────────────────────────────────────────────────
function WhatsAppPage({ T, dark, showToast }) {
  const [selected, setSelected] = useState(0);
  const [sending, setSending] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());

  const messages = CUSTOMERS.slice(0, 5).map((c, i) => ({
    ...c,
    invoiceId: `INV-2026-${108 - i}`,
    amount: [4500, 1200, 12000, 8500, 7200][i],
    msg: `Hello ${c.name.split(" ")[0]} Ji, aapka invoice ${`INV-2026-${108 - i}`} successfully generate ho gaya hai. Total Amount: ${formatINR([4500, 1200, 12000, 8500, 7200][i])}. Payment link: pay.kuldeep.ai/${`INV-2026-${108 - i}`}`,
  }));

  const handleSend = (id) => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentIds(prev => new Set([...prev, id]));
      showToast(`Invoice sent to ${messages.find(m => m.id === id)?.name}!`);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>WhatsApp Sender</h1>
        <p className={T.muted + " text-sm mt-1"}>Send invoices directly to customers' WhatsApp</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Customer List */}
        <div className={`${T.card} rounded-2xl p-3 lg:col-span-2`}>
          <div className={`text-xs font-semibold ${T.muted} uppercase tracking-wide px-2 mb-3`}>Pending Messages</div>
          <div className="space-y-1">
            {messages.map((m, i) => (
              <motion.div key={m.id} whileHover={{ x: 3 }}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selected === i ? "bg-violet-500/10 border border-violet-500/20" : dark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{m.name}</div>
                  <div className={`text-xs ${T.muted} truncate`}>{m.invoiceId} • {formatINR(m.amount)}</div>
                </div>
                {sentIds.has(m.id) && <CheckCircle size={14} className="text-emerald-400 shrink-0" />}
              </motion.div>
            ))}
          </div>
        </div>

        {/* WhatsApp Preview */}
        <div className="lg:col-span-3">
          <div className={`${T.card} rounded-2xl overflow-hidden`}>
            {/* WA Header */}
            <div className="bg-[#075E54] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-sm">
                {messages[selected].name.charAt(0)}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{messages[selected].name}</div>
                <div className="text-green-300 text-xs flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  Online
                </div>
              </div>
              <div className="ml-auto flex gap-3 text-white opacity-70">
                <Phone size={18} /> <MoreVertical size={18} />
              </div>
            </div>

            {/* Chat */}
            <div className="p-4 min-h-[280px]"
              style={{ background: dark ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23111118'/%3E%3Ccircle cx='30' cy='30' r='1' fill='%231a1a26'/%3E%3C/svg%3E\")" : "#e5ddd5" }}>
              {/* Sent Invoice Card */}
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#dcf8c6] rounded-2xl rounded-tr-sm p-3 shadow text-gray-800">
                  <div className="bg-white rounded-xl p-3 mb-2 text-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-red-500" />
                      <span className="font-semibold">{messages[selected].invoiceId}.pdf</span>
                    </div>
                    <div className="text-gray-500 text-[11px]">Invoice for {messages[selected].name}</div>
                    <div className="font-bold text-sm mt-1 text-gray-800">{formatINR(messages[selected].amount)}</div>
                  </div>
                  <p className="text-xs leading-relaxed">{messages[selected].msg}</p>
                  <div className="text-[10px] text-gray-500 text-right mt-1 flex items-center justify-end gap-1">
                    {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    {sentIds.has(messages[selected].id) ? <CheckCircle size={10} className="text-blue-500" /> : <Clock size={10} />}
                  </div>
                </div>
              </div>

              {sentIds.has(messages[selected].id) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mt-3">
                  <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-sm p-3 shadow text-gray-800 text-xs">
                    ✅ Invoice received! Thank you 🙏
                  </div>
                </motion.div>
              )}
            </div>

            {/* Send Button */}
            <div className={`p-4 border-t ${dark ? "border-white/10" : "border-slate-200"}`}>
              {sentIds.has(messages[selected].id) ? (
                <div className="flex items-center justify-center gap-2 py-3 text-emerald-400 font-semibold text-sm">
                  <CheckCircle size={18} /> Invoice Sent Successfully!
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(messages[selected].id)}
                  disabled={sending}
                  className="w-full py-3 rounded-2xl bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2">
                  {sending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? "Sending Invoice..." : `Send to ${messages[selected].mobile}`}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ────────────────────────────────────────────────────────
function AnalyticsPage({ T, dark }) {
  const paymentData = [
    { label: "Paid", value: 68, color: "#10b981" },
    { label: "Pending", value: 22, color: "#f59e0b" },
    { label: "Overdue", value: 10, color: "#ef4444" },
  ];

  const topCustomers = [
    { name: "Alex Coaching Classes", amount: 42500 },
    { name: "Sharma Dairy", amount: 38200 },
    { name: "Kuldeep Fertilizers", amount: 31000 },
    { name: "Gupta Medical", amount: 26700 },
    { name: "Raj Mobile Shop", amount: 22100 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>Analytics</h1>
        <p className={T.muted + " text-sm mt-1"}>Business performance insights</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <div className={`${T.card} rounded-2xl p-4 lg:col-span-2`}>
          <div className="font-semibold mb-1">Revenue Trend</div>
          <div className={`text-xs ${T.muted} mb-4`}>Monthly revenue growth</div>
          <div className="flex items-end gap-2 h-36">
            {MONTHLY_REVENUE.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className={`text-[9px] ${T.muted}`}>{v >= 100000 ? `${(v/1000).toFixed(0)}k` : `${(v/1000).toFixed(0)}k`}</span>
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(v / 127000) * 100}%` }}
                  transition={{ delay: i * 0.04, duration: 0.7, ease: "easeOut" }}
                  className="w-full rounded-t-md"
                  style={{ background: i >= 9 ? "linear-gradient(to top, #7c3aed, #4f46e5)" : dark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)" }}
                />
                <span className={`text-[9px] ${T.muted}`}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div className={`${T.card} rounded-2xl p-4`}>
          <div className="font-semibold mb-1">Payment Status</div>
          <div className={`text-xs ${T.muted} mb-4`}>Invoice breakdown</div>
          <div className="flex flex-col gap-3">
            {paymentData.map((d, i) => (
              <div key={d.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={T.muted}>{d.label}</span>
                  <span className="font-semibold">{d.value}%</span>
                </div>
                <div className={`h-2 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"} overflow-hidden`}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full" style={{ background: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400" style={{ fontFamily: "Sora" }}>₹1.14L</div>
              <div className={`text-xs ${T.muted}`}>Total this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className={`${T.card} rounded-2xl p-4`}>
        <div className="font-semibold mb-4">Top Customers by Revenue</div>
        <div className="space-y-3">
          {topCustomers.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold w-5 ${T.muted}`}>#{i + 1}</span>
                  <span className="text-sm font-medium">{c.name}</span>
                </div>
                <span className="text-sm font-bold">{formatINR(c.amount)}</span>
              </div>
              <div className={`h-1.5 rounded-full ${dark ? "bg-white/10" : "bg-slate-100"} overflow-hidden`}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${(c.amount / 42500) * 100}%` }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(to right, #7c3aed, #4f46e5)` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ─────────────────────────────────────────────────────────
function SettingsPage({ T, dark, showToast }) {
  const [settings, setSettings] = useState({
    businessName: "Kuldeep Enterprises",
    gstin: "09AAAA1234P1Z5",
    mobile: "9876543210",
    whatsappEnabled: true,
    autoReminder: true,
    reminderDays: 3,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora" }}>Settings</h1>
        <p className={T.muted + " text-sm mt-1"}>Manage your business profile and preferences</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {[
          { label: "Business Name", key: "businessName", type: "text" },
          { label: "GSTIN", key: "gstin", type: "text" },
          { label: "WhatsApp Mobile", key: "mobile", type: "tel" },
          { label: "Reminder Days", key: "reminderDays", type: "number" },
        ].map(f => (
          <div key={f.key} className={`${T.card} rounded-2xl p-4`}>
            <label className={`text-xs font-medium ${T.muted} uppercase tracking-wide mb-2 block`}>{f.label}</label>
            <input type={f.type} className={`w-full px-4 py-3 rounded-xl border ${T.input} text-sm outline-none focus:border-violet-500`}
              value={settings[f.key]} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} />
          </div>
        ))}
        {[
          { label: "WhatsApp Auto-Send", key: "whatsappEnabled", desc: "Automatically send invoices via WhatsApp" },
          { label: "Payment Reminders", key: "autoReminder", desc: "Send automatic payment reminders" },
        ].map(f => (
          <div key={f.key} className={`${T.card} rounded-2xl p-4 flex items-center justify-between`}>
            <div>
              <div className="font-medium text-sm">{f.label}</div>
              <div className={`text-xs ${T.muted} mt-0.5`}>{f.desc}</div>
            </div>
            <button onClick={() => setSettings({ ...settings, [f.key]: !settings[f.key] })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings[f.key] ? "bg-violet-600" : dark ? "bg-white/20" : "bg-slate-200"}`}>
              <motion.div animate={{ x: settings[f.key] ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
            </button>
          </div>
        ))}
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={() => showToast("Settings saved successfully!")}
        className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm">
        Save Settings
      </motion.button>
    </div>
  );
}
