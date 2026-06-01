"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBolt, FaCoins, FaPlay, FaDownload, FaArrowLeft, FaEye, FaVideo, FaTimes } from "react-icons/fa";
import { formatDate } from "@/lib/utils";

export default function GalleryPage() {
  const { data: session } = useSession();
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreation, setSelectedCreation] = useState(null);

  useEffect(() => {
    if (session) {
      fetchCreations();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchCreations = async () => {
    try {
      const response = await fetch("/api/creations");
      if (response.ok) {
        const data = await response.json();
        setCreations(data.creations || []);
      }
    } catch (err) {
      console.error("Error loading creations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getModelLabel = (variant) => {
    if (variant.includes("veo")) return "Google Veo 3.1";
    if (variant.includes("sora-2-pro")) return "Sora 2 Pro";
    if (variant.includes("sora-2")) return "Sora 2 Standard";
    return variant;
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 text-glow-teal">
              Memory Showcase Gallery
            </h1>
            <p className="text-sm text-[#c5c6c7]">
              Explore and download your generated high-definition cinematic video memories.
            </p>
          </div>
          <Link
            href="/"
            className="bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all inline-flex items-center gap-2 self-start"
          >
            <FaVideo size={10} /> Create New Relive
          </Link>
        </div>

        {!session ? (
          <div className="glass rounded-3xl p-12 text-center border border-[#2c2e3e] max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#66fcf1] text-2xl mx-auto mb-6">
              <FaVideo />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-sm text-[#c5c6c7] mb-6">
              Please sign in to view your custom generated video gallery and download your creations in premium quality.
            </p>
            <button
              onClick={() => signIn("google")}
              className="bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(102,252,241,0.3)] transition-all cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-[#66fcf1] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#c5c6c7]">Retrieving creations...</p>
          </div>
        ) : creations.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-[#2c2e3e] max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-[#1f2833] flex items-center justify-center text-[#c5c6c7] text-2xl mx-auto mb-6">
              <FaVideo />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Creations Yet</h2>
            <p className="text-sm text-[#c5c6c7] mb-6">
              You haven't generated any videos yet. Head over to the Studio Workspace and bring your memories to life!
            </p>
            <Link
              href="/"
              className="bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(102,252,241,0.3)] transition-all inline-block"
            >
              Go to Workspace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creations.map((creation) => (
              <div
                key={creation.id}
                className="group relative flex flex-col justify-between glass rounded-2xl border border-[#2c2e3e] overflow-hidden transition-all duration-300 hover:border-teal-500/40 hover:shadow-[0_4px_25px_rgba(0,0,0,0.4)]"
              >
                {/* Visual Preview / Video */}
                <div className="relative aspect-video w-full bg-black/60 overflow-hidden flex items-center justify-center">
                  {creation.status === "completed" && creation.videoFiles?.[0] ? (
                    <video
                      src={creation.videoFiles[0]}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      muted
                      loop
                      playsInline
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => e.target.pause()}
                    />
                  ) : creation.imageUrl ? (
                    <img
                      src={creation.imageUrl}
                      alt={creation.prompt}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#c5c6c7]/30 space-y-2 p-6">
                      <FaVideo size={28} />
                      <span className="text-[10px] uppercase font-bold tracking-wider">No visual preview</span>
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        creation.status === "completed"
                          ? "bg-teal-500/90 text-[#0b0c10]"
                          : creation.status === "failed"
                          ? "bg-red-500/90 text-white"
                          : "bg-amber-500/90 text-[#0b0c10] animate-pulse"
                      }`}
                    >
                      {creation.status}
                    </span>
                    <span className="bg-black/75 px-2 py-0.5 rounded-full text-[10px] font-medium text-white">
                      {getModelLabel(creation.modelVariant)}
                    </span>
                  </div>

                  {creation.status === "completed" && (
                    <button
                      onClick={() => setSelectedCreation(creation)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#66fcf1] text-[#0b0c10] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <FaPlay size={14} className="ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Details Footer */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-xs text-[#c5c6c7]/50 mb-1">
                      {formatDate(creation.createdAt)}
                    </p>
                    <p className="text-xs font-semibold text-white line-clamp-2 leading-relaxed mb-4 group-hover:text-[#66fcf1] transition-colors">
                      "{creation.prompt}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#2c2e3e]/40 pt-4 mt-auto">
                    <div className="text-[10px] text-[#c5c6c7]/60">
                      Ratio: <span className="font-semibold text-[#c5c6c7]">{creation.aspectRatio}</span>
                      {creation.duration && (
                        <> • Duration: <span className="font-semibold text-[#c5c6c7]">{creation.duration}s</span></>
                      )}
                    </div>

                    {creation.status === "completed" && creation.videoFiles?.[0] && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCreation(creation)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
                          title="View creation"
                        >
                          <FaEye size={12} />
                        </button>
                        <a
                          href={`/api/download?url=${encodeURIComponent(creation.videoFiles[0])}`}
                          className="p-2 rounded-lg bg-[#66fcf1]/10 border border-[#66fcf1]/30 hover:bg-[#66fcf1] hover:text-[#0b0c10] text-[#66fcf1] transition-all flex items-center justify-center"
                          title="Download video"
                          download
                        >
                          <FaDownload size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox / Video Modal */}
      {selectedCreation && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="relative glass-premium max-w-4xl w-full rounded-2xl overflow-hidden border border-[#66fcf1]/30">
            <button
              onClick={() => setSelectedCreation(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-[#66fcf1] hover:text-[#0b0c10] text-[#c5c6c7] flex items-center justify-center transition-all"
            >
              <FaTimes />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Left col: Video */}
              <div className="lg:col-span-2 bg-black aspect-video flex items-center justify-center">
                <video
                  src={selectedCreation.videoFiles[0]}
                  className="w-full h-full"
                  controls
                  autoPlay
                  loop
                />
              </div>

              {/* Right col: Details */}
              <div className="p-6 flex flex-col justify-between h-full bg-[#15161c]">
                <div className="space-y-4">
                  <div>
                    <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-[#66fcf1] rounded-full text-[9px] font-bold uppercase tracking-wider">
                      {selectedCreation.status}
                    </span>
                    <h3 className="text-md font-bold text-white mt-2">
                      {getModelLabel(selectedCreation.modelVariant)}
                    </h3>
                    <p className="text-[10px] text-[#c5c6c7]/50 mt-1">
                      Generated {formatDate(selectedCreation.createdAt)}
                    </p>
                  </div>

                  <div className="border-t border-[#2c2e3e] pt-4">
                    <span className="text-[10px] uppercase font-bold text-[#c5c6c7]/40 block mb-1">Prompt</span>
                    <p className="text-xs text-white leading-relaxed italic">
                      "{selectedCreation.prompt}"
                    </p>
                  </div>

                  {selectedCreation.imageUrl && (
                    <div className="border-t border-[#2c2e3e] pt-4">
                      <span className="text-[10px] uppercase font-bold text-[#c5c6c7]/40 block mb-2">Start Frame Image</span>
                      <div className="w-24 aspect-video rounded-lg overflow-hidden border border-[#2c2e3e]">
                        <img src={selectedCreation.imageUrl} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}

                  <div className="border-t border-[#2c2e3e] pt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#c5c6c7]/40 block">Aspect Ratio</span>
                      <span className="font-semibold text-white">{selectedCreation.aspectRatio}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#c5c6c7]/40 block">Duration</span>
                      <span className="font-semibold text-white">{selectedCreation.duration}s</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#2c2e3e] pt-4">
                  <a
                    href={`/api/download?url=${encodeURIComponent(selectedCreation.videoFiles[0])}`}
                    className="w-full bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all flex items-center justify-center gap-2"
                    download
                  >
                    <FaDownload /> Download Memory Video
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
