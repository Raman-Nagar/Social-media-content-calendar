"use client";

import React from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/ui/toaster";
import { TooltipProvider } from "@/ui/tooltip";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Social Media Content Calendar</title>
        <meta
          name="description"
          content="Manage and schedule your social media content with intelligent post distribution"
        />
      </head>
      <body className={inter.className}>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
