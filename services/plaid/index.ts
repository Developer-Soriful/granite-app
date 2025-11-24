import { getAuthToken } from "@/utils/auth";

// services/plaid/index.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const PlaidService = {
  // 1. Link Token (NO BEARER TOKEN NEEDED — Supabase cookie auto sent)
  getLinkToken: async (): Promise<string> => {
    const token = await getAuthToken()
    const res = await fetch(`${API_URL}/api/plaid/link-token`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to get link token");
    const data = await res.json();
    return data.link_token;
  },

  // 2. Update Link Token
  getUpdateLinkToken: async (itemId: string): Promise<string> => {
    const res = await fetch(`${API_URL}/api/plaid/update-link-token?item_id=${itemId}`, {
      credentials: "include",
    });
    console.log("Update link token response:", res);
    if (!res.ok) throw new Error("Failed to get update token");
    const data = await res.json();
    return data.link_token;
  },

  // 3. Exchange Public Token
  exchangeToken: async (public_token: string) => {
    const res = await fetch(`${API_URL}/api/plaid/sync`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
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
    await fetch(`${API_URL}/api/plaid/remove-item`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId }),
    });
  },
};