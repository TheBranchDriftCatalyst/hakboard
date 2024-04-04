"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Background from "@/components/Background";
import ResponsiveGridLayout from "@/components/ResponsiveGridLayout";
import { TopBar } from "@/components/TopBar/TopBar";
import { DialogProvider } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main>
      <QueryClientProvider client={new QueryClient()}>
        <DialogProvider>
          <ResponsiveGridLayout>
            {/* add these here so they get wrapped in the context */}
            <Toaster />
            <TopBar />
          </ResponsiveGridLayout>
        </DialogProvider>
        <Background />
      </QueryClientProvider>
    </main>
  );
}
