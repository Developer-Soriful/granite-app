import { supabase } from "@/config/supabase.config";

// services/plaid/index.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

// Helper to construct Supabase cookie
const getSupabaseCookie = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  try {
    // Extract project ref from URL (e.g., https://xyz.supabase.co -> xyz)
    const projectRef = SUPABASE_URL?.split('.')[0].split('//')[1];
    if (!projectRef) return null;

    const cookieName = `sb-${projectRef}-auth-token.0`;
    const sessionStr = JSON.stringify(session);
    // Use global btoa if available, otherwise simple polyfill or empty
    const base64Session = typeof btoa !== 'undefined'
      ? btoa(sessionStr)
      : Buffer.from(sessionStr).toString('base64');

    return `${cookieName}=base64-${base64Session}`;
  } catch (e) {
    console.error("Error constructing cookie:", e);
    return null;
  }
};

export const PlaidService = {
  // 1. Link Token
  getLinkToken: async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const cookie = await getSupabaseCookie();
    console.log("Requesting link token from:", `${API_URL}/api/plaid/link-token`);

    const res = await fetch(`${API_URL}/api/plaid/link-token`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...(cookie ? { 'Cookie': cookie } : {})
      },
      credentials: "include",
    });

    console.log("Link token response status:", res.status);
    console.log("Link token content-type:", res.headers.get("content-type"));

    // Check if response is HTML instead of JSON
    const contentType = res.headers.get("content-type");

    if (!res.ok) {
      const text = await res.text();
      console.error("Link token error response:", text.substring(0, 200));
      throw new Error(`Backend returned ${res.status}. Check if /api/plaid/link-token endpoint is working.`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Got HTML instead of JSON:", text.substring(0, 200));
      throw new Error(`Backend is returning HTML instead of JSON. Content-Type: ${contentType}`);
    }

    const data = await res.json();
    console.log("Link token received successfully");
    return data.link_token;
  },

  // 2. Update Link Token
  getUpdateLinkToken: async (itemId: string): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const cookie = await getSupabaseCookie();

    const res = await fetch(`${API_URL}/api/plaid/update-link-token?item_id=${itemId}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...(cookie ? { 'Cookie': cookie } : {})
      },
      credentials: "include",
    });

    console.log("Update link token response:", res.status);

    // Check if response is actually JSON
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}. Please check if /api/plaid/update-link-token endpoint exists.`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Backend endpoint exists but returned HTML instead of JSON. Check backend route handler.");
    }

    const data = await res.json();
    return data.link_token;
  },

  // 3. Exchange Public Token
  exchangeToken: async (public_token: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const cookie = await getSupabaseCookie();

    const res = await fetch(`${API_URL}/api/plaid/sync`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...(cookie ? { 'Cookie': cookie } : {})
      },
      credentials: "include",
      body: JSON.stringify({ public_token }),
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Backend API is not available");
      }
      const err = await res.json();
      throw new Error(err.error || "Sync failed");
    }
    return res.json();
  },

  // 4. Remove Item
  removeItem: async (itemId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const cookie = await getSupabaseCookie();

    await fetch(`${API_URL}/api/plaid/remove-item`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        ...(cookie ? { 'Cookie': cookie } : {})
      },
      credentials: "include",
      body: JSON.stringify({ item_id: itemId }),
    });
  },
};