"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useCallback, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

const VELTRA_PURPLE = "#A259FF";

// Define the call status types
type CallStatus = "Ready" | "Connecting..." | "Active" | "Error";

const API_ENDPOINT = "/api/create-web-call";

export const DemoCard = () => {
  // 3. Setup State and Refs
  const [callStatus, setCallStatus] = useState<CallStatus>("Ready");
  const [isCalling, setIsCalling] = useState(false);
  const clientRef = useRef<RetellWebClient | null>(null);

  // Helper to determine status color
  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case "Active":
        return "#4CAF50";
      case "Error":
        return "#F44336";
      default:
        return VELTRA_PURPLE;
    }
  };

  const startCall = useCallback(async () => {
    // END CALL Logic
    if (isCalling) {
      console.log("🛑 [END CALL] User initiated call termination");

      try {
        if (clientRef.current) {
          console.log("📞 [END CALL] Stopping call via SDK...");
          clientRef.current.stopCall();
          console.log("✅ [END CALL] Call stopped successfully");
        } else {
          console.warn("⚠️ [END CALL] No active client reference found");
        }
      } catch (error) {
        console.error("❌ [END CALL] Error stopping call:", error);
      } finally {
        setIsCalling(false);
        setCallStatus("Ready");
        console.log("🏁 [END CALL] Call state reset to Ready");
      }
      return;
    }

    //  START CALL Logic
    console.log("🚀 [START CALL] Initiating call sequence...");

    // Ensure the client is ready
    if (typeof RetellWebClient === "undefined") {
      console.error(
        "❌ [SDK CHECK] RetellWebClient is unavailable. SDK installation may have failed.",
      );
      setCallStatus("Error");
      return;
    }
    console.log("✅ [SDK CHECK] RetellWebClient is available");

    setIsCalling(true);
    setCallStatus("Connecting...");
    console.log("🔄 [STATUS] Changed to 'Connecting...'");

    try {
      // 1. Fetch access token from my Supabase Edge Function
      console.log("🌐 [TOKEN REQUEST] Fetching access token from backend...");
      console.log(`📍 [TOKEN REQUEST] Endpoint: ${API_ENDPOINT}`);

      const tokenResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log(
        `📥 [TOKEN RESPONSE] Status: ${tokenResponse.status} ${tokenResponse.statusText}`,
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.access_token) {
        const errorMsg =
          tokenData.error || "Failed to get access token from backend.";
        console.error("❌ [TOKEN ERROR]", errorMsg);
        throw new Error(errorMsg);
      }

      console.log("✅ [TOKEN SUCCESS] Access token received");
      console.log(
        "🔑 [TOKEN] Token length:",
        tokenData.access_token.length,
        "characters",
      );

      // 2. Initialize Retell Web Client and set Ref
      console.log("🔧 [CLIENT INIT] Creating new RetellWebClient instance...");
      const client = new RetellWebClient();
      clientRef.current = client;
      console.log(
        "✅ [CLIENT INIT] RetellWebClient initialized and stored in ref",
      );

      // 3. Set up event listeners for status updates (CRITICAL for a reliable UI)
      console.log("👂 [EVENT SETUP] Registering event listeners...");

      client.on("connection:established", () => {
        setCallStatus("Active");
        console.log("🟢 [CONNECTION] Connection established successfully!");
        console.log("🎙️ [CALL STATUS] AI agent should now be speaking");
      });

      client.on("call:ended", () => {
        setIsCalling(false);
        setCallStatus("Ready");
        console.log("📞 [CALL ENDED] Call has ended");
        console.log("🏁 [STATUS] Reset to Ready state");
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client.on("error", (error: any) => {
        console.error("❌ [CLIENT ERROR] Retell client encountered an error:");
        console.error(error);
        setIsCalling(false);
        setCallStatus("Error");
        console.log("🔴 [STATUS] Changed to Error state");
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      client.on("update", (update: any) => {
        // You can monitor the transcript here
        // console.log("📝 [TRANSCRIPT] Update:", update.transcript);
      });

      console.log("✅ [EVENT SETUP] All event listeners registered");

      // 4. Start the call using the access token
      console.log("📞 [CALL START] Initiating call with access token...");
      client.startCall({ accessToken: tokenData.access_token });
      console.log("✅ [CALL START] startCall() method executed");
      console.log("⏳ [WAITING] Waiting for connection establishment...");
    } catch (error) {
      console.error("❌ [FATAL ERROR] Error during call initiation:");
      console.error(error);

      if (error instanceof Error) {
        console.error("📝 [ERROR DETAILS] Message:", error.message);
        console.error("📝 [ERROR DETAILS] Stack:", error.stack);
      }

      setIsCalling(false);
      setCallStatus("Error");
      console.log("🔴 [STATUS] Changed to Error state due to exception");
    }
  }, [isCalling]);

  return (
    <div className="w-full max-w-xl bg-gray-900/40 border border-gray-800 rounded-xl p-8 shadow-2xl mx-auto">
      {/* Demo Scenario Box */}
      <div className="bg-gray-800/80 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold flex items-center mb-2 text-white">
          Demo Scenario (Pest Control)
        </h3>
        <p className="text-sm text-gray-400">
          This is Tom, the voice receptionist for a UK pest control company. Try
          asking for a quote for Rats, Wasps, or Fleas, and see how he handles
          the booking! 😉
        </p>
      </div>

      {/* Call Status (Dynamic) */}
      <div className="flex justify-center items-center mb-6">
        <span className="text-sm text-gray-400 mr-2">Call Status:</span>
        <span
          className="text-sm font-semibold"
          style={{ color: getStatusColor(callStatus) }}
        >
          {callStatus}
        </span>
      </div>

      {/* Start/End Call Button (Interactive) */}
      <Button
        onClick={startCall}
        disabled={false}
        className="w-full h-12 text-lg text-white shadow-lg border border-transparent hover:scale-[1.01] transition-transform cursor-pointer"
        style={{
          backgroundColor: isCalling ? "#F44336" : VELTRA_PURPLE, // Red when active, Purple otherwise
          boxShadow: `0 8px 15px -5px ${
            isCalling ? "#F44336" : VELTRA_PURPLE
          }50`,
        }}
      >
        {/* Microphone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 mr-2"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line
            x1="12"
            x2="12"
            y1="19"
            y2="23"
          ></line>
          <line
            x1="8"
            x2="16"
            y1="23"
            y2="23"
          ></line>
        </svg>
        {isCalling ? "End Call" : "Start Call"}
      </Button>
    </div>
  );
};
