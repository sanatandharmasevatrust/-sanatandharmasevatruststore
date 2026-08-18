import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAccount, UserRole, OrderDetails } from "../types";
import { supabase, isSupabaseConfigured, getSupabaseClient } from "../lib/supabase";

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isSupabaseLive: boolean;
  supabaseStatus: "live_connected" | "demo_fallback" | "connecting";
  loginAsAdmin: (email?: string, password?: string) => Promise<{ success: boolean; message: string }>;
  loginAsCustomer: (email: string, name?: string, phone?: string, password?: string) => Promise<{ success: boolean; message: string }>;
  registerCustomer: (details: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: any;
    pan?: string;
    gotra?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserAccount>) => Promise<void>;
  orders: OrderDetails[];
  addCustomerOrder: (order: OrderDetails) => void;
  switchRoleQuick: (role: UserRole) => void;
  lastSecurityCheck: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "sanatan_seva_auth_user_v1";
const ORDERS_STORAGE_KEY = "sanatan_seva_orders_v1";

const DEFAULT_ADMIN: UserAccount = {
  id: "admin-sdst-01",
  role: "admin",
  name: "Trust Acharya & Store Admin",
  email: "admin@sanatantrust.org",
  phone: "+91 98765 43210",
  joinedDate: "January 2024",
};

const DEFAULT_CUSTOMER: UserAccount = {
  id: "cust-devotee-108",
  role: "customer",
  name: "Rajesh Sharma",
  email: "rajesh.sharma@example.com",
  phone: "+91 98123 45678",
  pan: "ABCDE1234F",
  gotra: "Kashyapa",
  address: {
    street: "Flat 402, Om Shanti Enclave, Near Sankat Mochan Temple",
    city: "Varanasi",
    state: "Uttar Pradesh",
    pincode: "221005",
  },
  joinedDate: "March 2024",
};

