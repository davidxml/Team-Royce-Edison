"use client"

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  MessageCircle, 
  Zap, 
  Trophy, 
  Target, 
  Globe, 
  Menu, 
  X, 
  ChevronRight, 
  Star,
  Check
} from 'lucide-react';

const LandingPage = () => {
 

  return (
    <div className="font-sans text-gray-800 antialiased bg-white selection:bg-indigo-100 selection:text-indigo-800">
      {/* Google Font Import (Nunito matches Duolingo's roundness) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Nunito', sans-serif; }
        
        /* Primary Edison Blue Button */
        .btn-primary {
          background-color: #4854F6; /* Edison Blue */
          color: white;
          border-bottom: 4px solid #353EB5; /* Darker Shadow */
          transition: all 0.1s;
        }
        .btn-primary:active {
          transform: translateY(2px);
          border-bottom: 0px solid #353EB5;
          margin-bottom: 4px;
        }
        .btn-primary:hover {
          background-color: #5964F8; /* Lighter on hover */
        }

        /* Outline Button (Secondary) */
        .btn-outline {
          background-color: white;
          color: #4854F6;
          border: 2px solid #E5E7EB;
          border-bottom: 4px solid #E5E7EB;
        }
        .btn-outline:hover {
          background-color: #F9FAFB;
          border-color: #E5E7EB;
        }
        .btn-outline:active {
          transform: translateY(2px);
          border-bottom: 0px solid #E5E7EB;
          margin-bottom: 4px;
        }

        /* Accent Button (e.g. for "Super" features) */
        .btn-accent {
          background-color: #F43F5E; /* Rose/Red for contrast */
          color: white;
          border-bottom: 4px solid #BE123C;
        }
        .btn-accent:active {
          transform: translateY(2px);
          border-bottom: 0px solid #BE123C;
          margin-bottom: 4px;
        }
        
        /* Floating Animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out 2s infinite;
        }
      `}</style>

     
      <main className="pt-20">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 py-12">
            
            {/* Hero Image / Animation Placeholder */}
            <div className="w-full lg:w-1/2 flex justify-center relative">
              <div className="relative w-80 h-80 lg:w-[500px] lg:h-[500px]">
                {/* Central Globe/Mascot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#4854F6] rounded-full flex items-center justify-center z-10 shadow-[0_8px_0_#353EB5] animate-float">
                  <BookOpen size={100} className="text-white" strokeWidth={2.5} />
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute top-0 right-10 bg-yellow-400 p-4 rounded-2xl shadow-[0_4px_0_#b45309] animate-float-delayed z-20">
                  <Brain size={40} className="text-white" />
                </div>
                <div className="absolute bottom-10 left-0 bg-[#F43F5E] p-4 rounded-2xl shadow-[0_4px_0_#be123c] animate-float z-20">
                  <MessageCircle size={40} className="text-white" />
                </div>
                <div className="absolute top-20 left-10 bg-green-400 p-3 rounded-2xl shadow-[0_4px_0_#15803d] animate-float-delayed z-0 opacity-80">
                  <span className="text-white font-black text-xl">A+</span>
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-8">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-800 leading-tight">
                The fun, and effective way to learn & ace the  <span className="text-[#4854F6]">NERDC syllabus</span>.
              </h1>
              <p className="text-lg lg:text-xl text-gray-500 font-medium">
                From Grade 1 to Grade 12. Prepare for WAEC, NECO, and JAMB with personalized AI tutors and gamified lessons.
              </p>
              
              <div className="flex flex-col gap-4 max-w-sm mx-auto lg:mx-0">
                <button className="btn-primary w-full py-4 rounded-2xl font-extrabold text-lg uppercase tracking-widest shadow-lg">
                  Get Started
                </button>
                <button className="btn-outline w-full py-4 rounded-2xl font-extrabold text-lg uppercase tracking-widest shadow-sm">
                  I already have an account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Curriculum Strip */}
        <div className="border-t border-b border-gray-200 bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-center font-bold text-gray-400 uppercase tracking-widest mb-6 text-sm">
              Covering the complete Nigerian Curriculum
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {['Primary', 'JSS 1-3', 'SSS 1-3', 'WAEC', 'NECO', 'JAMB'].map((level) => (
                <span key={level} className="text-2xl font-black text-gray-600">{level}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 1: NERDC Alignment */}
        <section className="py-24" id="features">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
                Follows the NERDC Syllabus.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                Don't waste time on topics that won't appear on the exam. Our curriculum is 100% aligned with Nigerian educational standards, ensuring every quiz and flashcard moves you closer to an A.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg text-[#4854F6]"><Check strokeWidth={4} size={20} /></div>
                  <span className="font-bold text-gray-600">Updated for 2025 Academic Session</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-2 rounded-lg text-[#4854F6]"><Check strokeWidth={4} size={20} /></div>
                  <span className="font-bold text-gray-600">Subject-based categorization</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
              <div className="w-64 h-80 bg-white border-4 border-gray-200 rounded-3xl p-6 shadow-[0_8px_0_#e5e7eb] transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-indigo-100 rounded-xl border-2 border-indigo-200 flex items-center justify-center text-[#4854F6] font-bold">Mathematics</div>
                  <div className="h-20 bg-blue-100 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 font-bold">English</div>
                  <div className="h-20 bg-yellow-100 rounded-xl border-2 border-yellow-200 flex items-center justify-center text-yellow-600 font-bold">Civic Ed.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Voice Chat & AI */}
        <section className="py-24 bg-indigo-50">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-[#4854F6] rounded-full flex items-center justify-center shadow-[0_10px_0_#353EB5]">
                   <MessageCircle size={120} className="text-white opacity-90" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border-2 border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-gray-600">Recording...</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
                Speak. Learn. Improve.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                Struggling with French oral? Need to explain a Physics concept to check your understanding? Use our <strong>Voice Chat AI</strong>. It listens, corrects your pronunciation, and explains complex topics in simple terms.
              </p>
              <button className="mt-8 text-[#4854F6] font-extrabold uppercase tracking-widest hover:underline text-sm">
                Learn more about our AI
              </button>
            </div>
          </div>
        </section>

        {/* Feature 3: Gamification */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
                Flashcards that feel like a game.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                Create your own decks or use our pre-made NERDC sets. Earn XP, maintain your streak, and climb the leaderboard while mastering Chemistry formulas or History dates.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center order-1 md:order-2">
               <div className="grid grid-cols-2 gap-4">
                  <div className="w-32 h-40 bg-yellow-400 rounded-2xl shadow-[0_6px_0_#b45309] flex flex-col items-center justify-center text-white transform -rotate-6">
                    <Zap size={40} className="mb-2" />
                    <span className="font-black text-2xl">XP</span>
                  </div>
                  <div className="w-32 h-40 bg-purple-500 rounded-2xl shadow-[0_6px_0_#6b21a8] flex flex-col items-center justify-center text-white transform rotate-6 mt-8">
                    <Trophy size={40} className="mb-2" />
                    <span className="font-black text-2xl">#1</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="py-20 bg-[#1E293B]">
          <div className="max-w-4xl mx-auto px-4 text-center">
             <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-10 leading-tight">
               Ready to bring out your Genius?
             </h2>
             <button className="bg-[#4854F6] text-white px-10 py-4 rounded-2xl font-extrabold text-lg uppercase tracking-widest shadow-[0_6px_0_#353EB5] hover:bg-[#5964F8] active:translate-y-1 active:shadow-none active:mb-[6px] transition-all">
               Start Learning for Free
             </button>
          </div>
        </section>

      </main>

     
    </div>
  );
};

export default LandingPage;