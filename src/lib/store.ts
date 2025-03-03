import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Stock, User, Trade } from "./types";
import { initialStocks } from "./mockData";
import { supabase } from "./supabase";

interface WatchlistItem {
  symbol: string;
  exchange: string;
}

interface StoreState {
  stocks: Stock[];
  user: User | null;
  trades: Trade[];
  isConnected: boolean;
  watchlist: WatchlistItem[];
  updateStocks: (stocks: Stock[]) => void;
  setUser: (user: User | null) => void;
  addTrade: (trade: Trade) => void;
  setConnectionStatus: (status: boolean) => void;
  loadWatchlist: (userId: string) => Promise<void>;
  addToWatchlist: (
    userId: string,
    symbol: string,
    exchange: string
  ) => Promise<void>;
  removeFromWatchlist: (userId: string, symbol: string) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      stocks: initialStocks,
      user: null,
      trades: [],
      isConnected: true,
      watchlist: [],
      updateStocks: (stocks) => set({ stocks }),
      setUser: (user) => {
        set({ user });
        if (user) {
          // Load watchlist when user logs in
          get().loadWatchlist(user.id);
        } else {
          // Clear watchlist when user logs out
          set({ watchlist: [] });
        }
      },
      addTrade: (trade) =>
        set((state) => ({ trades: [...state.trades, trade] })),
      setConnectionStatus: (status) => set({ isConnected: status }),
      loadWatchlist: async (userId: string) => {
        const { data, error } = await supabase
          .from("watchlist_stocks")
          .select("symbol, exchange")
          .eq("user_id", userId);

        if (error) {
          console.error("Error loading watchlist:", error);
          return;
        }

        set({ watchlist: data });
      },
      addToWatchlist: async (
        userId: string,
        symbol: string,
        exchange: string
      ) => {
        const { error } = await supabase
          .from("watchlist_stocks")
          .insert([{ user_id: userId, symbol, exchange }]);

        if (error) {
          if (error.code === "23505") {
            // unique violation
            console.log("Stock already in watchlist");
            return;
          }
          throw error;
        }

        const { watchlist } = get();
        set({ watchlist: [...watchlist, { symbol, exchange }] });
      },
      removeFromWatchlist: async (userId: string, symbol: string) => {
        const { error } = await supabase
          .from("watchlist_stocks")
          .delete()
          .eq("user_id", userId)
          .eq("symbol", symbol);

        if (error) {
          throw error;
        }

        const { watchlist } = get();
        set({ watchlist: watchlist.filter((item) => item.symbol !== symbol) });
      },
    }),
    {
      name: "fundingpips",
      partialize: (state) => ({
        // only persist these fields
        user: state.user,
        trades: state.trades,
      }),
    }
  )
);
