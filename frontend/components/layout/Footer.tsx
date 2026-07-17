"use client";

import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#223046] bg-[#07111f] py-4 text-center text-xs text-[#94a3b8]">
      <p>© {new Date().getFullYear()} AI Inventory Intelligence Platform. All rights reserved.</p>
    </footer>
  );
}
