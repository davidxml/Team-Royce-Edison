"use client";


import { 
  Menu, 
  X, 
} from 'lucide-react';

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Brain } from "lucide-react";

export default function Header() {
 const [isScrolled, setIsScrolled] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 // Handle scroll for sticky navbar shadow
 useEffect(() => {
   const handleScroll = () => {
     setIsScrolled(window.scrollY > 20);
   };
   window.addEventListener("scroll", handleScroll);
   return () => window.removeEventListener("scroll", handleScroll);
 }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? "border-b border-gray-200" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer">
          {/* Text Logo based on image */}
          <Image src="/logo.svg" alt="Edison Logo" width={150} height={50} />
          {/* <div className="w-3 h-3 bg-[#4854F6] rounded-full mb-4 -ml-1"></div>{" "} */}
          {/* The blue dot accent */}
        </div>

        <nav className="hidden md:flex items-center gap-8 font-bold text-gray-500 uppercase text-sm tracking-wide">
          <a
            href="#curriculum"
            className="hover:text-[#4854F6] transition-colors"
          >
            Curriculum
          </a>
          <a
            href="#features"
            className="hover:text-[#4854F6] transition-colors"
          >
            Features
          </a>
          <a href="#about" className="hover:text-[#4854F6] transition-colors">
            About
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="/sign-in"  className="hidden lg:block text-center font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest text-sm transition-colors">
            I have an account
          </a>
          <a href="/sign-up"  className="btn-primary px-6 py-2.5 rounded-2xl text-center font-bold uppercase tracking-widest text-sm shadow-md">
            Get Started
          </a>
        </div>

        <button
          className="md:hidden text-gray-500 border border-gray-300 p-2 rounded-lg transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 p-4 flex flex-col gap-4 shadow-xl">
          <a
            href="#curriculum"
            className="font-bold text-gray-500 text-center py-2"
          >
            Curriculum
          </a>
          <a
            href="#features"
            className="font-bold text-gray-500 text-center py-2"
          >
            Features
          </a>
          <a href="/sign-up" className="btn-primary w-full py-3  text-center rounded-xl font-bold uppercase">
            Get Started
          </a>
          <a href="/sign-in" className="btn-outline w-full py-3 text-center rounded-xl font-bold uppercase">
            Log In
          </a>
        </div>
      )}
    </header>
  );
}
