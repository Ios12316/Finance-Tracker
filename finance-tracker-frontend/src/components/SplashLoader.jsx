import React from "react";
import { motion } from "framer-motion";
import splashImg from "../assets/splash.png";

export default function SplashLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white"
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated outer glowing ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: 360
          }}
          transition={{
            scale: { duration: 1, ease: "easeOut" },
            opacity: { duration: 1 },
            rotate: { repeat: Infinity, duration: 15, ease: "linear" }
          }}
          className="absolute w-64 h-64 border border-dashed border-blue-500/30 rounded-full blur-[2px]"
        />
        
        {/* Animated secondary glowing ring */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: -360
          }}
          transition={{
            scale: { duration: 1.2, ease: "easeOut" },
            opacity: { duration: 1.2 },
            rotate: { repeat: Infinity, duration: 20, ease: "linear" }
          }}
          className="absolute w-72 h-72 border border-dotted border-indigo-500/20 rounded-full blur-[1px]"
        />

        {/* Main Splash Image */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-slate-800"
        >
          <img 
            src={splashImg} 
            alt="IOS Ledger Splash" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Title & Brand */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl font-black mt-8 bg-gradient-to-r from-white via-blue-100 to-slate-400 bg-clip-text text-transparent tracking-tight"
        >
          IOS Ledger
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xs font-semibold tracking-widest text-slate-450 uppercase mt-2"
        >
          IOS Continental Ltd
        </motion.p>

        {/* Progress / Loading indicator bar */}
        <div className="w-32 h-1 bg-slate-850 rounded-full overflow-hidden mt-8 relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="absolute h-full w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
