"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FaBolt, FaCoins, FaCheck, FaArrowRight, FaArrowLeft, FaRegCompass, FaTrophy, FaGem } from "react-icons/fa";

const PLANS = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 100,
    price: 5.00,
    popular: false,
    color: "from-blue-500 to-indigo-600",
    border: "rgba(59, 130, 246, 0.2)",
    icon: FaRegCompass,
    description: "Perfect for exploring Google Veo & Sora model capabilities.",
    features: [
      "1 sec OpenAI Sora 2 Pro 1080p generation",
      "Up to 1.6 sec OpenAI Sora 2 Pro 720p generation",
      "Standard queue priority",
      "Local download access",
      "7-day history storage"
    ]
  },
  {
    id: "standard",
    name: "Standard Pack",
    credits: 250,
    price: 10.00,
    popular: true,
    color: "from-cyan-400 to-teal-500",
    border: "rgba(102, 252, 241, 0.4)",
    icon: FaBolt,
    description: "Great for regular creators and high-quality video prototyping.",
    features: [
      "2.5 sec OpenAI Sora 2 Pro 1080p generation",
      "Up to 4 sec OpenAI Sora 2 Pro 720p generation",
      "Faster rendering pipeline priority",
      "Permanent gallery history",
      "Full commercial license rights"
    ]
  },
  {
    id: "pro",
    name: "Professional Pack",
    credits: 600,
    price: 20.00,
    popular: false,
    color: "from-purple-500 to-pink-500",
    border: "rgba(139, 92, 246, 0.2)",
    icon: FaTrophy,
    description: "Ideal for power users, designers, and film directors.",
    features: [
      "1x Google Veo 3.1 flat generation (500 credits for 8s)",
      "Up to 10 sec OpenAI Sora 2 Pro 720p generation",
      "High priority execution queue",
      "Dedicated rendering slots",
      "VIP beta features access"
    ]
  },
  {
    id: "business",
    name: "Enterprise Pack",
    credits: 2000,
    price: 50.00,
    popular: false,
    color: "from-amber-400 to-orange-500",
    border: "rgba(245, 158, 11, 0.2)",
    icon: FaGem,
    description: "For agencies and large scale commercial video productions.",
    features: [
      "4x Google Veo 3.1 flat generations (500 credits each)",
      "Up to 33 sec OpenAI Sora 2 Pro 720p generation",
      "Maximum priority speed",
      "Dedicated server infrastructure",
      "Custom support channel"
    ]
  }
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState(null);

  const handlePurchase = async (planId) => {
    if (!session) {
      signIn("google");
      return;
    }

    setLoadingPlan(planId);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL missing.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <div className="text-center max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-[#66fcf1] text-xs font-semibold uppercase tracking-wider mb-4">
            <FaCoins /> Credit-Based Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 text-glow-teal">
            Fuel Your Video Imagination
          </h1>
          <p className="text-lg text-[#c5c6c7]">
            Relive AI relies on the world's most advanced video models. Power your custom animations, text storyboards, and ultra-high-definition cinematic outputs with flexible credit packs. No subscription required.
          </p>

          {error && (
            <div className="mt-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {PLANS.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#1c1e28] border-2 border-[#66fcf1] shadow-[0_10px_30px_rgba(102,252,241,0.15)] scale-[1.03] z-10"
                    : "glass hover:border-gray-700/60"
                }`}
                style={{ borderColor: plan.popular ? undefined : plan.border }}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#66fcf1] text-[#0b0c10] px-3.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#c5c6c7] text-sm font-semibold tracking-wide uppercase">
                      {plan.name}
                    </span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${plan.color} flex items-center justify-center text-white text-sm shadow-sm`}>
                      <IconComponent />
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-4xl font-extrabold text-white">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#c5c6c7]/60 ml-2">one-time</span>
                  </div>

                  {/* Credit tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white font-bold text-sm mb-4">
                    <FaCoins className="text-[#66fcf1] text-xs" />
                    <span>{plan.credits}</span>
                    <span className="text-[#c5c6c7] font-medium text-xs">Credits</span>
                  </div>

                  <p className="text-xs text-[#c5c6c7]/80 leading-relaxed mb-6 border-b border-[#2c2e3e] pb-4">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#c5c6c7]">
                        <FaCheck className="text-[#66fcf1] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] hover:shadow-[0_0_20px_rgba(102,252,241,0.5)] cursor-pointer"
                      : "bg-white/5 border border-white/15 text-white hover:bg-white/10 cursor-pointer"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{session ? "Purchase Credits" : "Login & Purchase"}</span>
                      <FaArrowRight size={10} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Model credit usage reference details */}
        <div className="w-full mt-16 max-w-4xl glass rounded-2xl border border-[#2c2e3e] p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FaBolt className="text-[#66fcf1]" /> AI Model Credit Rates Table
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2c2e3e] text-[#c5c6c7]/60 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Model Name</th>
                  <th className="pb-3 px-4">Provider</th>
                  <th className="pb-3 px-4">Type</th>
                  <th className="pb-3 px-4">Credit Cost</th>
                  <th className="pb-3 pl-4 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2e3e]/40">
                <tr className="text-[#c5c6c7]">
                  <td className="py-3.5 pr-4 font-semibold text-white">Google Veo 3.1 Image to Video</td>
                  <td className="py-3.5 px-4 text-[#c5c6c7]/80">KIE_AI</td>
                  <td className="py-3.5 px-4">Image to Video (8s Flat)</td>
                  <td className="py-3.5 px-4 font-bold text-[#66fcf1]">500 credits (flat)</td>
                  <td className="py-3.5 pl-4 text-right text-[#c5c6c7]/80">~$16.60 per video</td>
                </tr>
                <tr className="text-[#c5c6c7]">
                  <td className="py-3.5 pr-4 font-semibold text-white">OpenAI Sora 2 Pro Image to Video</td>
                  <td className="py-3.5 px-4 text-[#c5c6c7]/80">APIMART</td>
                  <td className="py-3.5 px-4">HQ Image to Video</td>
                  <td className="py-3.5 px-4 font-bold text-[#66fcf1]">60 credits/sec (720p) / 100 credits/sec (1080p)</td>
                  <td className="py-3.5 pl-4 text-right text-[#c5c6c7]/80">~$2.00 to ~$3.30 per sec</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
