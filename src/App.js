import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Home,
  Users,
  Package,
  Plus,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  PackagePlus,
  PackageMinus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  CheckCircle,
  Clock,
  X,
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Moon,
  Sun,
  Download,
  FileSpreadsheet,
  Building2,
  Trash2,
  Lock,
  ShieldAlert,
  Database,
  KeyRound,
  ChevronDown,
  ChevronUp,
  Wallet,
  Image as ImageIcon,
  Camera,
  CreditCard,
  Minus,
  Smartphone,
} from "lucide-react";

// --- FIREBASE IMPORTS ---
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

// --- FIREBASE INITIALIZATION ---
const firebaseConfig = {
  apiKey: "AIzaSyByOLs79qNblHXOMOMC_Apqm4AwHRr3QmE",
  authDomain: "gypsumpro-74a7a.firebaseapp.com",
  projectId: "gypsumpro-74a7a",
  storageBucket: "gypsumpro-74a7a.firebasestorage.app",
  messagingSenderId: "1061227901471",
  appId: "1:1061227901471:web:f3e679b42ea72e87005b2a",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// --- INITIAL DUMMY DATA ---
const COMMON_INVENTORY_ITEMS = [
  "Standard Gypsum Board 12mm",
  "Standard Gypsum Board 9mm",
  "Moisture Resistant Board 12.5mm",
  "Fire Resistant Board 15mm",
  "Acoustic Soundboard 12.5mm",
  "Premium Joint Compound 25kg",
  'Drywall Screws 1.25"',
  'Drywall Screws 2"',
  "Fiberglass Mesh Tape",
  "Metal Corner Bead",
];

const INITIAL_INVENTORY = [
  {
    id: "i1",
    name: "Standard Gypsum Board 12mm",
    defaultPrice: 15.0,
    unit: "board",
    stock: 1200,
  },
  {
    id: "i2",
    name: "Moisture Resistant Board 12.5mm",
    defaultPrice: 18.5,
    unit: "board",
    stock: 850,
  },
  {
    id: "i3",
    name: "Fire Resistant Board 15mm",
    defaultPrice: 22.0,
    unit: "board",
    stock: 400,
  },
  {
    id: "i4",
    name: "Acoustic Soundboard 12.5mm",
    defaultPrice: 26.0,
    unit: "board",
    stock: 300,
  },
  {
    id: "i5",
    name: "Premium Joint Compound 25kg",
    defaultPrice: 12.0,
    unit: "bucket",
    stock: 150,
  },
  {
    id: "i6",
    name: 'Drywall Screws 1.25"',
    defaultPrice: 5.5,
    unit: "box",
    stock: 500,
  },
];

const INITIAL_CUSTOMERS = [
  {
    id: "c1",
    name: "John Doe Construction",
    phone: "555-0101",
    secondaryPhone: "555-0102",
    email: "john@doe.com",
    address: "123 Main St",
    createdAt: "2024-01-10",
  },
  {
    id: "c2",
    name: "Smith & Sons Builders",
    phone: "555-0202",
    secondaryPhone: "",
    email: "contact@smithsons.com",
    address: "45 Industrial Pkwy",
    createdAt: "2024-02-15",
  },
  {
    id: "c3",
    name: "Apex Interiors LLC",
    phone: "555-0303",
    secondaryPhone: "555-0304",
    email: "billing@apexinteriors.com",
    address: "789 Corporate Blvd",
    createdAt: "2024-03-05",
  },
  {
    id: "c4",
    name: "Horizon Developers",
    phone: "555-0404",
    secondaryPhone: "",
    email: "",
    address: "",
    createdAt: "2024-04-12",
  },
];

const INITIAL_PROJECTS = [
  {
    id: "p1",
    customerId: "c1",
    name: "Villa 4B, Pine Street",
    status: "Active",
    createdAt: "2024-03-01",
    taxRate: 5,
  },
  {
    id: "p2",
    customerId: "c2",
    name: "Downtown Office Reno",
    status: "Settled",
    createdAt: "2024-02-20",
    taxRate: 0,
  },
  {
    id: "p3",
    customerId: "c3",
    name: "Skyline Mall Penthouse",
    status: "Active",
    createdAt: "2024-03-10",
    taxRate: 15,
  },
  {
    id: "p4",
    customerId: "c3",
    name: "Riverside Apartments",
    status: "Active",
    createdAt: "2024-04-01",
    taxRate: 15,
  },
];

const INITIAL_TRANSACTIONS = [
  {
    id: "t1",
    projectId: "p1",
    customerId: "c1",
    type: "TAKEN",
    itemId: "i1",
    itemName: "Standard Gypsum Board 12mm",
    quantity: 100,
    unitPrice: 15.0,
    amount: 1500.0,
    date: "2024-03-02",
    unit: "board",
  },
  {
    id: "t2",
    projectId: "p1",
    customerId: "c1",
    type: "TAKEN",
    itemId: "i2",
    itemName: "Moisture Resistant Board 12.5mm",
    quantity: 50,
    unitPrice: 18.5,
    amount: 925.0,
    date: "2024-03-03",
    unit: "board",
  },
  {
    id: "t3",
    projectId: "p1",
    customerId: "c1",
    type: "RETURNED",
    itemId: "i1",
    itemName: "Standard Gypsum Board 12mm",
    quantity: 10,
    unitPrice: 15.0,
    amount: 150.0,
    date: "2024-03-15",
    unit: "board",
  },
  {
    id: "t4",
    projectId: "p1",
    customerId: "c1",
    type: "PAYMENT",
    amount: 1000.0,
    date: "2024-03-20",
  },
  {
    id: "t5",
    projectId: "p2",
    customerId: "c2",
    type: "TAKEN",
    itemId: "i3",
    itemName: "Fire Resistant Board 15mm",
    quantity: 200,
    unitPrice: 22.0,
    amount: 4400.0,
    date: "2024-02-21",
    unit: "board",
  },
  {
    id: "t6",
    projectId: "p2",
    customerId: "c2",
    type: "PAYMENT",
    amount: 4400.0,
    date: "2024-03-10",
  },
  {
    id: "t7",
    projectId: "p3",
    customerId: "c3",
    type: "TAKEN",
    itemId: "i4",
    itemName: "Acoustic Soundboard 12.5mm",
    quantity: 120,
    unitPrice: 26.0,
    amount: 3120.0,
    date: "2024-03-12",
    unit: "board",
  },
  {
    id: "t8",
    projectId: "p3",
    customerId: "c3",
    type: "TAKEN",
    itemId: "i5",
    itemName: "Premium Joint Compound 25kg",
    quantity: 10,
    unitPrice: 12.0,
    amount: 120.0,
    date: "2024-03-12",
    unit: "bucket",
  },
  {
    id: "t9",
    projectId: "p3",
    customerId: "c3",
    type: "TAKEN",
    itemId: "i6",
    itemName: 'Drywall Screws 1.25"',
    quantity: 5,
    unitPrice: 5.5,
    amount: 27.5,
    date: "2024-03-12",
    unit: "box",
  },
  {
    id: "t10",
    projectId: "p3",
    customerId: "c3",
    type: "PAYMENT",
    amount: 1500.0,
    date: "2024-03-25",
  },
  {
    id: "t11",
    projectId: "p4",
    customerId: "c3",
    type: "TAKEN",
    itemId: "i1",
    itemName: "Standard Gypsum Board 12mm",
    quantity: 300,
    unitPrice: 15.0,
    amount: 4500.0,
    date: "2024-04-02",
    unit: "board",
  },
  {
    id: "t12",
    projectId: null,
    customerId: "c1",
    type: "ADVANCE_PAYMENT",
    amount: 500.0,
    date: "2024-04-10",
  },
];

// --- MODERN UI COMPONENTS ---
const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/60 dark:border-slate-700/50 transition-all duration-300 
    ${
      onClick
        ? "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(99,102,241,0.15)] dark:hover:shadow-[0_12px_40px_rgb(99,102,241,0.1)] hover:border-indigo-300/50 dark:hover:border-indigo-500/40 group"
        : ""
    } ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}) => {
  const baseStyle =
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0B1120] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md";
  const variants = {
    primary:
      "bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:from-indigo-600 hover:to-violet-700 focus:ring-indigo-500 border border-indigo-400/20",
    secondary:
      "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-slate-500",
    danger:
      "bg-gradient-to-br from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 focus:ring-rose-500 border border-rose-400/20",
    success:
      "bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 focus:ring-emerald-500 border border-emerald-400/20",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, zIndex = "z-50" }) => {
  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300`}
    >
      <div className="bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-white/50 dark:border-slate-700/50 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 shrink-0">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-all hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- PDF SCRIPT LOADER ---
const loadPdfLibs = () =>
  Promise.all([
    new Promise((resolve) => {
      if (window.jspdf) return resolve();
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      document.head.appendChild(script);
    }).then(
      () =>
        new Promise((resolve) => {
          if (window.jspdf && window.jspdf.autotable) return resolve();
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        })
    ),
  ]);

// --- UTILITIES ---
const formatDate = (isoString) => {
  if (!isoString) return "";
  const parts = isoString.split("-");
  if (parts.length !== 3) return isoString;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const compressImage = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

// --- MAIN APPLICATION ---
export default function App() {
  const [user, setUser] = useState(null);

  // App Settings State
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("﷼");
  const [companyName, setCompanyName] = useState("GypMaster Supplies");
  const [appPin, setAppPin] = useState("");
  const [globalTaxRate, setGlobalTaxRate] = useState(0);

  // Data State
  const [currentView, setCurrentView] = useState("dashboard");
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Global Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isGlobalSearchFocused, setIsGlobalSearchFocused] = useState(false);

  const [overviewTab, setOverviewTab] = useState("customer");

  // Modals State
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isItemModalOpen, setItemModalOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);

  const [isProjectVatModalOpen, setProjectVatModalOpen] = useState(false);
  const [projectVatInput, setProjectVatInput] = useState("");

  const [transactionType, setTransactionType] = useState("TAKEN");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSeedingDemo, setIsSeedingDemo] = useState(false);

  // Security & Settings State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [isPinSettingsOpen, setIsPinSettingsOpen] = useState(false);
  const [isVatSettingsOpen, setIsVatSettingsOpen] = useState(false);
  const [vatInput, setVatInput] = useState(0);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const [pinForm, setPinForm] = useState({ current: "", new: "", confirm: "" });
  const [pinMsg, setPinMsg] = useState({ type: "", text: "" });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form States
  const [customerForm, setCustomerForm] = useState({
    name: "",
    phone: "",
    secondaryPhone: "",
    email: "",
    address: "",
    profilePhoto: "",
    idPhoto: "",
  });
  const [projectForm, setProjectForm] = useState({ name: "" });
  const [itemForm, setItemForm] = useState({
    name: "",
    defaultPrice: "",
    unit: "board",
    stock: "",
  });
  const [txFormDate, setTxFormDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [txFormPaymentAmount, setTxFormPaymentAmount] = useState("");

  // Advance Deduction State
  const [advanceDeductionMode, setAdvanceDeductionMode] = useState("none"); // 'none', 'partial', 'whole'
  const [advancePartialAmount, setAdvancePartialAmount] = useState("");

  const [txFormMaterials, setTxFormMaterials] = useState([
    { id: Date.now(), itemId: "", quantity: "", unitPrice: "" },
  ]);

  // Advance Manage State
  const [advanceActionType, setAdvanceActionType] = useState("ADD"); // 'ADD' or 'DEDUCT'
  const [advanceFormAmount, setAdvanceFormAmount] = useState("");

  // Settings Form State
  const [configForm, setConfigForm] = useState({
    currency: "﷼",
    companyName: "GypMaster Supplies",
  });

  const [customerSortOption, setCustomerSortOption] = useState("name");
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const profilePhotoRef = useRef(null);
  const idPhotoRef = useRef(null);

  // --- PREVENT NUMBER SCROLLING GLOBALLY ---
  useEffect(() => {
    const handleWheel = (e) => {
      if (document.activeElement && document.activeElement.type === "number") {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  // --- PWA (PROGRESSIVE WEB APP) SETUP ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if already installed
    if (
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsAppInstalled(true);
    }

    // Inject Dynamic Manifest for PWA Support
    const manifest = {
      name: "GypMaster Business Portal",
      short_name: "GypMaster",
      description: "Professional Gypsum Tracking & Invoicing",
      start_url: window.location.href.split("?")[0],
      display: "standalone",
      background_color: "#0B1120",
      theme_color: "#4f46e5",
      icons: [
        {
          src: "https://cdn.jsdelivr.net/gh/lucide-icons/lucide@main/icons/building-2.svg",
          sizes: "192x192",
          type: "image/svg+xml",
        },
        {
          src: "https://cdn.jsdelivr.net/gh/lucide-icons/lucide@main/icons/building-2.svg",
          sizes: "512x512",
          type: "image/svg+xml",
        },
      ],
    };

    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], {
      type: "application/manifest+json",
    });
    const manifestURL = URL.createObjectURL(blob);

    let link = document.querySelector('link[rel="manifest"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "manifest";
      document.head.appendChild(link);
    }
    link.href = manifestURL;

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsAppInstalled(true);
    }
  };

  // --- FIREBASE CLOUD SYNC ---
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const basePath = `artifacts/${appId}/public/data`;

    const unsubInv = onSnapshot(
      collection(db, basePath, "inventory"),
      (snap) => setInventory(snap.docs.map((d) => d.data())),
      console.error
    );
    const unsubCust = onSnapshot(
      collection(db, basePath, "customers"),
      (snap) => setCustomers(snap.docs.map((d) => d.data())),
      console.error
    );
    const unsubProj = onSnapshot(
      collection(db, basePath, "projects"),
      (snap) => setProjects(snap.docs.map((d) => d.data())),
      console.error
    );
    const unsubTx = onSnapshot(
      collection(db, basePath, "transactions"),
      (snap) => setTransactions(snap.docs.map((d) => d.data())),
      console.error
    );
    const unsubSet = onSnapshot(
      doc(db, basePath, "settings", "preferences"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.theme) setTheme(data.theme);
          if (data.currency) setCurrency(data.currency);
          if (data.companyName) setCompanyName(data.companyName);
          if (data.appPin !== undefined) setAppPin(data.appPin);

          if (data.globalTaxRate !== undefined) {
            setGlobalTaxRate(data.globalTaxRate);
            setVatInput(data.globalTaxRate);
          }

          setConfigForm({
            currency: data.currency || "﷼",
            companyName: data.companyName || "GypMaster Supplies",
          });
        }
      },
      console.error
    );

    return () => {
      unsubInv();
      unsubCust();
      unsubProj();
      unsubTx();
      unsubSet();
    };
  }, [user]);

  const saveDocData = async (colName, id, data) => {
    if (!user) return;
    await setDoc(
      doc(db, `artifacts/${appId}/public/data/${colName}`, id),
      data
    );
  };

  const delDocData = async (colName, id) => {
    if (!user) return;
    await deleteDoc(doc(db, `artifacts/${appId}/public/data/${colName}`, id));
  };

  const handleSettingChange = (key, value) => {
    if (key === "theme") setTheme(value);
    if (key === "currency") setCurrency(value);
    if (key === "companyName") setCompanyName(value);
    if (key === "appPin") setAppPin(value);
    if (key === "globalTaxRate") setGlobalTaxRate(parseFloat(value) || 0);

    if (user) {
      setDoc(
        doc(db, `artifacts/${appId}/public/data/settings`, "preferences"),
        {
          [key]: key === "globalTaxRate" ? parseFloat(value) || 0 : value,
        },
        { merge: true }
      ).catch(console.error);
    }
  };

  const loadDemoData = async () => {
    if (!user) return;
    setIsSeedingDemo(true);
    try {
      const promises = [
        ...INITIAL_INVENTORY.map((i) => saveDocData("inventory", i.id, i)),
        ...INITIAL_CUSTOMERS.map((c) => saveDocData("customers", c.id, c)),
        ...INITIAL_PROJECTS.map((p) => saveDocData("projects", p.id, p)),
        ...INITIAL_TRANSACTIONS.map((t) =>
          saveDocData("transactions", t.id, t)
        ),
      ];
      await Promise.all(promises);
      setCurrentView("dashboard");
    } catch (err) {
      console.error("Error loading demo data:", err);
      alert("Failed to load demo data.");
    } finally {
      setIsSeedingDemo(false);
    }
  };

  // --- SECURITY LOGIC ---
  const handleSecureAction = (actionCallback) => {
    if (!appPin || appPin.trim().length === 0) {
      setIsLockedModalOpen(true);
      return;
    }
    setPendingAction(() => actionCallback);
    setPinInput("");
    setPinError("");
    setIsPinModalOpen(true);
  };

  const submitPin = (e) => {
    e.preventDefault();
    if (pinInput === appPin) {
      setIsPinModalOpen(false);
      if (pendingAction) pendingAction();
      setPendingAction(null);
    } else {
      setPinError("Incorrect PIN. Access Denied.");
    }
  };

  const handleSetPin = (e) => {
    e.preventDefault();
    setPinMsg({ type: "", text: "" });

    if (appPin) {
      if (pinForm.current !== appPin)
        return setPinMsg({ type: "error", text: "Current PIN is incorrect." });
    }
    if (pinForm.new !== pinForm.confirm)
      return setPinMsg({ type: "error", text: "New PINs do not match." });
    if (pinForm.new.length < 4)
      return setPinMsg({
        type: "error",
        text: "PIN must be at least 4 characters long.",
      });

    handleSettingChange("appPin", pinForm.new);
    setPinForm({ current: "", new: "", confirm: "" });
    setPinMsg({ type: "success", text: "Security PIN successfully updated." });
    setTimeout(() => setPinMsg({ type: "", text: "" }), 4000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    handleSecureAction(() => {
      handleSettingChange("currency", configForm.currency);
      handleSettingChange("companyName", configForm.companyName);
    });
  };

  const handleSaveVat = (e) => {
    e.preventDefault();
    handleSecureAction(() => {
      handleSettingChange("globalTaxRate", vatInput);
      setIsVatSettingsOpen(false);
    });
  };

  const confirmDelete = async () => {
    setIsDeleteModalOpen(false);
    handleSecureAction(async () => {
      if (deleteTarget.type === "customer") {
        await delDocData("customers", deleteTarget.id);
        projects
          .filter((p) => p.customerId === deleteTarget.id)
          .forEach((p) => delDocData("projects", p.id));
        transactions
          .filter((t) => t.customerId === deleteTarget.id)
          .forEach((t) => delDocData("transactions", t.id));
        setCurrentView("customers");
      } else if (deleteTarget.type === "project") {
        await delDocData("projects", deleteTarget.id);
        transactions
          .filter((t) => t.projectId === deleteTarget.id)
          .forEach((t) => delDocData("transactions", t.id));
        setCurrentView("profile");
      } else if (deleteTarget.type === "inventory item") {
        await delDocData("inventory", deleteTarget.id);
        setCurrentView("inventory");
      }
    });
  };

  // --- CORE LOGIC & MATH ---
  const formatCurrency = (val) =>
    `${currency}${(Number(val) || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // --- PERFORMANCE OPTIMIZATION: MEMOIZED MAPS ---
  // Pre-calculate project stats to prevent heavy loops during renders and sorting
  const projectStatsMap = useMemo(() => {
    const map = {};
    projects.forEach((proj) => {
      const projTxs = transactions.filter((t) => t.projectId === proj.id);
      const taken = projTxs
        .filter((t) => t.type === "TAKEN")
        .reduce((sum, t) => sum + t.amount, 0);
      const returned = projTxs
        .filter((t) => t.type === "RETURNED")
        .reduce((sum, t) => sum + t.amount, 0);
      const paid = projTxs
        .filter((t) => t.type === "PAYMENT")
        .reduce((sum, t) => sum + t.amount, 0);

      const netBill = taken - returned;
      const pTaxRate = proj.taxRate !== undefined ? proj.taxRate : 0;
      const taxAmount = netBill > 0 ? netBill * (pTaxRate / 100) : 0;

      const finalBill = netBill + taxAmount;
      const rawDue = finalBill - paid;

      const due = Math.max(0, rawDue);
      const surplus = Math.max(0, -rawDue);

      map[proj.id] = {
        taken,
        returned,
        paid,
        netBill,
        taxAmount,
        finalBill,
        due,
        surplus,
        pTaxRate,
        rawDue,
      };
    });
    return map;
  }, [projects, transactions]);

  // Pre-calculate customer stats using the pre-calculated project stats
  const customerStatsMap = useMemo(() => {
    const map = {};
    customers.forEach((cust) => {
      const custProjects = projects.filter((p) => p.customerId === cust.id);
      let totalProjectDue = 0;
      let totalPaid = 0;
      let totalSurplus = 0;

      custProjects.forEach((p) => {
        const stats = projectStatsMap[p.id] || { due: 0, surplus: 0, paid: 0 };
        totalProjectDue += stats.due;
        totalSurplus += stats.surplus;
        totalPaid += stats.paid;
      });

      const advPayments = transactions
        .filter((t) => t.customerId === cust.id && t.type === "ADVANCE_PAYMENT")
        .reduce((sum, t) => sum + t.amount, 0);
      const advDeductions = transactions
        .filter(
          (t) => t.customerId === cust.id && t.type === "ADVANCE_DEDUCTION"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const rawAdv = advPayments - advDeductions;
      const netAdvance = rawAdv + totalSurplus;

      let totalDue = totalProjectDue;
      let advanceAvailable = netAdvance;

      if (netAdvance < 0) {
        totalDue += Math.abs(netAdvance);
        advanceAvailable = 0;
      }

      map[cust.id] = {
        totalDue,
        projectCount: custProjects.length,
        totalPaid,
        advanceAvailable,
      };
    });
    return map;
  }, [customers, projects, transactions, projectStatsMap]);

  // Fast O(1) lookups instead of calculating on the fly
  const getProjectStats = (projectId) => {
    return (
      projectStatsMap[projectId] || {
        taken: 0,
        returned: 0,
        paid: 0,
        netBill: 0,
        taxAmount: 0,
        finalBill: 0,
        due: 0,
        surplus: 0,
        pTaxRate: 0,
        rawDue: 0,
      }
    );
  };

  const getCustomerStats = (customerId) => {
    return (
      customerStatsMap[customerId] || {
        totalDue: 0,
        projectCount: 0,
        totalPaid: 0,
        advanceAvailable: 0,
      }
    );
  };

  const dashboardStats = useMemo(() => {
    let totalDebt = 0;
    let totalRevenue = 0;
    let activeProjectsCount = 0;

    customers.forEach((c) => {
      totalDebt += getCustomerStats(c.id).totalDue;
    });

    projects.forEach((p) => {
      if (p.status === "Active") activeProjectsCount++;
    });

    transactions
      .filter((t) => t.type === "PAYMENT" || t.type === "ADVANCE_PAYMENT")
      .forEach((t) => {
        totalRevenue += t.amount;
      });
    return { totalDebt, totalRevenue, activeProjectsCount };
  }, [projects, transactions, customers, customerStatsMap]);

  const takenItemIdsForSelectedProject = useMemo(() => {
    if (!selectedProjectId) return [];
    return transactions
      .filter((t) => t.projectId === selectedProjectId && t.type === "TAKEN")
      .map((t) => t.itemId);
  }, [transactions, selectedProjectId]);

  // Global Search Logic
  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim())
      return { customers: [], projects: [], inventory: [] };
    const q = globalSearchQuery.toLowerCase();
    return {
      customers: customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
      ),
      projects: projects.filter((p) => p.name.toLowerCase().includes(q)),
      inventory: inventory.filter((i) => i.name.toLowerCase().includes(q)),
    };
  }, [globalSearchQuery, customers, projects, inventory]);

  const handleGlobalSearchResultClick = (type, item) => {
    setGlobalSearchQuery("");
    setIsGlobalSearchFocused(false);
    if (type === "customer") {
      setSelectedCustomerId(item.id);
      setCurrentView("profile");
    } else if (type === "project") {
      setSelectedCustomerId(item.customerId);
      setSelectedProjectId(item.id);
      setCurrentView("project");
    } else if (type === "inventory") {
      setCurrentView("inventory");
    }
  };

  // --- EXPORT LOGIC ---
  const downloadCSV = (content, fileName) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCustomers = () => {
    handleSecureAction(() => {
      let csv =
        "ID,Name,Primary Phone,Secondary Phone,Email,Address,Total Projects,Total Paid,Current Due,Advance Balance\n";
      customers.forEach((c) => {
        const stats = getCustomerStats(c.id);
        csv += `"${c.id}","${c.name}","${c.phone}","${c.secondaryPhone}","${c.email}","${c.address}","${stats.projectCount}","${stats.totalPaid}","${stats.totalDue}","${stats.advanceAvailable}"\n`;
      });
      downloadCSV(csv, "Customers_Export.csv");
    });
  };

  const exportProjects = () => {
    handleSecureAction(() => {
      let csv =
        "ID,Customer Name,Project Name,Status,Started Date,VAT Rate %,Total Taken,Total Returned,Net Bill,VAT Amount,Total Billed,Total Paid,Current Due\n";
      projects.forEach((p) => {
        const c = customers.find((cust) => cust.id === p.customerId);
        const stats = getProjectStats(p.id);
        csv += `"${p.id}","${c ? c.name : "Unknown"}","${p.name}","${
          p.status
        }","${formatDate(p.createdAt)}","${stats.pTaxRate}%","${
          stats.taken
        }","${stats.returned}","${stats.netBill}","${stats.taxAmount}","${
          stats.finalBill
        }","${stats.paid}","${stats.due}"\n`;
      });
      downloadCSV(csv, "Projects_Export.csv");
    });
  };

  const generatePDFInvoice = async () => {
    setIsGeneratingPdf(true);
    try {
      await loadPdfLibs();
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("p", "mm", "a4");

      const project = projects.find((p) => p.id === selectedProjectId);
      const customer = customers.find((c) => c.id === project.customerId);
      const stats = getProjectStats(project.id);
      const projTxs = transactions
        .filter((t) => t.projectId === project.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const safeCurrency = (val) =>
        formatCurrency(val).replace("﷼", "SAR ").replace("৳", "BDT ");

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      doc.setFontSize(24);
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.text((companyName || "GypMaster Supplies").toUpperCase(), margin, 30);

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Professional Construction Materials\ncontact@yourcompany.com\n+1 (555) 019-8472",
        margin,
        36
      );

      doc.setFontSize(32);
      doc.setTextColor(79, 70, 229);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - margin, 36, { align: "right" });

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const invoiceNo = `INV-${Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0")}`;
      doc.text(`Invoice Number:`, pageWidth - margin - 40, 45, {
        align: "right",
      });
      doc.setFont("helvetica", "bold");
      doc.text(invoiceNo, pageWidth - margin, 45, { align: "right" });

      doc.setFont("helvetica", "normal");
      doc.text(`Date of Issue:`, pageWidth - margin - 40, 50, {
        align: "right",
      });
      doc.setFont("helvetica", "bold");
      doc.text(
        formatDate(new Date().toISOString().split("T")[0]),
        pageWidth - margin,
        50,
        { align: "right" }
      );

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, 58, pageWidth - margin, 58);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.text("BILLED TO", margin, 68);

      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text(customer?.name || "Unknown Client", margin, 74);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      let yOffset = 79;
      if (customer?.phone) {
        doc.text(`Phone: ${customer.phone}`, margin, yOffset);
        yOffset += 5;
      }
      if (customer?.email) {
        doc.text(`Email: ${customer.email}`, margin, yOffset);
        yOffset += 5;
      }
      if (customer?.address) {
        const splitAddress = doc.splitTextToSize(customer.address, 60);
        doc.text(splitAddress, margin, yOffset);
      }

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.text("PROJECT DETAILS", pageWidth / 2, 68);

      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text(project.name, pageWidth / 2, 74);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`Status: ${project.status}`, pageWidth / 2, 79);
      doc.text(`Started: ${formatDate(project.createdAt)}`, pageWidth / 2, 84);

      const tableData = projTxs.map((t) => [
        formatDate(t.date),
        t.type === "PAYMENT" ? "Payment Received" : t.itemName,
        t.type,
        t.quantity ? `${t.quantity} ${t.unit}` : "-",
        t.unitPrice ? safeCurrency(t.unitPrice) : "-",
        t.type === "RETURNED" || t.type === "PAYMENT"
          ? `- ${safeCurrency(t.amount)}`
          : safeCurrency(t.amount),
      ]);

      doc.autoTable({
        startY: Math.max(105, yOffset + 10),
        head: [["Date", "Description", "Type", "Qty", "Unit Price", "Total"]],
        body: tableData,
        theme: "plain",
        headStyles: {
          fillColor: [248, 250, 252],
          textColor: [71, 85, 105],
          fontStyle: "bold",
          lineWidth: { bottom: 0.5 },
          lineColor: [226, 232, 240],
        },
        bodyStyles: {
          textColor: [30, 41, 59],
          lineWidth: { bottom: 0.5 },
          lineColor: [241, 245, 249],
        },
        styles: { fontSize: 9, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: "wrap" },
          1: { cellWidth: "auto" },
          2: { cellWidth: "wrap" },
          3: { cellWidth: "wrap", halign: "right" },
          4: { cellWidth: "wrap", halign: "right" },
          5: { cellWidth: "wrap", halign: "right", fontStyle: "bold" },
        },
        margin: { left: margin, right: margin },
      });

      let finalY = doc.lastAutoTable.finalY + 15;
      if (finalY > pageHeight - 80) {
        doc.addPage();
        finalY = margin;
      }

      const summaryW = 85;
      const summaryX = pageWidth - margin - summaryW;

      const addSummaryLine = (
        label,
        value,
        y,
        isBold = false,
        isHighlight = false,
        color = [71, 85, 105]
      ) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(label, summaryX, y);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(value, pageWidth - margin, y, { align: "right" });
      };

      addSummaryLine(
        "Total Materials Taken:",
        safeCurrency(stats.taken),
        finalY
      );
      addSummaryLine(
        "Total Materials Returned:",
        `- ${safeCurrency(stats.returned)}`,
        finalY + 7,
        false,
        false,
        [37, 99, 235]
      );

      doc.setDrawColor(226, 232, 240);
      doc.line(summaryX, finalY + 11, pageWidth - margin, finalY + 11);

      addSummaryLine(
        "Net Materials Bill:",
        safeCurrency(stats.netBill),
        finalY + 17,
        true,
        false,
        [30, 41, 59]
      );
      addSummaryLine(
        `VAT (${stats.pTaxRate}%):`,
        safeCurrency(stats.taxAmount),
        finalY + 24
      );

      doc.line(summaryX, finalY + 28, pageWidth - margin, finalY + 28);

      addSummaryLine(
        "Total Billed Amount:",
        safeCurrency(stats.finalBill),
        finalY + 34,
        true,
        false,
        [30, 41, 59]
      );
      addSummaryLine(
        "Total Payments Received:",
        `- ${safeCurrency(stats.paid)}`,
        finalY + 41,
        false,
        false,
        [5, 150, 105]
      );

      if (stats.surplus > 0) {
        addSummaryLine(
          "Project Surplus (Moved to Advance):",
          safeCurrency(stats.surplus),
          finalY + 48,
          false,
          false,
          [245, 158, 11]
        );
      }

      const balanceY = finalY + 54;
      doc.setFillColor(79, 70, 229);
      doc.roundedRect(summaryX - 5, balanceY, summaryW + 5, 20, 2, 2, "F");

      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("BALANCE DUE", summaryX, balanceY + 13);

      doc.setFontSize(13);
      doc.text(safeCurrency(stats.due), pageWidth - margin - 3, balanceY + 13, {
        align: "right",
      });

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "bold");
      doc.text("TERMS & CONDITIONS", margin, finalY);
      doc.setFont("helvetica", "normal");
      doc.text(
        "1. Payment is due upon receipt unless otherwise specified.\n2. Please make all payments to the company name above.\n3. Returns must be made within 30 days in good condition.",
        margin,
        finalY + 6
      );

      const footerY = pageHeight - margin;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "Thank you for your business. Statement securely generated by GypMaster.",
        pageWidth / 2,
        footerY,
        { align: "center" }
      );

      doc.save(`Invoice_${project.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleFormImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64Img = await compressImage(file);
      setCustomerForm({ ...customerForm, [type]: base64Img });
    } catch (err) {
      console.error("Error compressing image:", err);
    }
  };

  // --- HANDLERS WITH CLOUD SYNC ---
  const openAddCustomerModal = () => {
    setEditingCustomerId(null);
    setCustomerForm({
      name: "",
      phone: "",
      secondaryPhone: "",
      email: "",
      address: "",
      profilePhoto: "",
      idPhoto: "",
    });
    setCustomerModalOpen(true);
  };

  const openEditCustomerModal = (customer) => {
    setEditingCustomerId(customer.id);
    setCustomerForm({
      name: customer.name || "",
      phone: customer.phone || "",
      secondaryPhone: customer.secondaryPhone || "",
      email: customer.email || "",
      address: customer.address || "",
      profilePhoto: customer.profilePhoto || "",
      idPhoto: customer.idPhoto || "",
    });
    setCustomerModalOpen(true);
  };

  const handleSaveCustomerForm = (e) => {
    e.preventDefault();
    handleSecureAction(async () => {
      if (editingCustomerId) {
        const updatedCustomer = {
          ...customers.find((c) => c.id === editingCustomerId),
          ...customerForm,
        };
        await saveDocData("customers", editingCustomerId, updatedCustomer);
      } else {
        const id = `c${Date.now()}`;
        const newCustomer = {
          id,
          ...customerForm,
          createdAt: new Date().toISOString().split("T")[0],
        };
        await saveDocData("customers", id, newCustomer);
      }
      setCustomerForm({
        name: "",
        phone: "",
        secondaryPhone: "",
        email: "",
        address: "",
        profilePhoto: "",
        idPhoto: "",
      });
      setEditingCustomerId(null);
      setCustomerModalOpen(false);
    });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    handleSecureAction(async () => {
      const id = `p${Date.now()}`;
      const newProject = {
        id,
        customerId: selectedCustomerId,
        name: projectForm.name,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        taxRate: globalTaxRate,
      };
      await saveDocData("projects", id, newProject);
      setProjectForm({ name: "" });
      setProjectModalOpen(false);
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    handleSecureAction(async () => {
      const existingItem = inventory.find(
        (i) => i.name.toLowerCase() === itemForm.name.toLowerCase()
      );

      if (existingItem) {
        const newStock = existingItem.stock + parseFloat(itemForm.stock || 0);
        await saveDocData("inventory", existingItem.id, {
          ...existingItem,
          stock: newStock,
          defaultPrice: parseFloat(itemForm.defaultPrice),
          unit: itemForm.unit,
        });
      } else {
        const id = `i${Date.now()}`;
        const newItem = {
          id,
          name: itemForm.name,
          defaultPrice: parseFloat(itemForm.defaultPrice),
          unit: itemForm.unit,
          stock: parseFloat(itemForm.stock || 0),
        };
        await saveDocData("inventory", id, newItem);
      }
      setItemForm({ name: "", defaultPrice: "", unit: "board", stock: "" });
      setItemModalOpen(false);
    });
  };

  const handleAddAdvancePayment = (e) => {
    e.preventDefault();
    handleSecureAction(async () => {
      if (!advanceFormAmount || parseFloat(advanceFormAmount) <= 0) return;
      const amount = parseFloat(advanceFormAmount);
      const currentAvail =
        getCustomerStats(selectedCustomerId).advanceAvailable;

      if (advanceActionType === "DEDUCT" && amount > currentAvail) {
        alert("Cannot deduct more than currently available advance.");
        return;
      }

      const id = `t${Date.now()}`;
      const tx = {
        id,
        projectId: null,
        customerId: selectedCustomerId,
        type:
          advanceActionType === "ADD" ? "ADVANCE_PAYMENT" : "ADVANCE_DEDUCTION",
        amount: amount,
        date: new Date().toISOString().split("T")[0],
      };
      await saveDocData("transactions", id, tx);
      setAdvanceFormAmount("");
      setIsAdvanceModalOpen(false);
    });
  };

  const addMaterialRow = () =>
    setTxFormMaterials([
      ...txFormMaterials,
      { id: Date.now(), itemId: "", quantity: "", unitPrice: "" },
    ]);
  const removeMaterialRow = (id) =>
    setTxFormMaterials(txFormMaterials.filter((m) => m.id !== id));
  const updateMaterialRow = (id, field, value) => {
    if (field === "itemId" && value === "NEW_ITEM") {
      setItemModalOpen(true);
      value = "";
    }

    setTxFormMaterials(
      txFormMaterials.map((m) => {
        if (m.id === id) {
          let updates = { [field]: value };
          if (field === "itemId" && value !== "") {
            const item = inventory.find((i) => i.id === value);
            updates.unitPrice = item ? item.defaultPrice : "";
          }
          return { ...m, ...updates };
        }
        return m;
      })
    );
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    handleSecureAction(async () => {
      let newTxs = [];
      const now = Date.now();

      if (transactionType === "PAYMENT") {
        const cashValue = parseFloat(txFormPaymentAmount) || 0;
        let deductionValue = 0;
        const availableAdvance =
          getCustomerStats(selectedCustomerId).advanceAvailable;
        const pStats = getProjectStats(selectedProjectId);

        if (advanceDeductionMode === "whole") {
          deductionValue = Math.min(pStats.due, availableAdvance);
        } else if (advanceDeductionMode === "partial") {
          deductionValue = Math.min(
            parseFloat(advancePartialAmount) || 0,
            availableAdvance
          );
        }

        const totalCreditToProject = cashValue + deductionValue;
        if (totalCreditToProject <= 0) return;

        if (cashValue > 0) {
          newTxs.push({
            id: `t${now}_cash`,
            projectId: selectedProjectId,
            customerId: selectedCustomerId,
            type: "PAYMENT",
            itemId: null,
            itemName: "",
            quantity: null,
            unitPrice: null,
            amount: cashValue,
            date: txFormDate,
            unit: "",
          });
        }

        if (deductionValue > 0) {
          newTxs.push({
            id: `t${now}_adv_pay`,
            projectId: selectedProjectId,
            customerId: selectedCustomerId,
            type: "PAYMENT",
            itemId: null,
            itemName: "From Advance",
            quantity: null,
            unitPrice: null,
            amount: deductionValue,
            date: txFormDate,
            unit: "",
          });
          newTxs.push({
            id: `t${now}_adv_deduct`,
            projectId: null,
            customerId: selectedCustomerId,
            type: "ADVANCE_DEDUCTION",
            amount: deductionValue,
            date: txFormDate,
            note: `Applied to project: ${
              projects.find((p) => p.id === selectedProjectId)?.name
            }`,
          });
        }
      } else {
        const validMaterials = txFormMaterials.filter(
          (m) => m.itemId && m.quantity && m.unitPrice
        );
        if (validMaterials.length === 0) return;

        validMaterials.forEach((m, idx) => {
          const item = inventory.find((i) => i.id === m.itemId);
          newTxs.push({
            id: `t${now}_${idx}`,
            projectId: selectedProjectId,
            customerId: selectedCustomerId,
            type: transactionType,
            itemId: m.itemId,
            itemName: item ? item.name : "Unknown Item",
            quantity: parseFloat(m.quantity),
            unitPrice: parseFloat(m.unitPrice),
            amount: parseFloat(m.quantity) * parseFloat(m.unitPrice),
            date: txFormDate,
            unit: item ? item.unit : "",
          });
        });
      }

      for (const tx of newTxs) {
        await saveDocData("transactions", tx.id, tx);
      }

      if (transactionType === "TAKEN" || transactionType === "RETURNED") {
        for (const tx of newTxs) {
          const item = inventory.find((i) => i.id === tx.itemId);
          if (item) {
            const newStock =
              transactionType === "TAKEN"
                ? item.stock - tx.quantity
                : item.stock + tx.quantity;
            await saveDocData("inventory", item.id, {
              ...item,
              stock: newStock,
            });
          }
        }
      }

      const proj = projects.find((p) => p.id === selectedProjectId);
      if (proj) {
        const currentStats = getProjectStats(selectedProjectId);
        let netChange = 0;
        newTxs.forEach((tx) => {
          if (tx.type === "TAKEN") {
            const itemTax = (tx.amount * (proj.taxRate || 0)) / 100;
            netChange += tx.amount + itemTax;
          }
          if (tx.type === "RETURNED") {
            const itemTax = (tx.amount * (proj.taxRate || 0)) / 100;
            netChange -= tx.amount + itemTax;
          }
          if (tx.type === "PAYMENT" && tx.projectId === proj.id)
            netChange -= tx.amount;
        });

        let newDue = currentStats.due + netChange;
        let newStatus = proj.status;

        if (Math.abs(newDue) <= 0.01) newStatus = "Settled";
        else if (newDue > 0.01) newStatus = "Active";

        if (newStatus !== proj.status) {
          await saveDocData("projects", proj.id, {
            ...proj,
            status: newStatus,
          });
        }
      }

      setTxFormDate(new Date().toISOString().split("T")[0]);
      setTxFormPaymentAmount("");
      setAdvanceDeductionMode("none");
      setAdvancePartialAmount("");
      setTxFormMaterials([
        { id: Date.now(), itemId: "", quantity: "", unitPrice: "" },
      ]);
      setTransactionModalOpen(false);
    });
  };

  // --- VIEWS ---
  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in-up">
      <header className="mb-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-slate-800 dark:from-indigo-400 dark:to-white">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
          Here is what's happening with your business today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          className="p-6 relative overflow-hidden"
          onClick={() => {
            setCurrentView("debt");
            setOverviewTab("customer");
          }}
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/50 dark:to-rose-800/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <DollarSign size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Total Outstanding
              </p>
              <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                {formatCurrency(dashboardStats.totalDebt)}
              </h3>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 relative overflow-hidden"
          onClick={() => {
            setCurrentView("revenue");
            setOverviewTab("customer");
          }}
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <ArrowDownLeft size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Collected Revenue
              </p>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {formatCurrency(dashboardStats.totalRevenue)}
              </h3>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 relative overflow-hidden"
          onClick={() => setCurrentView("active_projects")}
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              <Briefcase size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Active Projects
              </p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {dashboardStats.activeProjectsCount}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center">
          <Clock size={20} className="mr-2 text-indigo-500" /> Recent
          Transactions
        </h3>
        <Card className="!p-0 border-none shadow-lg shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-800/80">
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5 font-bold tracking-wider">Date</th>
                  <th className="px-6 py-5 font-bold tracking-wider">
                    Customer & Project
                  </th>
                  <th className="px-6 py-5 font-bold tracking-wider">Type</th>
                  <th className="px-6 py-5 font-bold tracking-wider text-right">
                    Amount
                  </th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {transactions
                  .slice()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 10)
                  .map((tx) => {
                    const customer = customers.find(
                      (c) => c.id === tx.customerId
                    );
                    const project = projects.find((p) => p.id === tx.projectId);

                    if (tx.type === "ADVANCE_DEDUCTION") return null;
                    return (
                      <tr
                        key={tx.id}
                        onClick={() => {
                          if (tx.projectId) {
                            setSelectedProjectId(tx.projectId);
                            setSelectedCustomerId(tx.customerId);
                            setCurrentView("project");
                          } else {
                            setSelectedCustomerId(tx.customerId);
                            setCurrentView("profile");
                          }
                        }}
                        className="hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition-all cursor-pointer group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {customer?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {project?.name ||
                              (tx.type === "ADVANCE_PAYMENT"
                                ? "Account Credit (Lump-sum)"
                                : "Global")}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider
                          ${
                            tx.type === "TAKEN"
                              ? "bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                              : tx.type === "RETURNED"
                              ? "bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                              : "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          }`}
                          >
                            {tx.type.replace("_", " ")}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-black text-base
                        ${
                          tx.type === "TAKEN"
                            ? "text-amber-600 dark:text-amber-400"
                            : tx.type === "RETURNED"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                        >
                          {tx.type === "TAKEN" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="p-2 rounded-full opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-800 shadow-sm transition-all transform translate-x-2 group-hover:translate-x-0 inline-flex">
                            <ChevronRight
                              size={18}
                              className="text-indigo-500"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium"
                    >
                      No transactions recorded yet. Add some to see them here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderDebtOverview = () => {
    const customersWithDebt = customers
      .map((c) => ({ ...c, stats: getCustomerStats(c.id) }))
      .filter((c) => c.stats.totalDue > 0)
      .sort((a, b) => b.stats.totalDue - a.stats.totalDue);
    const projectsWithDebt = projects
      .map((p) => ({ ...p, stats: getProjectStats(p.id) }))
      .filter((p) => p.stats.due > 0)
      .sort((a, b) => b.stats.due - a.stats.due);
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <DollarSign className="mr-2 text-rose-500" /> Outstanding Debt
          </h2>
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setOverviewTab("customer")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                overviewTab === "customer"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              By Customer
            </button>
            <button
              onClick={() => setOverviewTab("project")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                overviewTab === "project"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              By Project
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewTab === "customer" ? (
            customersWithDebt.length > 0 ? (
              customersWithDebt.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomerId(c.id);
                    setCurrentView("profile");
                  }}
                >
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total Due
                      </p>
                    </div>
                    <span className="font-black text-2xl text-rose-600 dark:text-rose-400">
                      {formatCurrency(c.stats.totalDue)}
                    </span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                No outstanding debt.
              </div>
            )
          ) : projectsWithDebt.length > 0 ? (
            projectsWithDebt.map((p) => {
              const customer = customers.find((c) => c.id === p.customerId);
              return (
                <Card
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setSelectedCustomerId(p.customerId);
                    setCurrentView("project");
                  }}
                >
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      {customer?.name}
                    </p>
                    <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Project Due:
                      </span>
                      <span className="font-black text-xl">
                        {formatCurrency(p.stats.due)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              No projects with outstanding debt.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRevenueOverview = () => {
    const customersWithRevenue = customers
      .map((c) => ({ ...c, stats: getCustomerStats(c.id) }))
      .filter((c) => c.stats.totalPaid > 0)
      .sort((a, b) => b.stats.totalPaid - a.stats.totalPaid);
    const projectsWithRevenue = projects
      .map((p) => ({ ...p, stats: getProjectStats(p.id) }))
      .filter((p) => p.stats.paid > 0)
      .sort((a, b) => b.stats.paid - a.stats.paid);
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </button>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
            <ArrowDownLeft className="mr-2 text-emerald-500" /> Collected
            Revenue
          </h2>
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setOverviewTab("customer")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                overviewTab === "customer"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              By Customer
            </button>
            <button
              onClick={() => setOverviewTab("project")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                overviewTab === "project"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              By Project
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overviewTab === "customer" ? (
            customersWithRevenue.length > 0 ? (
              customersWithRevenue.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomerId(c.id);
                    setCurrentView("profile");
                  }}
                >
                  <div className="p-5 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total Paid
                      </p>
                    </div>
                    <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(c.stats.totalPaid)}
                    </span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                No revenue recorded yet.
              </div>
            )
          ) : projectsWithRevenue.length > 0 ? (
            projectsWithRevenue.map((p) => {
              const customer = customers.find((c) => c.id === p.customerId);
              return (
                <Card
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setSelectedCustomerId(p.customerId);
                    setCurrentView("project");
                  }}
                >
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      {customer?.name}
                    </p>
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Project Revenue:
                      </span>
                      <span className="font-black text-xl">
                        {formatCurrency(p.stats.paid)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              No revenue recorded for projects.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActiveProjects = () => {
    const activeProjs = projects
      .map((p) => ({ ...p, stats: getProjectStats(p.id) }))
      .filter((p) => p.status === "Active");
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <button
          onClick={() => setCurrentView("dashboard")}
          className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <Briefcase className="mr-2 text-indigo-500" /> Active Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeProjs.length > 0 ? (
            activeProjs.map((p) => {
              const customer = customers.find((c) => c.id === p.customerId);
              return (
                <Card
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setSelectedCustomerId(p.customerId);
                    setCurrentView("project");
                  }}
                >
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {customer?.name}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Current Due:
                      </span>
                      <span
                        className={`font-black text-lg ${
                          p.stats.due > 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {formatCurrency(p.stats.due)}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              No active projects right now.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCustomers = () => {
    let filteredCustomers = [...customers];
    if (customerSortOption === "most-projects")
      filteredCustomers.sort(
        (a, b) =>
          getCustomerStats(b.id).projectCount -
          getCustomerStats(a.id).projectCount
      );
    else if (customerSortOption === "most-unpaid")
      filteredCustomers.sort(
        (a, b) =>
          getCustomerStats(b.id).totalDue - getCustomerStats(a.id).totalDue
      );
    else if (customerSortOption === "most-paid")
      filteredCustomers.sort(
        (a, b) =>
          getCustomerStats(b.id).totalPaid - getCustomerStats(a.id).totalPaid
      );
    else filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Clients Directory
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Manage your contractors and view their balances.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-3 flex-wrap sm:flex-nowrap">
            <div className="relative group flex-1">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-200/80 dark:border-slate-700/80 rounded-2xl focus:ring-2 focus:ring-indigo-500 shadow-sm outline-none bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-200 font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                value={customerSortOption}
                onChange={(e) => setCustomerSortOption(e.target.value)}
              >
                <option value="name">Sort by Name A-Z</option>
                <option value="most-projects">Sort by Most Projects</option>
                <option value="most-unpaid">Sort by Highest Debt</option>
                <option value="most-paid">Sort by Most Paid</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors"
              />
            </div>
            <Button
              onClick={openAddCustomerModal}
              className="whitespace-nowrap shadow-indigo-500/20 shadow-lg"
            >
              <Plus size={18} className="mr-2" /> New Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => {
            const stats = getCustomerStats(customer.id);
            return (
              <Card
                key={customer.id}
                onClick={() => {
                  setSelectedCustomerId(customer.id);
                  setCurrentView("profile");
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      {customer.profilePhoto ? (
                        <img
                          src={customer.profilePhoto}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                          <Users size={20} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">
                          {customer.name}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center">
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white text-slate-400 dark:text-slate-500 transition-all duration-300 shadow-sm group-hover:shadow-indigo-500/30 group-hover:rotate-12">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                        Total Due
                      </p>
                      <p
                        className={`text-xl font-black ${
                          stats.totalDue > 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {formatCurrency(stats.totalDue)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                        Projects
                      </p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                        {stats.projectCount}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {filteredCustomers.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] backdrop-blur-sm">
              <Users size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                No clients found.
              </p>
              <p className="text-sm font-medium mt-1">
                Add your first client to get started tracking projects.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCustomerProfile = () => {
    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (!customer) return null;

    const custProjects = projects.filter((p) => p.customerId === customer.id);
    const stats = getCustomerStats(customer.id);

    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setCurrentView("customers")}
            className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/50 dark:bg-slate-800/50 py-2 px-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-sm"
          >
            <ChevronLeft size={16} className="mr-1.5" /> Back to Clients
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => openEditCustomerModal(customer)}
              className="flex items-center text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md"
            >
              <Settings size={16} className="mr-1.5" /> Edit Profile
            </button>
            <button
              onClick={() => {
                setDeleteTarget({ type: "customer", id: customer.id });
                setIsDeleteModalOpen(true);
              }}
              className="flex items-center text-sm font-bold text-rose-500 hover:text-white hover:bg-rose-500 transition-all py-2 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-slate-800 hover:shadow-md"
            >
              <Trash2 size={16} className="mr-1.5" /> Delete
            </button>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-slate-700/50 flex flex-col md:flex-row justify-between md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-8 w-full">
            {/* Customer Image Logic (View Only) */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              {customer.profilePhoto ? (
                <img
                  src={customer.profilePhoto}
                  alt=""
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] object-cover shadow-lg border-[3px] border-white dark:border-slate-700"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/30 dark:to-slate-800/50 text-indigo-500 flex items-center justify-center shadow-inner border-[3px] border-white dark:border-slate-700">
                  <Building2 size={40} className="opacity-50" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center truncate text-center sm:text-left">
                {customer.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                <p className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Primary Phone
                  </span>{" "}
                  <span className="text-base text-slate-800 dark:text-white font-bold">
                    {customer.phone}
                  </span>
                </p>
                {customer.secondaryPhone && (
                  <p className="flex flex-col items-center sm:items-start">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Secondary Phone
                    </span>{" "}
                    <span className="text-base text-slate-800 dark:text-white font-bold">
                      {customer.secondaryPhone}
                    </span>
                  </p>
                )}
                {customer.email && (
                  <p className="flex flex-col items-center sm:items-start">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Email
                    </span>{" "}
                    <span className="text-base text-slate-800 dark:text-white font-bold truncate max-w-full">
                      {customer.email}
                    </span>
                  </p>
                )}
                <p className="flex flex-col items-center sm:items-start">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Client Since
                  </span>{" "}
                  <span className="text-base text-slate-800 dark:text-white font-bold">
                    {formatDate(customer.createdAt)}
                  </span>
                </p>
                {customer.address && (
                  <p className="flex flex-col items-center sm:items-start sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                      Address
                    </span>{" "}
                    <span className="text-base text-slate-800 dark:text-white font-bold text-center sm:text-left">
                      {customer.address}
                    </span>
                  </p>
                )}
              </div>

              {/* ID Card Document Block (Only visible if attached) */}
              {customer.idPhoto && (
                <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/50">
                  <h4 className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-4 flex items-center justify-center sm:justify-start">
                    <ImageIcon size={14} className="mr-2" /> Client Documents
                  </h4>

                  <div className="flex justify-center sm:justify-start">
                    <div className="inline-flex flex-col sm:flex-row items-center p-3 pr-5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto">
                      <div className="flex items-center w-full sm:w-auto">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mr-4 shrink-0">
                          <CreditCard size={24} />
                        </div>
                        <div className="mr-6 flex-1 text-left">
                          <p className="text-sm font-black text-slate-800 dark:text-white">
                            ID Card Copy
                          </p>
                          <p className="text-[11px] font-bold text-emerald-500 flex items-center mt-0.5">
                            <CheckCircle size={10} className="mr-1" /> Image
                            Attached
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 sm:mt-0 sm:border-l border-slate-100 dark:border-slate-700 sm:pl-5 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0">
                        <Button
                          variant="secondary"
                          onClick={() => setIsIdModalOpen(true)}
                          className="!py-2 !px-4 !text-xs flex-1"
                        >
                          View Full Document
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto min-w-[280px]">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-900/20 mb-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                <DollarSign size={14} className="mr-1" /> Total Outstanding
              </p>
              <p
                className={`text-4xl font-black tracking-tight ${
                  stats.totalDue > 0 ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {formatCurrency(stats.totalDue)}
              </p>
              <div className="pt-4 mt-4 border-t border-slate-700/50 flex justify-between items-center text-sm font-medium text-slate-300">
                <span>Projects</span>
                <span className="font-bold text-white bg-slate-700 px-2 py-0.5 rounded-lg">
                  {stats.projectCount}
                </span>
              </div>
            </div>

            {/* Advance Balance Card */}
            <div
              className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 flex justify-between items-center group cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              onClick={() => setIsAdvanceModalOpen(true)}
            >
              <div>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center">
                  <Wallet size={12} className="mr-1" /> Advance Balance
                </p>
                <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(stats.advanceAvailable)}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Settings size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end border-b border-slate-200/60 dark:border-slate-800/60 pb-4 mt-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Active Projects
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Works in progress for this client.
            </p>
          </div>
          <Button
            onClick={() => setProjectModalOpen(true)}
            className="shadow-indigo-500/20 shadow-lg"
          >
            <Plus size={18} className="mr-2" /> New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {custProjects.map((project) => {
            const pStats = getProjectStats(project.id);
            return (
              <Card
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setCurrentView("project");
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="pr-4">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight mb-2">
                        {project.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                        ${
                          project.status === "Active"
                            ? "bg-indigo-100/80 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                            : "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        }`}
                      >
                        {project.status === "Active" ? (
                          <Clock size={12} className="mr-1.5" />
                        ) : (
                          <CheckCircle size={12} className="mr-1.5" />
                        )}
                        {project.status}
                      </span>
                    </div>
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white text-slate-400 dark:text-slate-500 transition-all duration-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        Net Materials:
                      </span>{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {formatCurrency(pStats.netBill)}
                      </span>
                    </div>
                    {pStats.pTaxRate > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                          VAT ({pStats.pTaxRate}%):
                        </span>{" "}
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {formatCurrency(pStats.taxAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        Total Paid:
                      </span>{" "}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(pStats.paid)}
                      </span>
                    </div>
                    <div className="pt-3 mt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                        Current Due:
                      </span>
                      <span
                        className={`text-xl font-black ${
                          pStats.due > 0
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {formatCurrency(pStats.due)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
          {custProjects.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] backdrop-blur-sm">
              <Briefcase size={32} className="mb-3 opacity-30" />
              <p className="font-bold text-slate-700 dark:text-slate-300">
                No projects yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProjectDetails = () => {
    const project = projects.find((p) => p.id === selectedProjectId);
    if (!project) return null;
    const customer = customers.find((c) => c.id === project.customerId);
    const stats = getProjectStats(project.id);

    const projTxs = transactions
      .filter((t) => t.projectId === project.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const takenList = projTxs.filter((t) => t.type === "TAKEN");
    const returnedList = projTxs.filter((t) => t.type === "RETURNED");
    const paymentsList = projTxs.filter((t) => t.type === "PAYMENT");

    return (
      <div className="space-y-6 animate-fade-in-up pb-24">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setCurrentView("profile")}
            className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/50 dark:bg-slate-800/50 py-2 px-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-sm"
          >
            <ChevronLeft size={16} className="mr-1.5" /> Back to Profile
          </button>
          <button
            onClick={() => {
              setDeleteTarget({ type: "project", id: project.id });
              setIsDeleteModalOpen(true);
            }}
            className="flex items-center text-sm font-bold text-rose-500 hover:text-white hover:bg-rose-500 transition-all py-2 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50"
          >
            <Trash2 size={16} className="mr-1.5" /> Delete
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-slate-700/50 relative overflow-hidden">
              <div className="absolute -left-10 -top-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 mb-4 rounded-lg text-[10px] font-black uppercase tracking-widest
                    ${
                      project.status === "Active"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/30 dark:text-emerald-300"
                    }`}
                  >
                    {project.status === "Active" ? (
                      <Clock size={12} className="mr-1.5" />
                    ) : (
                      <CheckCircle size={12} className="mr-1.5" />
                    )}
                    {project.status}
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {project.name}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 flex items-center">
                    <Users size={16} className="mr-2" /> {customer?.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div
                    onClick={() => {
                      setProjectVatInput(stats.pTaxRate);
                      setProjectVatModalOpen(true);
                    }}
                    className="text-left sm:text-right bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/50 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors group"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 flex items-center justify-between gap-2">
                      VAT Rate{" "}
                      <Settings
                        size={12}
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                    </p>
                    <p className="text-lg font-bold">{stats.pTaxRate}%</p>
                  </div>
                  <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Started Date
                    </p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => {
                  setTransactionType("TAKEN");
                  setTransactionModalOpen(true);
                }}
                className="shadow-amber-500/20 shadow-lg !bg-gradient-to-br !from-amber-400 !to-orange-500 !border-amber-400/20 py-4 !rounded-2xl"
              >
                <PackagePlus size={20} className="mr-2" /> Add Mat
              </Button>
              <Button
                onClick={() => {
                  setTransactionType("RETURNED");
                  setTransactionModalOpen(true);
                }}
                variant="secondary"
                className="py-4 !rounded-2xl !border-blue-200 dark:!border-blue-900/50 hover:!bg-blue-50 dark:hover:!bg-blue-900/20 !text-blue-600 dark:!text-blue-400"
              >
                <PackageMinus size={20} className="mr-2" /> Return
              </Button>
              <Button
                onClick={() => {
                  setTransactionType("PAYMENT");
                  setTransactionModalOpen(true);
                }}
                variant="success"
                className="shadow-emerald-500/20 shadow-lg py-4 !rounded-2xl"
              >
                <DollarSign size={20} className="mr-2" /> Pay
              </Button>
              <Button
                onClick={generatePDFInvoice}
                variant="secondary"
                disabled={isGeneratingPdf}
                className="py-4 !rounded-2xl !border-indigo-200 dark:!border-indigo-900/50 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/20 !text-indigo-600 dark:!text-indigo-400"
              >
                <Download size={20} className="mr-2" /> PDF
              </Button>
            </div>

            {/* Ledgers */}
            <div className="space-y-8">
              {[
                {
                  title: "Materials Taken",
                  icon: PackagePlus,
                  color: "amber",
                  data: takenList,
                  total: stats.taken,
                },
                {
                  title: "Materials Returned",
                  icon: PackageMinus,
                  color: "blue",
                  data: returnedList,
                  total: stats.returned,
                  isNegative: true,
                },
                {
                  title: "Payments Received",
                  icon: DollarSign,
                  color: "emerald",
                  data: paymentsList,
                  total: stats.paid,
                },
              ].map((ledger, i) => (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] shadow-lg shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden group"
                >
                  <div
                    className={`px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 bg-${ledger.color}-50/50 dark:bg-${ledger.color}-900/10 flex justify-between items-center transition-colors`}
                  >
                    <h3
                      className={`font-bold text-slate-800 dark:text-white flex items-center text-lg`}
                    >
                      <ledger.icon
                        size={20}
                        className={`mr-2.5 text-${ledger.color}-500`}
                      />{" "}
                      {ledger.title}
                    </h3>
                    <span
                      className={`font-black text-xl text-${ledger.color}-600 dark:text-${ledger.color}-400`}
                    >
                      {ledger.isNegative ? "-" : ""}
                      {formatCurrency(ledger.total)}
                    </span>
                  </div>
                  <div className="p-0 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                      <thead className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/50">
                        <tr>
                          <th className="px-6 py-4 font-bold">Date</th>
                          <th className="px-6 py-4 font-bold">
                            {ledger.title === "Payments Received"
                              ? "Description"
                              : "Item"}
                          </th>
                          {ledger.title !== "Payments Received" && (
                            <th className="px-6 py-4 font-bold text-right">
                              Qty x Price
                            </th>
                          )}
                          <th className="px-6 py-4 font-bold text-right">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                        {ledger.data.map((t) => (
                          <tr
                            key={t.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
                              {formatDate(t.date)}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                              {ledger.title === "Payments Received"
                                ? "Payment"
                                : t.itemName}
                            </td>
                            {ledger.title !== "Payments Received" && (
                              <td className="px-6 py-4 text-right font-medium text-slate-500">
                                {t.quantity}{" "}
                                <span className="text-[10px] uppercase text-slate-400">
                                  {t.unit}
                                </span>{" "}
                                x {formatCurrency(t.unitPrice)}
                              </td>
                            )}
                            <td
                              className={`px-6 py-4 text-right font-black text-${ledger.color}-600 dark:text-${ledger.color}-400 text-base`}
                            >
                              {formatCurrency(t.amount)}
                            </td>
                          </tr>
                        ))}
                        {ledger.data.length === 0 && (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-6 py-8 text-center text-slate-400 font-medium"
                            >
                              No records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar for Financial Summary */}
          <div className="w-full lg:w-80 lg:shrink-0 relative">
            <div className="sticky top-24">
              <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 dark:shadow-none border border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
                <div className="p-8 space-y-6 relative z-10">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-6">
                    <FileText size={16} className="mr-2" /> Financial Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">
                        Materials Taken
                      </span>
                      <span className="font-bold text-white">
                        {formatCurrency(stats.taken)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">
                        Materials Returned
                      </span>
                      <span className="font-bold text-blue-400">
                        - {formatCurrency(stats.returned)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-300">
                        Net Materials
                      </span>
                      <span className="font-black text-white text-lg">
                        {formatCurrency(stats.netBill)}
                      </span>
                    </div>
                    {stats.pTaxRate > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium">
                          VAT ({stats.pTaxRate}%)
                        </span>
                        <span className="font-bold text-rose-400">
                          + {formatCurrency(stats.taxAmount)}
                        </span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-slate-300">
                        Total Billed
                      </span>
                      <span className="font-black text-white text-lg">
                        {formatCurrency(stats.finalBill)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">
                        Total Paid
                      </span>
                      <span className="font-bold text-emerald-400">
                        - {formatCurrency(stats.paid)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t-2 border-slate-800 flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Current Balance Due
                    </span>
                    <span
                      className={`text-5xl font-black tracking-tighter ${
                        stats.due > 0 ? "text-white" : "text-emerald-400"
                      }`}
                    >
                      {formatCurrency(stats.due)}
                    </span>
                    {stats.due <= 0 && stats.surplus === 0 && (
                      <span className="text-xs text-emerald-400 font-black mt-3 uppercase tracking-widest bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                        Project Settled
                      </span>
                    )}
                    {stats.surplus > 0 && (
                      <span className="text-xs text-amber-400 font-black mt-3 uppercase tracking-widest bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
                        {formatCurrency(stats.surplus)} Moved to Advance
                      </span>
                    )}
                  </div>
                </div>

                {/* Decorative background blob inside the black card */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Project VAT Modal */}
        <Modal
          isOpen={isProjectVatModalOpen}
          onClose={() => setProjectVatModalOpen(false)}
          title="Adjust Project VAT"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSecureAction(async () => {
                const proj = projects.find((p) => p.id === selectedProjectId);
                if (proj) {
                  await saveDocData("projects", proj.id, {
                    ...proj,
                    taxRate: parseFloat(projectVatInput) || 0,
                  });
                }
                setProjectVatModalOpen(false);
              });
            }}
            className="space-y-5"
          >
            <div className="pt-2">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                Project VAT Rate (%)
              </label>
              <input
                required
                type="number"
                step="0.1"
                min="0"
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                value={projectVatInput}
                onChange={(e) => setProjectVatInput(e.target.value)}
              />
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setProjectVatModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="shadow-indigo-500/20 shadow-lg">
                Save VAT Rate
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  };

  const renderInventory = () => {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Product Inventory
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              Manage your materials and pricing.
            </p>
          </div>
          <Button
            onClick={() => setItemModalOpen(true)}
            className="whitespace-nowrap shadow-indigo-500/20 shadow-lg"
          >
            <Plus size={18} className="mr-2" /> Add Item
          </Button>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80">
                <tr>
                  <th className="px-8 py-5 font-bold">Item Name</th>
                  <th className="px-8 py-5 font-bold text-center">
                    Available Stock
                  </th>
                  <th className="px-8 py-5 font-bold text-right">
                    Default Unit Price
                  </th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {inventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-8 py-5 font-bold text-slate-800 dark:text-white text-base">
                      {item.name}
                      {item.unit && (
                        <span className="ml-3 text-[10px] font-black tracking-widest uppercase text-slate-400 dark:text-slate-500 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-black shadow-sm ${
                          item.stock <= 100
                            ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-indigo-600 dark:text-indigo-400 text-lg">
                      {formatCurrency(item.defaultPrice)}{" "}
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider ml-1">
                        / {item.unit || "unit"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            type: "inventory item",
                            id: item.id,
                          });
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {inventory.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-16 text-center text-slate-400 font-medium"
                    >
                      No products in inventory. Add your first item!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-8 animate-fade-in-up max-w-4xl">
      <header className="border-b border-slate-200/60 dark:border-slate-800/60 pb-6 mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
          Configure the app to fit your workflow.
        </p>
      </header>

      {/* PWA INSTALLATION BANNER */}
      {deferredPrompt && !isAppInstalled && (
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-2xl font-black tracking-tight flex items-center justify-center sm:justify-start mb-2">
              <Smartphone size={24} className="mr-3" /> Install GypMaster App
            </h3>
            <p className="text-indigo-100 font-medium">
              Install this application directly to your home screen or desktop
              for a faster, native app experience.
            </p>
          </div>
          <button
            onClick={installPWA}
            className="relative z-10 shrink-0 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-1 w-full sm:w-auto"
          >
            Install Now
          </button>
        </div>
      )}

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-slate-700/50 space-y-8">
        <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center tracking-tight">
          <Settings className="mr-3 text-indigo-500" /> App Configuration
        </h3>

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-3">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Color Theme (Day / Night Mode)
              </label>
              <div className="flex bg-slate-100/80 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleSettingChange("theme", "light")}
                  className={`flex-1 flex items-center justify-center py-4 px-4 text-base font-bold rounded-xl transition-all ${
                    theme === "light"
                      ? "bg-white text-indigo-600 shadow-md shadow-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Sun size={20} className="mr-2" /> Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => handleSettingChange("theme", "dark")}
                  className={`flex-1 flex items-center justify-center py-4 px-4 text-base font-bold rounded-xl transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 text-indigo-400 shadow-md shadow-black/20"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Moon size={20} className="mr-2" /> Night Mode
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Currency Format
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-900"
                  value={configForm.currency}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, currency: e.target.value })
                  }
                >
                  <option value="﷼">Saudi Riyal (SAR / ﷼)</option>
                  <option value="$">US Dollar (USD / $)</option>
                  <option value="৳">Bangladeshi Taka (BDT / ৳)</option>
                </select>
                <ChevronDown
                  size={18}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Company Name (For PDF Invoices)
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold shadow-sm transition-all focus:bg-white dark:focus:bg-slate-900"
                value={configForm.companyName}
                onChange={(e) =>
                  setConfigForm({ ...configForm, companyName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800 mt-2">
            <Button
              type="submit"
              className="shadow-indigo-500/20 shadow-lg px-8"
            >
              Save Configuration
            </Button>
          </div>
        </form>
      </div>

      {/* Professional VAT Section (Collapsible) */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-slate-700/50 space-y-6 transition-all">
        <div
          className="flex justify-between items-center cursor-pointer group"
          onClick={() => setIsVatSettingsOpen(!isVatSettingsOpen)}
        >
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
              <DollarSign className="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors" />{" "}
              VAT Configuration
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Set the default VAT percentage for your projects.
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors shadow-sm border border-slate-100 dark:border-slate-800">
            {isVatSettingsOpen ? (
              <ChevronUp
                size={24}
                className="text-slate-400 group-hover:text-indigo-500"
              />
            ) : (
              <ChevronDown
                size={24}
                className="text-slate-400 group-hover:text-indigo-500"
              />
            )}
          </div>
        </div>

        {isVatSettingsOpen && (
          <div className="animate-fade-in-up pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
            <form
              onSubmit={handleSaveVat}
              className="space-y-5 max-w-lg bg-slate-50/80 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-inner"
            >
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Global VAT Rate (%)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 15"
                  className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-black text-2xl shadow-sm tracking-wider"
                  value={vatInput}
                  onChange={(e) => setVatInput(e.target.value)}
                />
                <p className="text-[10px] font-bold text-slate-500 pt-1">
                  This rate will be automatically locked in for any new projects
                  created.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-end border-t border-slate-200/60 dark:border-slate-800 mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto px-8"
                >
                  Save VAT Rate
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-slate-700/50 space-y-6 transition-all">
        <div
          className="flex justify-between items-center cursor-pointer group"
          onClick={() => setIsPinSettingsOpen(!isPinSettingsOpen)}
        >
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
              <KeyRound className="mr-3 text-indigo-500 group-hover:text-indigo-600 transition-colors" />{" "}
              Security & Master PIN
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Require a PIN to add or delete data.
            </p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors shadow-sm border border-slate-100 dark:border-slate-800">
            {isPinSettingsOpen ? (
              <ChevronUp
                size={24}
                className="text-slate-400 group-hover:text-indigo-500"
              />
            ) : (
              <ChevronDown
                size={24}
                className="text-slate-400 group-hover:text-indigo-500"
              />
            )}
          </div>
        </div>

        {isPinSettingsOpen && (
          <div className="animate-fade-in-up pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
            <form
              onSubmit={handleSetPin}
              className="space-y-5 max-w-lg bg-slate-50/80 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-700/50 shadow-inner"
            >
              {appPin && (
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Current Master PIN
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="Enter current PIN"
                    className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-black tracking-[0.5em] text-center shadow-sm"
                    value={pinForm.current}
                    onChange={(e) =>
                      setPinForm({ ...pinForm, current: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {appPin ? "New Master PIN" : "Set Master PIN"}
                </label>
                <input
                  required
                  type="password"
                  placeholder="Enter new PIN"
                  className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-black tracking-[0.5em] text-center shadow-sm"
                  value={pinForm.new}
                  onChange={(e) =>
                    setPinForm({ ...pinForm, new: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Confirm New PIN
                </label>
                <input
                  required
                  type="password"
                  placeholder="Re-enter new PIN"
                  className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-black tracking-[0.5em] text-center shadow-sm"
                  value={pinForm.confirm}
                  onChange={(e) =>
                    setPinForm({ ...pinForm, confirm: e.target.value })
                  }
                />
              </div>

              {pinMsg.text && (
                <div
                  className={`p-4 rounded-2xl flex items-center shadow-sm border ${
                    pinMsg.type === "error"
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                  }`}
                >
                  {pinMsg.type === "error" ? (
                    <ShieldAlert size={20} className="mr-3" />
                  ) : (
                    <CheckCircle size={20} className="mr-3" />
                  )}
                  <span className="font-bold text-sm">{pinMsg.text}</span>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/60 dark:border-slate-800 mt-6">
                {appPin ? (
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                    <Lock size={14} className="mr-2" />{" "}
                    <span className="text-xs font-black uppercase tracking-wider">
                      Protection Active
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-800/50">
                    <ShieldAlert size={14} className="mr-2" />{" "}
                    <span className="text-xs font-black uppercase tracking-wider">
                      App Unprotected
                    </span>
                  </div>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full sm:w-auto px-8"
                >
                  {appPin ? "Update PIN" : "Enable Protection"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-slate-200/30 dark:shadow-none border border-white/60 dark:border-slate-700/50 space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center tracking-tight">
            <Download className="mr-3 text-emerald-500" /> Export Data (CSV)
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Download your data to securely back it up or open it in Excel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={exportCustomers}
            variant="secondary"
            className="py-5 justify-start pl-6 text-base shadow-sm"
          >
            <Users size={22} className="mr-3 text-indigo-500" /> Download
            Customers
          </Button>
          <Button
            onClick={exportProjects}
            variant="secondary"
            className="py-5 justify-start pl-6 text-base shadow-sm"
          >
            <Briefcase size={22} className="mr-3 text-amber-500" /> Download
            Projects
          </Button>
          <Button
            onClick={() => {
              handleSecureAction(() => {
                let csv =
                  "ID,Date,Project Name,Customer,Type,Item,Quantity,Unit Price,Total Amount\n";
                transactions.forEach((t) => {
                  const p = projects.find((proj) => proj.id === t.projectId);
                  const c = customers.find((cust) => cust.id === t.customerId);
                  csv += `"${t.id}","${formatDate(t.date)}","${
                    p?.name || ""
                  }","${c?.name || ""}","${t.type}","${t.itemName}","${
                    t.quantity || ""
                  }","${t.unitPrice || ""}","${t.amount}"\n`;
                });
                downloadCSV(csv, "Full_Ledger_Transactions.csv");
              });
            }}
            variant="secondary"
            className="py-5 justify-start pl-6 sm:col-span-2 text-base shadow-sm border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
          >
            <FileSpreadsheet size={22} className="mr-3 text-emerald-500" />{" "}
            Download Full Transaction Ledger
          </Button>
        </div>
      </div>

      {/* Demo Data Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-[2rem] border border-blue-100 dark:border-blue-800/30 space-y-5">
        <div>
          <h3 className="text-xl font-black text-blue-900 dark:text-blue-300 flex items-center tracking-tight">
            <Database className="mr-3 text-blue-500" /> Testing & Demo
          </h3>
          <p className="text-sm text-blue-700/80 dark:text-blue-400/80 font-medium mt-1">
            Load sample customers, projects, and transactions to see how the app
            looks with active data.
          </p>
        </div>
        <Button
          onClick={() => {
            handleSecureAction(loadDemoData);
          }}
          disabled={isSeedingDemo}
          className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white border-none shadow-blue-500/30 shadow-lg"
        >
          {isSeedingDemo ? "Loading Data..." : "Inject Demo Data"}
        </Button>
      </div>
    </div>
  );

  // --- NAVIGATION MENU COMPONENT ---
  const NavItem = ({ id, icon: Icon, label }) => {
    const isActive =
      currentView === id ||
      (id === "customers" &&
        (currentView === "profile" || currentView === "project")) ||
      (id === "dashboard" &&
        (currentView === "debt" ||
          currentView === "revenue" ||
          currentView === "active_projects"));
    return (
      <button
        onClick={() => setCurrentView(id)}
        className={`flex flex-col md:flex-row items-center justify-center md:justify-start w-full p-3 md:px-5 md:py-4 rounded-2xl transition-all duration-300 relative group overflow-hidden
          ${
            isActive
              ? "text-indigo-600 dark:text-indigo-400 shadow-sm md:shadow-md bg-white/90 dark:bg-slate-800/90 border border-slate-200/50 dark:border-slate-700/50"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full hidden md:block"></div>
        )}
        <Icon
          size={22}
          className={`md:mr-4 mb-1.5 md:mb-0 transition-transform duration-300 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
        />
        <span className="text-[10px] md:text-sm font-black tracking-wide">
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}
      style={{ fontFamily: "'Proxima Nova', 'Inter', system-ui, sans-serif" }}
    >
      <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F7FB] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 transition-colors duration-500 selection:bg-indigo-500/30">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          
          /* Custom Smooth Scrollbar */
          .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.5); }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(71, 85, 105, 0.5); }
          
          /* Global Scrollbar */
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.4); border-radius: 10px; border: 2px solid transparent; background-clip: content-box;}
          .dark ::-webkit-scrollbar-thumb { background-color: rgba(71, 85, 105, 0.6); }

          /* Hide Number Input Spinners Globally */
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
          input[type=number] {
            -moz-appearance: textfield;
          }

          /* Smooth Entrance Animations */
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>

        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl p-5 border-b border-slate-200/50 dark:border-slate-800/50 z-40 sticky top-0">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 tracking-tight flex items-center">
            <Building2
              className="mr-2 text-indigo-500 dark:text-indigo-400"
              size={24}
            />{" "}
            GypMaster
          </h1>
          {deferredPrompt && !isAppInstalled && (
            <button
              onClick={installPWA}
              className="text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 px-3 py-1.5 rounded-lg flex items-center"
            >
              <Smartphone size={14} className="mr-1" /> Install
            </button>
          )}
        </div>

        {/* Navigation Sidebar (Desktop) / Floating Dock (Mobile) */}
        <nav className="fixed bottom-4 left-4 right-4 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl md:static md:w-72 md:border-none md:rounded-none md:bg-transparent md:dark:bg-transparent md:border-r md:border-slate-200/50 md:dark:border-slate-800/50 md:min-h-screen shadow-2xl shadow-slate-200/50 dark:shadow-black/50 md:shadow-none transition-all flex flex-col">
          <div className="p-8 hidden md:block border-b border-slate-200/50 dark:border-slate-800/50 mb-4">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 tracking-tight flex items-center">
              <Building2
                className="mr-3 text-indigo-600 dark:text-indigo-400"
                size={32}
              />{" "}
              GypMaster
            </h1>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-[0.2em] ml-11">
              Business Portal
            </p>
          </div>
          <div className="flex md:flex-col justify-around md:justify-start p-2 md:px-4 gap-1 md:gap-2 flex-1 custom-scrollbar overflow-y-auto">
            <NavItem id="dashboard" icon={Home} label="Overview" />
            <NavItem id="customers" icon={Users} label="Clients" />
            <NavItem id="inventory" icon={Package} label="Inventory" />
            <NavItem id="settings" icon={Settings} label="Settings" />
          </div>

          {/* Desktop PWA Install Button */}
          {deferredPrompt && !isAppInstalled && (
            <div className="hidden md:block p-6 mt-auto">
              <button
                onClick={installPWA}
                className="w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform font-bold"
              >
                <Smartphone size={20} className="mr-2" /> Install App
              </button>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-10 pb-32 md:pb-10 flex flex-col min-h-screen relative">
          {/* GLOBAL SEARCH HEADER */}
          <header className="flex justify-between items-center mb-10 relative z-30">
            <div className="flex-1 hidden md:block">
              <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
            <div className="w-full md:max-w-md relative ml-auto group">
              <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur transition-all group-hover:bg-indigo-500/10"></div>
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-500 z-10"
                size={18}
              />
              <input
                type="text"
                placeholder="Search records..."
                className="w-full pl-12 pr-6 py-3.5 text-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 rounded-full shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 relative z-0"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onFocus={() => setIsGlobalSearchFocused(true)}
                onBlur={() =>
                  setTimeout(() => setIsGlobalSearchFocused(false), 200)
                }
              />

              {/* Search Results Dropdown */}
              {isGlobalSearchFocused && globalSearchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-96 overflow-y-auto custom-scrollbar z-50 p-3 animate-in fade-in slide-in-from-top-2">
                  {globalSearchResults.customers.length === 0 &&
                    globalSearchResults.projects.length === 0 &&
                    globalSearchResults.inventory.length === 0 && (
                      <div className="p-6 text-center text-slate-500 font-bold">
                        No results found for "{globalSearchQuery}"
                      </div>
                    )}

                  {globalSearchResults.customers.length > 0 && (
                    <div className="mb-3">
                      <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Clients
                      </div>
                      {globalSearchResults.customers.map((c) => (
                        <div
                          key={c.id}
                          onMouseDown={() =>
                            handleGlobalSearchResultClick("customer", c)
                          }
                          className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl cursor-pointer flex justify-between items-center transition-colors group"
                        >
                          <span className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {c.name}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {c.phone}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {globalSearchResults.projects.length > 0 && (
                    <div className="mb-3">
                      <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Projects
                      </div>
                      {globalSearchResults.projects.map((p) => {
                        const cust = customers.find(
                          (c) => c.id === p.customerId
                        );
                        return (
                          <div
                            key={p.id}
                            onMouseDown={() =>
                              handleGlobalSearchResultClick("project", p)
                            }
                            className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl cursor-pointer flex justify-between items-center transition-colors group"
                          >
                            <span className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {p.name}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {cust?.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {globalSearchResults.inventory.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Inventory
                      </div>
                      {globalSearchResults.inventory.map((i) => (
                        <div
                          key={i.id}
                          onMouseDown={() =>
                            handleGlobalSearchResultClick("inventory", i)
                          }
                          className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl cursor-pointer flex justify-between items-center transition-colors group"
                        >
                          <span className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {i.name}
                          </span>
                          <span className="text-xs font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                            {i.stock} in stock
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* View Switcher */}
          <div className="flex-1 w-full">
            {currentView === "dashboard" && renderDashboard()}
            {currentView === "customers" && renderCustomers()}
            {currentView === "inventory" && renderInventory()}
            {currentView === "profile" && renderCustomerProfile()}
            {currentView === "project" && renderProjectDetails()}
            {currentView === "debt" && renderDebtOverview()}
            {currentView === "revenue" && renderRevenueOverview()}
            {currentView === "active_projects" && renderActiveProjects()}
            {currentView === "settings" && renderSettings()}
          </div>

          {/* --- MODALS --- */}

          {/* MISSING PIN / ACTION LOCKED MODAL */}
          <Modal
            isOpen={isLockedModalOpen}
            onClose={() => setIsLockedModalOpen(false)}
            title={
              <span className="flex items-center text-indigo-600 dark:text-indigo-400">
                <ShieldAlert className="mr-2" /> Action Locked
              </span>
            }
            zIndex="z-[60]"
          >
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                For security reasons, this action is blocked because no Master
                PIN is set.
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900">
                Please go to Settings to set up your Master PIN before modifying
                data.
              </p>
              <div className="pt-6 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsLockedModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsLockedModalOpen(false);
                    setCustomerModalOpen(false);
                    setProjectModalOpen(false);
                    setItemModalOpen(false);
                    setTransactionModalOpen(false);
                    setIsDeleteModalOpen(false);
                    setCurrentView("settings");
                  }}
                  variant="primary"
                >
                  Go to Settings
                </Button>
              </div>
            </div>
          </Modal>

          {/* SECURITY PIN CONFIRMATION MODAL */}
          <Modal
            isOpen={isPinModalOpen}
            onClose={() => setIsPinModalOpen(false)}
            title={
              <span className="flex items-center text-indigo-600 dark:text-indigo-400">
                <Lock className="mr-2" /> Verification Required
              </span>
            }
            zIndex="z-[60]"
          >
            <form onSubmit={submitPin} className="space-y-5">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Please enter your Master PIN to authorize and complete this
                action.
              </p>
              <div>
                <input
                  required
                  type="password"
                  autoFocus
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-center text-3xl tracking-[0.5em] shadow-inner font-black"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                />
              </div>
              {pinError && (
                <p className="text-sm text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900 text-center">
                  {pinError}
                </p>
              )}
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setPendingAction(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="shadow-indigo-500/20 shadow-lg"
                >
                  Authorize Action
                </Button>
              </div>
            </form>
          </Modal>

          {/* DELETE CONFIRMATION MODAL */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            title={
              <span className="flex items-center text-rose-600 dark:text-rose-400">
                <ShieldAlert className="mr-2" /> Confirm Deletion
              </span>
            }
          >
            <div className="space-y-5">
              <p className="text-base font-bold text-slate-700 dark:text-slate-300">
                Are you absolutely sure you want to delete this{" "}
                <strong>{deleteTarget?.type}</strong>?
              </p>
              <p className="text-sm font-medium text-slate-500">
                {deleteTarget?.type === "customer" &&
                  "This will permanently erase all projects and transactions associated with them."}
                {deleteTarget?.type === "project" &&
                  "This will permanently erase all transactions logged under this project."}
                {deleteTarget?.type === "inventory item" &&
                  "This will permanently remove this item from your catalog."}
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-900/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50">
                This action cannot be undone.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmDelete}
                  variant="danger"
                  className="shadow-rose-500/20 shadow-lg"
                >
                  <Trash2 size={18} className="mr-2" /> Yes, Delete
                </Button>
              </div>
            </div>
          </Modal>

          {/* Add / Edit Customer Modal */}
          <Modal
            isOpen={isCustomerModalOpen}
            onClose={() => setCustomerModalOpen(false)}
            title={
              editingCustomerId ? "Edit Client Profile" : "New Client Profile"
            }
          >
            <form onSubmit={handleSaveCustomerForm} className="space-y-5">
              {/* Form Profile Photo Upload */}
              <div className="flex justify-center mb-6">
                <div
                  className="relative group shrink-0 cursor-pointer"
                  onClick={() =>
                    document.getElementById("new-profile-photo").click()
                  }
                >
                  {customerForm.profilePhoto ? (
                    <img
                      src={customerForm.profilePhoto}
                      alt=""
                      className="w-24 h-24 rounded-full object-cover shadow-lg border-[3px] border-white dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-[3px] border-white dark:border-slate-700 shadow-inner group-hover:bg-slate-200 transition-colors">
                      <Camera size={32} />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Plus size={16} />
                  </div>
                  <input
                    id="new-profile-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFormImageUpload(e, "profilePhoto")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Client / Contractor Name{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                  value={customerForm.name}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, name: e.target.value })
                  }
                  placeholder="e.g. John Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Primary Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        phone: e.target.value,
                      })
                    }
                    placeholder="e.g. 555-0199"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Secondary Phone
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                    value={customerForm.secondaryPhone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        secondaryPhone: e.target.value,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, email: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Address
                </label>
                <textarea
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900 resize-none custom-scrollbar"
                  value={customerForm.address}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      address: e.target.value,
                    })
                  }
                  placeholder="e.g. 123 Builder St..."
                  rows={2}
                ></textarea>
              </div>

              {/* Form ID Card Upload */}
              <div className="pt-2">
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  ID Card Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      document.getElementById("new-id-photo").click()
                    }
                    className="!py-3 !px-5 !text-xs !rounded-xl border border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-50"
                  >
                    <ImageIcon size={16} className="mr-2 text-indigo-500" />{" "}
                    {customerForm.idPhoto
                      ? "Change ID Photo"
                      : "Upload ID Card"}
                  </Button>
                  {customerForm.idPhoto && (
                    <span className="text-[11px] font-bold text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-800">
                      <CheckCircle size={14} className="mr-1.5" /> Attached
                    </span>
                  )}
                  <input
                    id="new-id-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFormImageUpload(e, "idPhoto")}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setCustomerModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="shadow-indigo-500/20 shadow-lg"
                >
                  {editingCustomerId ? "Save Changes" : "Save Client"}
                </Button>
              </div>
            </form>
          </Modal>

          {/* Add Project Modal */}
          <Modal
            isOpen={isProjectModalOpen}
            onClose={() => setProjectModalOpen(false)}
            title="Create New Project"
          >
            <form onSubmit={handleAddProject} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Project Name / Location
                </label>
                <input
                  required
                  type="text"
                  autoFocus
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900 text-lg"
                  value={projectForm.name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, name: e.target.value })
                  }
                  placeholder="e.g. 5th Avenue Villa"
                />
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setProjectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="shadow-indigo-500/20 shadow-lg"
                >
                  Create Project
                </Button>
              </div>
            </form>
          </Modal>

          {/* Add Inventory Item Modal */}
          <Modal
            isOpen={isItemModalOpen}
            onClose={() => setItemModalOpen(false)}
            title="Add Product to Inventory"
          >
            <form onSubmit={handleAddItem} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Product Name
                </label>
                <input
                  required
                  type="text"
                  list="inventory-suggestions"
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, name: e.target.value })
                  }
                  placeholder="Type to search or enter new name"
                />
                <datalist id="inventory-suggestions">
                  {Array.from(
                    new Set([
                      ...inventory.map((i) => i.name),
                      ...COMMON_INVENTORY_ITEMS,
                    ])
                  ).map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">
                  If you select an existing product, it will automatically
                  update its stock.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Unit Price ({currency})
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                    value={itemForm.defaultPrice}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, defaultPrice: e.target.value })
                    }
                    placeholder="15.00"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                    Unit Type
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                    value={itemForm.unit}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, unit: e.target.value })
                    }
                    placeholder="e.g. board, bag"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Initial Stock
                </label>
                <input
                  required
                  type="number"
                  step="1"
                  min="0"
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                  value={itemForm.stock}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, stock: e.target.value })
                  }
                  placeholder="e.g. 500"
                />
              </div>
              <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setItemModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="shadow-indigo-500/20 shadow-lg"
                >
                  Save Product
                </Button>
              </div>
            </form>
          </Modal>

          {/* Transaction Modal (Payment + Advance Deduction) */}
          <Modal
            isOpen={isTransactionModalOpen}
            onClose={() => {
              setTransactionModalOpen(false);
              setAdvanceDeductionMode("none");
              setAdvancePartialAmount("");
            }}
            title={
              <span
                className={`flex items-center ${
                  transactionType === "PAYMENT"
                    ? "text-emerald-600"
                    : transactionType === "TAKEN"
                    ? "text-amber-600"
                    : "text-blue-600"
                }`}
              >
                {transactionType === "PAYMENT" && (
                  <DollarSign className="mr-2" />
                )}
                {transactionType === "TAKEN" && (
                  <PackagePlus className="mr-2" />
                )}
                {transactionType === "RETURNED" && (
                  <PackageMinus className="mr-2" />
                )}
                {transactionType === "TAKEN"
                  ? "Log Material Taken"
                  : transactionType === "RETURNED"
                  ? "Log Material Returned"
                  : "Log Payment Received"}
              </span>
            }
          >
            <form onSubmit={handleAddTransaction} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                  Transaction Date
                </label>
                <input
                  required
                  type="date"
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold transition-all focus:bg-white dark:focus:bg-slate-900"
                  value={txFormDate}
                  onChange={(e) => setTxFormDate(e.target.value)}
                />
              </div>

              {transactionType !== "PAYMENT" && (
                <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 mt-4">
                  {txFormMaterials.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-5 bg-slate-50/80 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-700/50 rounded-[1.5rem] space-y-4 relative shadow-sm"
                    >
                      {txFormMaterials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMaterialRow(m.id)}
                          className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition-all hover:scale-110"
                        >
                          <X size={14} />
                        </button>
                      )}
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                          Select Material {idx + 1}
                        </label>
                        <select
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold"
                          value={m.itemId}
                          onChange={(e) =>
                            updateMaterialRow(m.id, "itemId", e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Select a product...
                          </option>
                          {/* Intelligent Filtering: If returning, only show items taken in this project */}
                          {(transactionType === "RETURNED"
                            ? inventory.filter((i) =>
                                takenItemIdsForSelectedProject.includes(i.id)
                              )
                            : inventory
                          ).map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.stock} in warehouse)
                            </option>
                          ))}
                          {transactionType === "TAKEN" && (
                            <option
                              value="NEW_ITEM"
                              className="font-bold text-indigo-600 dark:text-indigo-400"
                            >
                              + Add New Product...
                            </option>
                          )}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                            Qty{" "}
                            {m.itemId && m.itemId !== "NEW_ITEM" && (
                              <span className="lowercase font-normal text-slate-400">
                                (
                                {inventory.find((i) => i.id === m.itemId)
                                  ?.unit || "unit"}
                                )
                              </span>
                            )}
                          </label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold"
                            value={m.quantity}
                            onChange={(e) =>
                              updateMaterialRow(
                                m.id,
                                "quantity",
                                e.target.value
                              )
                            }
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                            Price ({currency})
                          </label>
                          <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold"
                            value={m.unitPrice}
                            onChange={(e) =>
                              updateMaterialRow(
                                m.id,
                                "unitPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addMaterialRow}
                    className="w-full border-dashed border-2 py-4 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 rounded-[1.5rem]"
                  >
                    <Plus size={18} className="mr-2" /> Add Another Material
                  </Button>

                  <div className="p-5 bg-indigo-500 rounded-[1.5rem] flex justify-between items-center mt-6 shadow-lg shadow-indigo-500/20 text-white">
                    <span className="text-sm font-bold opacity-90">
                      Total Selection Value
                    </span>
                    <span className="font-black text-2xl">
                      {formatCurrency(
                        txFormMaterials.reduce(
                          (sum, m) =>
                            sum +
                            parseFloat(m.quantity || 0) *
                              parseFloat(m.unitPrice || 0),
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              )}

              {transactionType === "PAYMENT" && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-5">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                      Cash / New Payment Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-emerald-500">
                        {currency}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        autoFocus
                        className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 border border-emerald-200 dark:border-emerald-900/50 rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500 outline-none text-emerald-600 dark:text-emerald-400 text-4xl font-black shadow-inner transition-all placeholder:text-emerald-600/30"
                        value={txFormPaymentAmount}
                        onChange={(e) => setTxFormPaymentAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Advance Payment Use Option */}
                  {getCustomerStats(selectedCustomerId).advanceAvailable >
                    0 && (
                    <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/20 space-y-4 shadow-sm">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white flex items-center">
                          <Wallet size={16} className="mr-2 text-emerald-500" />{" "}
                          Deduct from Advance Balance
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Available:{" "}
                          {formatCurrency(
                            getCustomerStats(selectedCustomerId)
                              .advanceAvailable
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setAdvanceDeductionMode("none")}
                          className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                            advanceDeductionMode === "none"
                              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          None
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdvanceDeductionMode("partial")}
                          className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                            advanceDeductionMode === "partial"
                              ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          Partial
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAdvanceDeductionMode("whole");
                          }}
                          className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                            advanceDeductionMode === "whole"
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          Whole
                        </button>
                      </div>

                      {advanceDeductionMode === "partial" && (
                        <div className="animate-fade-in-up pt-2">
                          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                            Partial Amount to Deduct
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                              {currency}
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={
                                getCustomerStats(selectedCustomerId)
                                  .advanceAvailable
                              }
                              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 dark:text-white font-bold text-sm transition-all focus:bg-white dark:focus:bg-slate-800"
                              value={advancePartialAmount}
                              onChange={(e) =>
                                setAdvancePartialAmount(e.target.value)
                              }
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      )}
                      {advanceDeductionMode === "whole" && (
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2.5 rounded-xl inline-block border border-emerald-100 dark:border-emerald-800">
                          Will deduct{" "}
                          {formatCurrency(
                            Math.min(
                              getCustomerStats(selectedCustomerId)
                                .advanceAvailable,
                              getProjectStats(selectedProjectId)?.due || 0
                            )
                          )}{" "}
                          from advance.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setTransactionModalOpen(false);
                    setAdvanceDeductionMode("none");
                    setAdvancePartialAmount("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={
                    transactionType === "PAYMENT" ? "success" : "primary"
                  }
                  className="px-8 shadow-lg"
                >
                  Save Entry
                </Button>
              </div>
            </form>
          </Modal>

          {/* View ID Modal */}
          <Modal
            isOpen={isIdModalOpen}
            onClose={() => setIsIdModalOpen(false)}
            title="Customer ID Card"
            zIndex="z-[60]"
          >
            <div className="flex justify-center p-4">
              {customers.find((c) => c.id === selectedCustomerId)?.idPhoto ? (
                <img
                  src={
                    customers.find((c) => c.id === selectedCustomerId)?.idPhoto
                  }
                  alt="ID Card"
                  className="max-w-full rounded-2xl shadow-md"
                />
              ) : (
                <p>No ID Card uploaded.</p>
              )}
            </div>
          </Modal>

          {/* Manage Advance Payment Modal */}
          <Modal
            isOpen={isAdvanceModalOpen}
            onClose={() => setIsAdvanceModalOpen(false)}
            title={
              <span className="flex items-center text-emerald-600">
                <Wallet className="mr-2" /> Manage Advance Balance
              </span>
            }
          >
            <form onSubmit={handleAddAdvancePayment} className="space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Adjust the client's global advance balance. This money can be
                used to pay off any of their future projects.
              </p>

              <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => setAdvanceActionType("ADD")}
                  className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-bold rounded-xl transition-all ${
                    advanceActionType === "ADD"
                      ? "bg-white text-emerald-600 shadow-md shadow-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Plus size={16} className="mr-2" /> Add Funds
                </button>
                <button
                  type="button"
                  onClick={() => setAdvanceActionType("DEDUCT")}
                  className={`flex-1 flex items-center justify-center py-3 px-4 text-sm font-bold rounded-xl transition-all ${
                    advanceActionType === "DEDUCT"
                      ? "bg-white text-rose-600 shadow-md shadow-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Minus size={16} className="mr-2" /> Withdraw / Deduct
                </button>
              </div>

              <div className="pt-4">
                <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  Amount to{" "}
                  {advanceActionType === "ADD" ? "Deposit" : "Withdraw"}
                </label>
                <div className="relative">
                  <span
                    className={`absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black ${
                      advanceActionType === "ADD"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {currency}
                  </span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={
                      advanceActionType === "DEDUCT"
                        ? getCustomerStats(selectedCustomerId).advanceAvailable
                        : undefined
                    }
                    autoFocus
                    className={`w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 border rounded-[1.5rem] focus:ring-2 outline-none text-4xl font-black shadow-inner transition-all ${
                      advanceActionType === "ADD"
                        ? "border-emerald-200 dark:border-emerald-900/50 focus:ring-emerald-500 text-emerald-600 dark:text-emerald-400 placeholder:text-emerald-600/30"
                        : "border-rose-200 dark:border-rose-900/50 focus:ring-rose-500 text-rose-600 dark:text-rose-400 placeholder:text-rose-600/30"
                    }`}
                    value={advanceFormAmount}
                    onChange={(e) => setAdvanceFormAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                {advanceActionType === "DEDUCT" && (
                  <p className="text-xs font-bold text-slate-500 mt-2">
                    Maximum withdrawal:{" "}
                    {formatCurrency(
                      getCustomerStats(selectedCustomerId).advanceAvailable
                    )}
                  </p>
                )}
              </div>
              <div className="pt-6 flex justify-end gap-3 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAdvanceModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={advanceActionType === "ADD" ? "success" : "danger"}
                  className="px-8 shadow-lg"
                >
                  Confirm{" "}
                  {advanceActionType === "ADD" ? "Deposit" : "Withdrawal"}
                </Button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}
