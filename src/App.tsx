import React, { useEffect, useState } from "react";
import { InventoryProvider } from "./context/InventoryContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { StorePage } from "./pages/StorePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CustomerProfilePage } from "./pages/CustomerProfilePage";
import { ShoppingBag, UserRound, ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "./context/AuthContext";

function StoreHeader({ navigate }: { navigate: (path: string) => void }) {
  const { cart } = useCart();
  const { currentUser, logout } = useAuth();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf9]/95 backdrop-blur border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center">
            <span className="text-xl">ॐ</span>
          </div>
          <div>
            <div className="marcellus text-lg font-bold text-stone-900">Sanatan Seva Store</div>
            <div className="text-[10px] uppercase tracking-widest text-stone-500">Spiritual • Cultural • Devotional</div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-700">
          <button onClick={() => navigate("/")} className="hover:text-orange-700">Shop</button>
          <button onClick={() => navigate("/?category=Puja%20%26%20Devotional")} className="hover:text-orange-700">Puja</button>
          <button onClick={() => navigate("/?category=Hindu%20Books")} className="hover:text-orange-700">Books</button>
          <button onClick={() => navigate("/?category=Hindu%20Symbols")} className="hover:text-orange-700">Symbols</button>
        </nav>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <button title="Admin" onClick={() => navigate("/admin")} className="p-2 rounded-full hover:bg-orange-50">
                  <ShieldCheck className="w-5 h-5 text-orange-700" />
                </button>
              )}
              <button title="My Account" onClick={() => navigate("/account")} className="p-2 rounded-full hover:bg-orange-50">
                <UserRound className="w-5 h-5" />
              </button>
              <button title="Sign out" onClick={logout} className="p-2 rounded-full hover:bg-orange-50">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="hidden sm:inline-flex px-3 py-2 rounded-full border border-stone-200 text-xs font-bold">
              Sign in
            </button>
          )}
          <button onClick={() => navigate("/cart")} className="relative p-2 rounded-full hover:bg-orange-50">
            <ShoppingBag className="w-5 h-5" />
            {count > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function StoreFooter({ navigate }: { navigate: (path: string) => void }) {
  return (
    <footer className="border-t border-orange-100 bg-stone-950 text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="marcellus text-xl text-white">Sanatan Seva Store</h3>
          <p className="mt-2 text-sm leading-6 text-stone-400">Spiritual products, cultural values and meaningful living.</p>
        </div>
        <div>
          <h4 className="font-bold text-white">Store</h4>
          <div className="mt-3 space-y-2 text-sm">
            <button onClick={() => navigate("/")} className="block hover:text-white">Shop</button>
            <button onClick={() => navigate("/cart")} className="block hover:text-white">Cart</button>
            <button onClick={() => navigate("/account")} className="block hover:text-white">My Account</button>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white">Sanatan Dharma Seva Trust</h4>
          <a href="https://www.sanatandharmasevatrust.in/" target="_blank" rel="noreferrer" className="mt-3 block text-sm text-orange-300 hover:text-orange-200">
            Visit Trust Website
          </a>
          <p className="mt-2 text-xs text-stone-500">Store purchases and charitable donations are separate transactions.</p>
        </div>
      </div>
    </footer>
  );
}

function LoginPage({ navigate }: { navigate: (path: string) => void }) {
  const { loginAsCustomer, loginAsAdmin, registerCustomer } = useAuth();
  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setPhone("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (mode === "admin") {
        const result = await loginAsAdmin(email, password);
        if (result.success) navigate("/admin");
        else setMessage(result.message);
        return;
      }

      if (signup) {
        if (!name.trim()) {
          setMessage("Please enter your full name.");
          return;
        }
        if (password.length < 8) {
          setMessage("Password must contain at least 8 characters.");
          return;
        }
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          return;
        }

        const result = await registerCustomer({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
        });

        if (result.success) navigate("/account");
        else setMessage(result.message);
      } else {
        const result = await loginAsCustomer(
          email.trim(),
          undefined,
          undefined,
          password
        );
        if (result.success) navigate("/account");
        else setMessage(result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const switchToSignup = () => {
    resetForm();
    setMode("customer");
    setSignup(true);
  };

  const switchToSignin = () => {
    resetForm();
    setMode("customer");
    setSignup(false);
  };

  return (
    <div className="min-h-[70vh] px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-stone-500 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to store
        </button>

        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-2xl">
            ॐ
          </div>
          <h1 className="marcellus text-3xl font-bold text-stone-900 mt-4">
            {mode === "admin" ? "Admin Access" : signup ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            {mode === "admin"
              ? "Secure access to the Sanatan Seva Store administration."
              : signup
                ? "Join Sanatan Seva Store to manage your orders and account."
                : "Sign in with your registered Store account."}
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => { resetForm(); setMode("customer"); setSignup(false); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold ${
              mode === "customer" ? "bg-orange-600 text-white" : "bg-stone-100"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => { resetForm(); setMode("admin"); setSignup(false); }}
            className={`flex-1 py-2 rounded-full text-xs font-bold ${
              mode === "admin" ? "bg-orange-600 text-white" : "bg-stone-100"
            }`}
          >
            Admin
          </button>
        </div>

        {mode === "customer" && (
          <div className="flex items-center justify-center gap-2 mt-5 text-xs">
            <span className={signup ? "text-stone-400" : "font-bold text-stone-800"}>Sign in</span>
            <button
              type="button"
              onClick={signup ? switchToSignin : switchToSignup}
              className="relative w-11 h-6 rounded-full bg-orange-100"
              aria-label={signup ? "Switch to sign in" : "Switch to sign up"}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-orange-600 transition-all ${
                  signup ? "left-6" : "left-1"
                }`}
              />
            </button>
            <span className={signup ? "font-bold text-stone-800" : "text-stone-400"}>Sign up</span>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "customer" && signup && (
            <>
              <label className="block">
                <span className="text-xs font-bold text-stone-700">Full name</span>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  className="mt-1 w-full rounded-xl border border-stone-200 p-3 outline-none focus:ring-2 focus:ring-orange-200"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-stone-700">Phone number</span>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91"
                  autoComplete="tel"
                  className="mt-1 w-full rounded-xl border border-stone-200 p-3 outline-none focus:ring-2 focus:ring-orange-200"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="text-xs font-bold text-stone-700">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-stone-200 p-3 outline-none focus:ring-2 focus:ring-orange-200"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold text-stone-700">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={signup ? "At least 8 characters" : "Your password"}
              autoComplete={signup ? "new-password" : "current-password"}
              className="mt-1 w-full rounded-xl border border-stone-200 p-3 outline-none focus:ring-2 focus:ring-orange-200"
            />
          </label>

          {mode === "customer" && signup && (
            <label className="block">
              <span className="text-xs font-bold text-stone-700">Confirm password</span>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-stone-200 p-3 outline-none focus:ring-2 focus:ring-orange-200"
              />
            </label>
          )}

          {message && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-700">
              {message}
            </div>
          )}

          <button
            disabled={busy}
            className="w-full py-3 rounded-xl buy-btn text-white font-bold disabled:opacity-60"
          >
            {busy
              ? "Please wait..."
              : mode === "admin"
                ? "Admin Sign In"
                : signup
                  ? "Create Account"
                  : "Sign In"}
          </button>
        </form>

        {mode === "customer" && (
          <div className="mt-6 text-center text-xs text-stone-500">
            {signup ? "Already have an account?" : "New to Sanatan Seva Store?"}{" "}
            <button
              type="button"
              onClick={signup ? switchToSignin : switchToSignup}
              className="font-bold text-orange-700 hover:text-orange-800"
            >
              {signup ? "Sign in" : "Create an account"}
            </button>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-stone-100 text-center text-[11px] text-stone-400">
          Your account is used for store orders and account management.
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [path, setPath] = useState(window.location.pathname + window.location.search);
  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const f = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener("popstate", f);
    return () => window.removeEventListener("popstate", f);
  }, []);

  const [rawPathname, query] = path.split("?");
  const params = new URLSearchParams(query || "");

  // Support both the standalone-store root routes and the /store/* routes
  // used by the existing Store components. This fixes links such as
  // "Proceed to Checkout" -> /store/checkout.
  const pathname =
    rawPathname === "/store" ? "/" :
    rawPathname.startsWith("/store/") ? rawPathname.slice("/store".length) :
    rawPathname;

  let page: React.ReactNode;
  if (pathname === "/" || pathname === "") {
    page = <StorePage navigate={navigate} initialCategory={params.get("category")} />;
  } else if (pathname === "/login" || pathname === "/signup") {
    page = <LoginPage navigate={navigate} />;
  } else if (pathname === "/cart") {
    page = <CartPage navigate={navigate} />;
  } else if (pathname === "/checkout") {
    page = <CheckoutPage navigate={navigate} />;
  } else if (pathname === "/account" || pathname === "/profile") {
    page = <CustomerProfilePage navigate={navigate} />;
  } else if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAuthenticated) {
      page = <LoginPage navigate={navigate} />;
    } else if (!isAdmin) {
      page = (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 shadow-sm p-8 text-center">
            <div className="text-4xl">🔒</div>
            <h1 className="marcellus text-2xl font-bold text-stone-900 mt-4">Admin access required</h1>
            <p className="text-sm text-stone-500 mt-2">
              This area is restricted to authorized Store administrators.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-5 py-3 rounded-xl bg-orange-600 text-white font-bold"
            >
              Return to Store
            </button>
          </div>
        </div>
      );
    } else {
      page = <AdminDashboardPage navigate={navigate} />;
    }
  } else if (pathname.startsWith("/product/")) {
    page = (
      <ProductDetailPage
        slug={pathname.replace("/product/", "").replace(/\/$/, "")}
        navigate={navigate}
      />
    );
  } else {
    page = <StorePage navigate={navigate} initialCategory={params.get("category")} />;
  };

  return (
    <>
      <StoreHeader navigate={navigate} />
      <main className="min-h-[70vh]">{page}</main>
      <StoreFooter navigate={navigate} />
    </>
  );
}

export default function App() {
  return (
    <InventoryProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-[#fdfbf7] text-[#2d2d2d]">
            <Router />
          </div>
        </CartProvider>
      </AuthProvider>
    </InventoryProvider>
  );
}
