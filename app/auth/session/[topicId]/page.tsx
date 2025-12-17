"use client";

import { motion } from "framer-motion";
import { use, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import { 
  Phone, 
  X, 
  PhoneOff, 
  Loader2, 
  AlertCircle, 
  Clock, 
  Flame, 
  Zap, 
  Bell, 
  BookOpen, 
  Trophy,
  MoreHorizontal
} from "lucide-react";
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

  // ------------------------------------------------------------------
  // LOGIC SECTION (UNCHANGED)
  // ------------------------------------------------------------------

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

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Error handling View (Adapted to new UI)
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl shadow-sm p-8 max-w-md mx-4 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Error</h2>
          <p className="text-gray-500 mb-6">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-[#FF4B4B] text-white font-bold rounded-xl hover:bg-red-600 transition-colors uppercase tracking-wide text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // UI RENDER SECTION (TAILORED TO IMAGE)
  // ------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-10">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Link href="/auth/dashboard" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Edison<span className="text-blue-600">.</span>
             </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1 text-orange-500 font-bold">
              <Flame className="w-5 h-5 fill-current" />
              <span>12</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-blue-600 font-bold">
              <Zap className="w-5 h-5 fill-current" />
              <span>450</span>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-indigo-100" />
                )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
               {isCallActive ? "Session in Progress" : `Ready for ${data?.[0]?.subject?.name || 'Class'}, ${user?.firstName || 'Student'}!`}
            </h1>
            <p className="text-gray-500">Let's keep that brain active.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - MAIN CALL INTERFACE (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* The Active Topic Card */}
            <motion.div 
                layout
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden min-h-[500px] flex flex-col justify-between"
            >
                {/* Topic Header */}
                <div className="relative z-10 flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                            <BookOpen className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            {isPending ? (
                                <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-2" />
                            ) : (
                                <h2 className="text-2xl font-bold text-slate-800">{data?.[0]?.title}</h2>
                            )}
                            <p className="text-gray-500 font-medium">{data?.[0]?.subject?.name} • {data?.[0]?.class?.name}</p>
                        </div>
                    </div>
                    
                    {/* Timer Badge */}
                    {isCallActive && (
                         <div className="px-4 py-2 bg-slate-900 rounded-xl text-white font-mono font-medium flex items-center gap-2">
                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                             {formatDuration(callDuration)}
                         </div>
                    )}
                </div>

                {/* Central Visual / Animation */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-12">
                     {/* Status Text */}
                     <p className={`text-center font-medium mb-8 transition-colors ${
                         isCallActive ? "text-green-600" : "text-gray-400"
                     }`}>
                        {callStatus || (isCallActive ? "Listening..." : "Tap the button below to start")}
                     </p>

                    {/* The Avatar/Visual */}
                    <div className="relative">
                        {/* Ripples */}
                        {isCallActive && (
                            <>
                                <motion.div 
                                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-orange-400 rounded-full opacity-20"
                                />
                                <motion.div 
                                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute inset-0 bg-orange-400 rounded-full opacity-10"
                                />
                            </>
                        )}
                        
                        {/* Main Circle */}
                        <motion.div 
                            animate={{ scale: isAISpeaking ? 1.1 : 1 }}
                            className={`w-40 h-40 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
                                isCallActive 
                                ? "bg-gradient-to-br from-orange-400 to-red-500 text-white" 
                                : isLoading 
                                ? "bg-gray-100" 
                                : "bg-white border-4 border-orange-100"
                            }`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                            ) : isCallActive ? (
                                <div className="space-y-1 text-center">
                                    <div className="flex justify-center gap-1">
                                        {[1,2,3].map(i => (
                                            <motion.div 
                                                key={i}
                                                animate={{ height: isAISpeaking ? [10, 24, 10] : 10 }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                                className="w-2 bg-white rounded-full h-3"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <BookOpen className="w-16 h-16 text-orange-300" />
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="relative z-10">
                    <button
                        onClick={handleVoiceCall}
                        disabled={isPending || !data}
                        className={`w-full py-4 rounded-xl font-extrabold text-white tracking-wide uppercase transition-all transform active:scale-95 shadow-lg ${
                            isCallActive 
                            ? "bg-red-500 hover:bg-red-600 shadow-red-200" 
                            : "bg-orange-400 hover:bg-orange-500 shadow-orange-200"
                        }`}
                    >
                        {isCallActive ? "End Session" : "Start Learning Session"}
                    </button>
                    
                    <Link href="/auth/dashboard">
                        <button className="w-full mt-3 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm uppercase">
                            Cancel
                        </button>
                    </Link>
                </div>

            </motion.div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR (Span 1) */}
          <div className="space-y-6">
            
            {/* Daily Quests Card (Visual Context) */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Session Goals</h3>
                    <Clock className="w-5 h-5 text-blue-500" />
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-white shrink-0">
                            <Zap className="w-6 h-6 fill-current" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span>Earn 50 XP</span>
                                <span className="text-gray-400">0/50</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 w-0" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-400 flex items-center justify-center text-white shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                                <span>Discuss Topic</span>
                                <span className="text-gray-400">0/1</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full bg-purple-400 transition-all duration-500 ${isCallActive ? 'w-1/2' : 'w-0'}`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* League/Stats Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800 text-lg">Your Progress</h3>
                 </div>
                 
                 <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        #4
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Sapphire League</p>
                        <p className="text-xs text-gray-500 font-bold">TOP 10 ADVANCE</p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500 ml-auto" />
                 </div>
            </div>

            {/* Topic Info Mini Card */}
             {data && (
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                     <h3 className="font-bold text-slate-800 mb-2">About this topic</h3>
                     <p className="text-sm text-gray-500 leading-relaxed">
                        {data[0].description || "Master the fundamentals of this topic through interactive conversation."}
                     </p>
                </div>
             )}

          </div>

        </div>
      </div>
    </div>
  );
}