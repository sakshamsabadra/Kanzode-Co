"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-blue-100">
      {/* Left Panel: Branding & Hero */}
      <div className="hidden lg:flex w-1/2 bg-[#1e3a5f] text-white flex-col relative overflow-hidden p-12 lg:p-20 justify-center items-center basis-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#12243d] pointer-events-none" />
        
        {/* Subtle Light Blue Glow */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-400/10 blur-[120px] pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col items-start w-full px-4 lg:px-0 lg:max-w-md xl:max-w-2xl 2xl:max-w-4xl overflow-hidden">
          <div className="flex items-center gap-5 xl:gap-8 min-w-0 w-full">
            <div className="bg-white p-4 xl:p-6 rounded-2xl shadow-2xl flex-shrink-0 flex items-center justify-center">
              <Image 
                src="/dashboard-logo.png" 
                alt="CS Logo" 
                width={120} 
                height={120} 
                className="object-contain w-20 h-20 xl:w-[120px] xl:h-[120px]"
              />
            </div>
            <div className="flex flex-col items-start justify-center min-w-0">
              <h1 className="text-2xl lg:text-3xl xl:text-5xl 2xl:text-6xl font-black tracking-widest text-white leading-none whitespace-nowrap truncate max-w-full">
                KANZODE & CO.
              </h1>
              <p className="text-sm lg:text-lg xl:text-2xl text-blue-200 font-bold uppercase tracking-[0.2em] xl:tracking-[0.3em] mt-2 lg:mt-3 truncate max-w-full">
                Company Secretary
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Interface */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#f0f7ff] lg:bg-white relative">
        <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-16 text-center">
            <Image 
              src="/dashboard-logo.png" 
              alt="CS Logo" 
              width={64} 
              height={64} 
              className="object-contain"
            />
            <div>
              <span className="block text-2xl font-black tracking-[0.15em] text-[#1e3a5f]">KANZODE & CO.</span>
              <span className="block text-sm font-bold tracking-[0.2em] text-blue-600 mt-1 uppercase">Company Secretary</span>
            </div>
          </div>

          <div className="w-full max-w-[420px]">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#1e3a5f] mb-3">Welcome</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#1e3a5f]">
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      id="email" 
                      type="email" 
                      defaultValue="admin@kanzode.co"
                      className="w-full rounded-none bg-white lg:bg-[#f8fafc] border-b-2 border-slate-200 px-4 py-4 pl-12 text-sm text-[#1e3a5f] outline-none transition-all focus:border-blue-600 focus:bg-white shadow-sm"
                      placeholder="Enter your email"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-[11px] font-black uppercase tracking-[0.2em] text-[#1e3a5f]">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      id="password" 
                      type="password"
                      defaultValue="kanzode123"
                      className="w-full rounded-none bg-white lg:bg-[#f8fafc] border-b-2 border-slate-200 px-4 py-4 pl-12 text-sm text-[#1e3a5f] outline-none transition-all focus:border-blue-600 focus:bg-white shadow-sm"
                      placeholder="Enter your password"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-[18px] h-[18px]" />
                    </div>
                  </div>
                </div>
              </div>

              <Link 
                href="/dashboard"
                className="group relative flex w-full justify-center items-center bg-[#1e3a5f] px-8 py-5 text-[13px] font-black uppercase tracking-[0.15em] text-white shadow-xl shadow-[#1e3a5f]/20 hover:bg-blue-600 transition-all active:scale-[0.98]"
              >
                Sign In
                <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
