"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import StockSearchBar from "./StockSearchBar";

export function Header() {
  const { user, setUser } = useStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = async () => {
    // Sign out from NextAuth session
    await signOut({ redirect: false });

    // Clear local storage and state
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Fundingpips
        </Link>

        <div className="flex items-center space-x-4">
          <StockSearchBar />
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuthModal(true)}>Login</Button>
          )}
          <ThemeToggle />
        </div>
      </div>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}
