"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VELTRA_PURPLE = "#A259FF";
const WEBHOOK_URL = "https://n8n.veltraai.net/webhook/aspi-homes-website-form";

export const LeadForm = ({ onTriggerDemo }: { onTriggerDemo: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      source: "ASPI Homes Inbound Demo",
      timestamp: new Date().toISOString(),
    };

    // 1. Log to console
    console.log("[LEAD CAPTURED]", data);

    try {
      // 2. Push to Webhook
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // 3. Navigate/Trigger Call Page
      onTriggerDemo();
    } catch (error) {
      console.error("Webhook Error:", error);
      // Fallback: Proceed to demo anyway
      onTriggerDemo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-2xl mx-auto backdrop-blur-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Maintenance Request
        </h3>
        <p className="text-gray-400 text-sm">
          Please provide your contact details below. Once submitted, you will be
          connected to Tom, our AI assistant, to discuss your requirements.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Row 1: Name and Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Full Name
            </label>
            <Input
              name="name"
              placeholder="John Doe"
              required
              className="bg-gray-800/50 border-gray-700 text-white focus:border-[#A259FF]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Company Name
            </label>
            <Input
              name="company"
              placeholder="Aspi Homes"
              required
              className="bg-gray-800/50 border-gray-700 text-white focus:border-[#A259FF]"
            />
          </div>
        </div>

        {/* Row 2: Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Email Address
            </label>
            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="bg-gray-800/50 border-gray-700 text-white focus:border-[#A259FF]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Phone Number
            </label>
            <Input
              name="phone"
              type="tel"
              placeholder="07123 456789"
              required
              className="bg-gray-800/50 border-gray-700 text-white focus:border-[#A259FF]"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 text-lg font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: VELTRA_PURPLE }}
        >
          {loading ? "Registering..." : "Test Voice Agent"}
        </Button>
      </form>
    </div>
  );
};
