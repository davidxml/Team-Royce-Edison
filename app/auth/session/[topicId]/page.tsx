"use client";

import { motion, AnimatePresence } from "framer-motion";
import { use, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { Nunito } from "next/font/google";
import {
  Phone,
  X,
  PhoneOff,
  Loader2,
  AlertCircle,
  Clock,
  Mic,
  Volume2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useFetcher } from "@/hook/useFetcher";
import { TopicResponse } from "@/types/topics";
import { vapi } from "@/lib/vapi.sdk";
import { useUser } from "@clerk/nextjs";
import { updateProgress } from "@/lib/updateProgress";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Session({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const { user } = useUser();
  const router = useRouter(); // 2. Initialize router

  // Call state
  const [isLoading, setIsLoading] = useState(false);

  const fetchTopic: () => Promise<TopicResponse> = useCallback(async () => {
    const { data, error } = await supabase
      .from("topics")
      .select(
        `
          id,
          title,
          description,
          order_index,
          class:class_id ( name ),
          subject:subject_id ( name )
        `
      )
      .eq("id", topicId);

    if (error) {
      throw error;
    }

    return data as unknown as TopicResponse;
  }, [topicId]);

  const { data, isPending, error } = useFetcher<TopicResponse>(fetchTopic, {
    enabled: !!topicId,
  });

  // VAPI voice call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  // Reset call duration when call ends
  useEffect(() => {
    if (!isCallActive) {
      setCallDuration(0);
    }
  }, [isCallActive]);

  // VAPI event handlers
  useEffect(() => {
    vapi.on("speech-start", () => {
      setIsRecording(true);
    });

    vapi.on("speech-end", () => {
      setIsRecording(false);
    });

    vapi.on("call-start", () => {
      setIsCallActive(true);
      setCallStatus("Call connected");
      setIsLoading(false);
    });

    vapi.on("call-end", () => {
      setIsCallActive(false);
      setIsAISpeaking(false);
      setCallStatus("Call ended");
      updateProgress(topicId, user?.id!).catch((error) => {
        console.error("Error updating progress after call end:", error);
      });
      setTimeout(() => setCallStatus(""), 3000);
    });

    vapi.on("message", (message: any) => {
      try {
        if (message.type === "conversation" || message.type === "response") {
          setIsAISpeaking(true);
          setTimeout(() => setIsAISpeaking(false), 3000);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        setCallStatus("Error processing AI response");
        setTimeout(() => setCallStatus(""), 3000);
      }
    });

    vapi.on("error", (error: any) => {
      console.error("VAPI error:", error);
      setCallStatus(`Call error: ${error.message || "Unknown error"}`);
      setIsLoading(false);
      setTimeout(() => setCallStatus(""), 5000);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, [topicId, user?.id]);

  // Cleanup effect to end call when component unmounts
  useEffect(() => {
    return () => {
      if (isCallActive) {
        try {
          vapi.stop().catch((error) => {
            console.error("Failed to end call on unmount:", error);
          });
        } catch (error) {
          console.error("Error during call cleanup on unmount:", error);
        }
      }
    };
  }, [isCallActive]);

  // Handle browser/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isCallActive) {
        try {
          vapi.stop().catch((error) => {
            console.error("Failed to end call on page unload:", error);
          });
        } catch (error) {
          console.error("Error during call cleanup on page unload:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isCallActive]);

  // Handle voice call
  const handleVoiceCall = async () => {
    if (isCallActive) {
      try {
        await vapi.stop();
        setCallStatus("Ending call...");
      } catch (error) {
        console.error("Failed to end voice call:", error);
        setCallStatus("Failed to end call");
        setTimeout(() => setCallStatus(""), 3000);
      }
    } else {
      try {
        const topic = data?.[0];
        if (!topic) {
          setCallStatus("Topic data not available");
          setTimeout(() => setCallStatus(""), 3000);
          return;
        }

        if (!user?.firstName) {
          setCallStatus("User information not available");
          setTimeout(() => setCallStatus(""), 3000);
          return;
        }

        setIsLoading(true);
        setCallStatus("Starting call...");
        const assistantOverrides = {
          variableValues: {
            name: user.firstName,
            topic: topic.title,
            subject: topic.subject?.name,
            class: topic.class?.name,
          },
        };

        await vapi.start(
          process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!,
          assistantOverrides
        );
      } catch (error) {
        setIsLoading(false);
        console.error("Failed to start voice call:", error);
        setCallStatus(
          `Failed to start call: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setTimeout(() => setCallStatus(""), 5000);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // --- UI RENDER START ---

  // Error State
  if (error) {
    return (
      <div
        className={`min-h-screen bg-white flex items-center justify-center p-4 ${nunito.className}`}
      >
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-red-100 rounded-3xl mx-auto flex items-center justify-center mb-4 border-b-4 border-red-200">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-700">
            Something went wrong
          </h2>
          <p className="text-gray-500 font-bold">{error.message}</p>
          <div className="flex gap-4">
            {/* 3. UPDATED EXIT BUTTON (Uses router.back) */}
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 rounded-2xl font-black uppercase tracking-widest text-sm bg-gray-200 text-gray-500 border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all"
            >
              Exit
            </button>

            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 rounded-2xl font-black uppercase tracking-widest text-sm bg-[#4854F6] text-white border-b-4 border-[#353EB5] active:border-b-0 active:translate-y-1 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white flex flex-col ${nunito.className}`}>
      <style jsx global>{`
        .btn-press {
          transition: all 0.1s;
          border-bottom-width: 4px;
        }
        .btn-press:active {
          transform: translateY(2px);
          border-bottom-width: 0px;
          margin-bottom: 4px;
        }
      `}</style>

      {/* --- HEADER --- */}
      <header className="px-6 py-6 flex items-center justify-between border-b-2 border-gray-100 bg-white z-10 sticky top-0">
        <div className="flex items-center gap-4">
          {/* 4. UPDATED HEADER EXIT BUTTON (Uses router.back) */}
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={28} strokeWidth={2.5} />
          </button>

          <div className="h-2 w-24 md:w-32 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCallActive ? "bg-green-500 w-full" : "bg-gray-300 w-1/3"
              }`}
            ></div>
          </div>
        </div>

        {isCallActive && (
          <div className="flex items-center gap-2 bg-red-100 text-red-500 px-3 py-1 rounded-lg font-extrabold text-xs uppercase tracking-wide animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Live
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />

        <AnimatePresence mode="wait">
          {/* STATE 1: LOADING */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#4854F6] rounded-full opacity-20 animate-ping" />
                <div className="w-32 h-32 bg-white border-4 border-[#4854F6] rounded-full flex items-center justify-center shadow-lg relative z-10">
                  <Loader2 className="w-12 h-12 text-[#4854F6] animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-700 mb-2">
                Connecting...
              </h2>
              <p className="text-gray-400 font-bold">
                Establishing secure voice line
              </p>
            </motion.div>
          )}

          {/* STATE 2: ACTIVE CALL */}
          {!isLoading && isCallActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-lg"
            >
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 mb-12 shadow-sm text-center w-full">
                <h3 className="text-gray-400 font-extrabold text-xs uppercase tracking-widest mb-1">
                  Current Topic
                </h3>
                <p className="text-xl font-black text-gray-700">
                  {data?.[0]?.title || "Session"}
                </p>
              </div>

              <div className="relative mb-12">
                {isAISpeaking && (
                  <>
                    <div className="absolute inset-0 border-4 border-[#4854F6] rounded-full opacity-20 animate-[ping_2s_infinite]" />
                    <div className="absolute inset-0 border-4 border-[#4854F6] rounded-full opacity-10 animate-[ping_3s_infinite_0.5s]" />
                  </>
                )}

                <div
                  className={`
                    w-48 h-48 rounded-full flex items-center justify-center shadow-xl transition-all duration-500
                    ${
                      isAISpeaking
                        ? "bg-[#4854F6] scale-110"
                        : "bg-white border-4 border-gray-100"
                    }
                 `}
                >
                  {isAISpeaking ? (
                    <Volume2 className="w-20 h-20 text-white animate-pulse" />
                  ) : (
                    <Sparkles className="w-20 h-20 text-[#4854F6]" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-8 text-gray-400 font-bold font-mono text-lg bg-gray-50 px-4 py-2 rounded-xl">
                <Clock size={20} />
                {formatDuration(callDuration)}
              </div>
            </motion.div>
          )}

          {/* STATE 3: IDLE */}
          {!isLoading && !isCallActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center max-w-md"
            >
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl mx-auto mb-8 flex items-center justify-center border-b-4 border-blue-200 rotate-3 transform hover:rotate-6 transition-transform">
                <Mic className="w-16 h-16 text-[#4854F6]" />
              </div>

              <h1 className="text-3xl font-black text-gray-800 mb-4">
                Ready to practice?
              </h1>

              <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
                You are about to start a voice session on <br />
                <span className="text-[#4854F6] font-bold">
                  {data?.[0]?.title || "this topic"}
                </span>
                . Speak naturally!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {callStatus && !isCallActive && !isLoading && (
          <div className="absolute bottom-32 bg-gray-800 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl">
            {callStatus}
          </div>
        )}
      </main>

      {/* --- FOOTER CONTROLS --- */}
      <footer className="p-6 border-t-2 border-gray-100 bg-white">
        <div className="max-w-md mx-auto">
          {isCallActive ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`
                   w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 btn-press
                   ${
                     isMuted
                       ? "bg-gray-800 text-white border-gray-900"
                       : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                   }
                 `}
              >
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <button
                onClick={handleVoiceCall}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-[#FF4B4B] text-white border-[#EA2B2B] shadow-[0_4px_0_#EA2B2B] btn-press hover:bg-[#ff5c5c]"
              >
                End Session
              </button>
            </div>
          ) : (
            <button
              onClick={handleVoiceCall}
              disabled={isLoading || isPending}
              className={`
                w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg btn-press flex items-center justify-center gap-3
                ${
                  isLoading || isPending
                    ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                    : "bg-[#4854F6] text-white border-[#353EB5] shadow-[0_4px_0_#353EB5] hover:bg-[#5863F8]"
                }
              `}
            >
              {isLoading ? (
                <>Connecting...</>
              ) : (
                <>
                  <Phone size={20} fill="currentColor" /> Start Voice Session
                </>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
