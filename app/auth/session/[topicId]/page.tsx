"use client";

import { motion } from "framer-motion";
import { use, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { Phone, X, PhoneOff, Loader2, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useFetcher } from "@/hook/useFetcher";
import { TopicResponse } from "@/types/topics";
import { vapi } from "@/lib/vapi.sdk";
import { useUser } from "@clerk/nextjs";
import { updateProgress } from "@/lib/updateProgress";

export default function Session({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = use(params);
  const { user } = useUser();

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
          class:class_id (
            name
          ),
          subject:subject_id (
            name
          )
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
          // Reset speaking state after message duration (approximate)
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
  }, []);

  // Cleanup effect to end call when component unmounts
  useEffect(() => {
    return () => {
      // End any active call when component unmounts
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

  // Handle browser/tab close to end active calls
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

        setCallStatus("Starting call...");
        const assistantOverrides = {
          variableValues: {
            name: user.firstName,
            topic: topic.title,
            subject: topic.subject?.name,
            class: topic.class?.name,
          },
        };

        // Create a call with topic context
        await vapi.start(
          process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!,
          assistantOverrides
        );
      } catch (error) {
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

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Session Error
          </h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-[#6c47ff] text-white font-bold rounded-xl hover:bg-[#5a3ae6] transition-colors"
            >
              Try Again
            </button>
            <Link href="/auth/dashboard">
              <button className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Handle mute/unmute
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // Note: VAPI mute functionality would need to be implemented based on their API
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Tutoring Session
              </h1>
              {isPending ? (
                <div className="mt-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mt-1"></div>
                </div>
              ) : data && data[0] ? (
                <p className="text-gray-600 mt-1">
                  {data[0].subject?.name} - {data[0].title}
                  {data[0].class?.name && ` (${data[0].class.name})`}
                </p>
              ) : (
                <p className="text-gray-600 mt-1">Topic not found</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Voice Call Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVoiceCall}
                disabled={isPending || !data}
                className={`p-3 rounded-lg transition-colors flex items-center gap-2 ${
                  isCallActive
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-lg"
                    : "bg-green-500 text-white hover:bg-green-600 shadow-lg"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCallActive ? (
                  <>
                    <PhoneOff className="w-5 h-5" />
                    <span className="hidden sm:inline">End Call</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    <span className="hidden sm:inline">Voice Call</span>
                  </>
                )}
              </motion.button>

              <Link href="/auth/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-md border border-gray-200"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Call Status */}
        {callStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-xl text-center text-sm font-medium shadow-lg border ${
              callStatus.includes("error") || callStatus.includes("Failed")
                ? "bg-red-50 text-red-700 border-red-200"
                : callStatus.includes("Starting") ||
                  callStatus.includes("Ending")
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isCallActive && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">
                    {formatDuration(callDuration)}
                  </span>
                </div>
              )}
              <span>{callStatus}</span>
            </div>
          </motion.div>
        )}

        {/* Call Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl h-[calc(100vh-200px)] flex flex-col items-center justify-center border border-gray-200 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-linear-to-br from-[#6c47ff] to-[#8b5cf6]" />
            <div className="absolute inset-0 bg-[radial-linear(circle_at_50%_50%,rgba(108,71,255,0.1),transparent_50%)]" />
          </div>

          {/* Call Status Display */}
          <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
            {/* Call Status Indicator */}
            <motion.div
              animate={{
                scale: isCallActive ? [1, 1.1, 1] : 1,
                opacity: isCallActive ? [0.8, 1, 0.8] : 0.6,
              }}
              transition={{
                duration: 2,
                repeat: isCallActive ? Infinity : 0,
                ease: "easeInOut",
              }}
              className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl ${
                isCallActive
                  ? "bg-linear-to-br from-green-400 to-green-600 shadow-green-500/50"
                  : isLoading
                  ? "bg-linear-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/50"
                  : "bg-linear-to-br from-gray-300 to-gray-500 shadow-gray-500/50"
              }`}
            >
              {isCallActive ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Phone className="w-12 h-12 text-white" />
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-12 h-12 text-white" />
                </motion.div>
              ) : (
                <PhoneOff className="w-12 h-12 text-white/70" />
              )}
            </motion.div>

            {/* Status Text */}
            <motion.div
              key={
                callStatus ||
                (isCallActive
                  ? "connected"
                  : isLoading
                  ? "connecting"
                  : "ready")
              }
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <h3 className="text-2xl font-bold text-gray-900">
                {isCallActive
                  ? "Call Connected"
                  : isLoading
                  ? "Connecting..."
                  : "Ready to Call"}
              </h3>
              <p className="text-gray-600 max-w-md">
                {callStatus ||
                  (isCallActive
                    ? "Your AI tutor is ready to help. Speak naturally and ask questions about the topic."
                    : isLoading
                    ? "Initializing voice connection..."
                    : "Click the call button to start your AI tutoring session.")}
              </p>
            </motion.div>

            {/* AI Speaking Indicator */}
            {isAISpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full shadow-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 bg-blue-500 rounded-full"
                />
                <span className="text-sm font-medium text-blue-700">
                  AI is speaking...
                </span>
              </motion.div>
            )}

            {/* Call Controls */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceCall}
              disabled={isPending || !data}
              className={`px-8 py-4 rounded-full font-semibold text-white shadow-xl transition-all duration-300 ${
                isCallActive
                  ? "bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/50"
                  : "bg-linear-to-r from-[#6c47ff] to-[#8b5cf6] hover:from-[#5a3ae6] hover:to-[#7c3aed] shadow-[#6c47ff]/50"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              <div className="flex items-center gap-3">
                {isCallActive ? (
                  <>
                    <PhoneOff className="w-6 h-6" />
                    <span>End Call</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-6 h-6" />
                    <span>Start Call</span>
                  </>
                )}
              </div>
            </motion.button>

            {/* Topic Info */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-md"
              >
                <h4 className="font-semibold text-gray-900 mb-2">
                  Current Topic
                </h4>
                <p className="text-sm text-gray-700">{data[0].title}</p>
                {data[0].description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {data[0].description}
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#6c47ff] mx-auto" />
                <p className="text-sm text-gray-600">Setting up your call...</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