const INITIAL_DEMO_ORDERS: OrderDetails[] = [
  {
    orderId: "SSS-892140-108",
    items: [
      {
        product: {
          id: "1",
          name: "Pure Brass Traditional Akhand Diya",
          slug: "brass-diya",
          description: "Handcrafted pure brass Akhand Diya with borosilicate glass protector for continuous sacred flame.",
          price: 499,
          originalPrice: 799,
          image: "/products/brass-diya.jpg",
          category: "Puja & Devotional",
          stock: 24,
          featured: true,
        },
        quantity: 2,
      },
      {
        product: {
          id: "5",
          name: "Original 5 Mukhi Nepal Rudraksha Mala (108+1 Beads)",
          slug: "nepal-rudraksha-mala",
          description: "Lab-certified 5 Mukhi authentic Nepali Rudraksha mala strung in auspicious red thread.",
          price: 1250,
          originalPrice: 1999,
          image: "/products/rudraksha-mala.jpg",
          category: "Rudraksha & Malas",
          stock: 35,
          featured: true,
        },
        quantity: 1,
      },
    ],
    customer: {
      fullName: "Rajesh Sharma",
      email: "rajesh.sharma@example.com",
      phone: "+91 98123 45678",
      address: "Flat 402, Om Shanti Enclave, Near Sankat Mochan Temple",
      city: "Varanasi",
      state: "Uttar Pradesh",
      pincode: "221005",
    },
    pricing: {
      subtotal: 2248,
      discount: 225,
      shipping: 0,
      total: 2023,
    },
    paymentMethod: "upi",
    createdAt: "14 Aug 2026, 11:30 AM",
    status: "Processing",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSupabaseLive = isSupabaseConfigured();
  const [supabaseStatus, setSupabaseStatus] = useState<"live_connected" | "demo_fallback" | "connecting">(
    isSupabaseLive ? "live_connected" : "demo_fallback"
  );
  const [lastSecurityCheck, setLastSecurityCheck] = useState<string>(() => new Date().toLocaleTimeString());

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    // In production, the Supabase session is the only source of truth.
    // Never restore an admin/customer identity from localStorage.
    if (isSupabaseConfigured()) return null;

    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  // Supabase Auth State Synchronization
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setSupabaseStatus("demo_fallback");
      return;
    }

    setSupabaseStatus("live_connected");

    // Check existing session
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session?.user) {
        const metadata = session.user.user_metadata || {};
        const { data: profile } = await client
          .from("profiles")
          .select("role, full_name, phone")
          .eq("id", session.user.id)
          .maybeSingle();

        const role: UserRole = profile?.role === "admin" ? "admin" : "customer";

        setCurrentUser({
          id: session.user.id,
          email: session.user.email || "",
          name: profile?.full_name || metadata.name || metadata.full_name || session.user.email?.split("@")[0] || "Devotee",
          role,
          phone: profile?.phone || metadata.phone || "",
          pan: metadata.pan || "",
          gotra: metadata.gotra || "",
          address: metadata.address || undefined,
          joinedDate: new Date(session.user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        });
      }
    });

    // Listen to Auth State Changes
    const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
      setLastSecurityCheck(new Date().toLocaleTimeString());
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        const { data: profile } = await client
          .from("profiles")
          .select("role, full_name, phone")
          .eq("id", session.user.id)
          .maybeSingle();

        const role: UserRole = profile?.role === "admin" ? "admin" : "customer";

        setCurrentUser({
          id: session.user.id,
          email: session.user.email || "",
          name: profile?.full_name || metadata.name || metadata.full_name || session.user.email?.split("@")[0] || "Devotee",
          role,
          phone: profile?.phone || metadata.phone || "",
          pan: metadata.pan || "",
          gotra: metadata.gotra || "",
          address: metadata.address || undefined,
          joinedDate: new Date(session.user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
        });
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isSupabaseLive]);

  useEffect(() => {
    try {
      if (isSupabaseLive) {
        // Supabase Auth owns the session; don't persist identities ourselves.
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, isSupabaseLive]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const loginAsAdmin = async (email?: string, password?: string): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: false,
        message: "Store authentication is not configured. Please contact the administrator.",
      };
    }

    if (!email?.trim() || !password) {
      return {
        success: false,
        message: "Enter your admin email and password.",
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return {
          success: false,
          message: error?.message || "Invalid admin credentials.",
        };
      }

      // Never trust frontend metadata/email to grant admin access.
      // The role must come from the protected profiles table/RLS.
      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role, full_name, phone")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || profile?.role !== "admin") {
        await client.auth.signOut();
        setCurrentUser(null);
        return {
          success: false,
          message: "This account is not authorized for Store Admin access.",
        };
      }

      const metadata = data.user.user_metadata || {};
      const user: UserAccount = {
        id: data.user.id,
        email: data.user.email || email.trim(),
        name: profile.full_name || metadata.name || "Store Administrator",
        role: "admin",
        phone: profile.phone || metadata.phone || "",
        joinedDate: new Date(data.user.created_at).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
      };

      setCurrentUser(user);
      setLastSecurityCheck(new Date().toLocaleTimeString());

      return {
        success: true,
        message: "Admin session verified successfully.",
      };
    } catch (err) {
      console.error("Admin authentication error:", err);
      return {
        success: false,
        message: "Unable to authenticate the admin account.",
      };
    }
  };

  const loginAsCustomer = async (
    email: string,
    _name?: string,
    _phone?: string,
    password?: string
  ): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: false,
        message: "Store authentication is not configured. Please contact the administrator.",
      };
    }

    if (!email.trim() || !password) {
      return {
        success: false,
        message: "Enter your email and password.",
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return {
          success: false,
          message: error?.message || "Invalid email or password.",
        };
      }

      // Read role from the protected database profile.
      // Never infer a role from the email address or client metadata.
      const { data: profile, error: profileError } = await client
        .from("profiles")
        .select("role, full_name, phone")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) {
        await client.auth.signOut();
        setCurrentUser(null);
        return {
          success: false,
          message: "Unable to verify your account. Please try again.",
        };
      }

      // Keep the admin and customer entry points separate.
      if (profile?.role === "admin") {
        await client.auth.signOut();
        setCurrentUser(null);
        return {
          success: false,
          message: "This is an administrator account. Please use Admin Sign In.",
        };
      }

      const metadata = data.user.user_metadata || {};
      const user: UserAccount = {
        id: data.user.id,
        role: "customer",
        email: data.user.email || email.trim(),
        name: profile?.full_name || metadata.name || metadata.full_name || email.split("@")[0],
        phone: profile?.phone || metadata.phone || "",
        pan: metadata.pan || "",
        gotra: metadata.gotra || "",
        address: metadata.address || undefined,
        joinedDate: new Date(data.user.created_at).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
      };

      setCurrentUser(user);
      setLastSecurityCheck(new Date().toLocaleTimeString());

      return {
        success: true,
        message: `Namaste ${user.name}! You are securely signed in.`,
      };
    } catch (err) {
      console.error("Customer authentication error:", err);
      return {
        success: false,
        message: "Unable to sign in. Please try again.",
      };
    }
  };

  const registerCustomer = async (details: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: any;
    pan?: string;
    gotra?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();

    if (!client) {
      return {
        success: false,
        message: "Store authentication is not configured. Please contact the administrator.",
      };
    }

    if (!details.password || details.password.length < 8) {
      return {
        success: false,
        message: "Password must contain at least 8 characters.",
      };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: details.email.trim(),
        password: details.password,
        options: {
          data: {
            name: details.name.trim(),
            role: "customer",
            phone: details.phone || "",
            pan: details.pan || "",
            gotra: details.gotra || "",
            address: details.address || null,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user) {
        return {
          success: false,
          message: "Account could not be created. Please try again.",
        };
      }

      // If Supabase email confirmation is enabled, there will be no session yet.
      // Do not create a fake logged-in user in the browser.
      if (!data.session) {
        return {
          success: true,
          message: "Account created. Please verify your email before signing in.",
        };
      }

      const newUser: UserAccount = {
        id: data.user.id,
        role: "customer",
        name: details.name.trim(),
        email: data.user.email || details.email.trim(),
        phone: details.phone || "",
        pan: details.pan || "",
        gotra: details.gotra || "",
        address: details.address,
        joinedDate: new Date().toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        }),
      };

      setCurrentUser(newUser);
      return {
        success: true,
        message: "Registration successful! Welcome to Sanatan Seva Store.",
      };
    } catch (err) {
      console.error("Supabase register error:", err);
      return {
        success: false,
        message: "Unable to create the account. Please try again.",
      };
    }
  };

  const logout = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    setCurrentUser(null);
    setLastSecurityCheck(new Date().toLocaleTimeString());
  };

  const updateProfile = async (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.updateUser({
          data: {
            name: updates.name || currentUser.name,
            phone: updates.phone || currentUser.phone,
            pan: updates.pan || currentUser.pan,
            gotra: updates.gotra || currentUser.gotra,
            address: updates.address || currentUser.address,
          },
        });
      } catch (e) {
        console.warn(e);
      }
    }
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    setLastSecurityCheck(new Date().toLocaleTimeString());
  };

  const addCustomerOrder = (order: OrderDetails) => {
    setOrders((prev) => [order, ...prev]);
  };

  const switchRoleQuick = (_role: UserRole) => {
    // Intentionally disabled in production.
    // Admin privileges can only come from the Supabase profiles.role value.
    setLastSecurityCheck(new Date().toLocaleTimeString());
  };

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === "admin";
  const isCustomer = currentUser?.role === "customer";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isCustomer,
        isSupabaseLive,
        supabaseStatus,
        loginAsAdmin,
        loginAsCustomer,
        registerCustomer,
        logout,
        updateProfile,
        orders,
        addCustomerOrder,
        switchRoleQuick,
        lastSecurityCheck,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
