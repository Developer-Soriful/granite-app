import { supabase } from "@/config/supabase.config";

// services/plaid/index.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const PlaidService = {
  // 1. Link Token
  getLinkToken: async (): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const res = await fetch(`${API_URL}/api/plaid/link-token`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });
    console.log("Link token response:", res);
    if (!res.ok) throw new Error("Failed to get link token");
    const data = await res.json();
    return data.link_token;
  },

  // 2. Update Link Token
  getUpdateLinkToken: async (itemId: string): Promise<string> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const res = await fetch(`${API_URL}/api/plaid/update-link-token?item_id=${itemId}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });
    console.log("Update link token response:", res);
    if (!res.ok) throw new Error("Failed to get update token");
    const data = await res.json();
    return data.link_token;
  },

  // 3. Exchange Public Token
  exchangeToken: async (public_token: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    const res = await fetch(`${API_URL}/api/plaid/sync`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ public_token }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Sync failed");
    }
    return res.json();
  },

  // 4. Remove Item
  removeItem: async (itemId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("No session found");

    await fetch(`${API_URL}/api/plaid/remove-item`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify({ item_id: itemId }),
    });
  },
};