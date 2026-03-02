"use client";

import { useState } from "react";
import { LeadForm } from "@/components/landing/LeadForm";
import { DemoCard } from "@/components/landing/DemoCard";
import { FeatureStrip } from "@/components/landing/FeatureStrip";
import { HeroSection } from "@/components/landing/HeroSection";
import { Header } from "@/components/landing/Header";

export default function PistonAILandingPage() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />

      <div className="flex flex-col items-center justify-center pt-8 pb-20">
        {!isFormSubmitted ? (
          <LeadForm onTriggerDemo={() => setIsFormSubmitted(true)} />
        ) : (
          <div className="animate-in fade-in zoom-in duration-500">
            <DemoCard />
          </div>
        )}
        <FeatureStrip />
      </div>
      <footer className="text-center text-xs text-gray-600 mt-20 max-w-4xl mx-auto py-4">
        Powered by Retell AI • Enterprise-grade voice technology
      </footer>
    </div>
  );
}
