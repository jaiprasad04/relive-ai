"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  FaBolt,
  FaCoins,
  FaUpload,
  FaPlay,
  FaDownload,
  FaVideo,
  FaInfoCircle,
  FaMagic,
  FaExternalLinkAlt,
  FaImage,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRegClock,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { SiVercel } from "react-icons/si";
import { cn } from "@/lib/utils";

// Preset prompts for outstanding AI video output
const PRESET_PROMPTS = {
  veo: [
    "A Gen Z creator is scrolling through their phone when they suddenly stop and yell: 'Wait—VEO3 is now on muapi?!' The camera zooms in as they tap the app and say, 'Let’s gooo!' and their screen explodes into generated video scenes.",
    "On a neon-lit street corner, a hyped street performer with a mic shouts: 'Yo! Big drop today! VEO3 just launched on muapi!' A crowd cheers as holograms of videos burst into the air and the muapi logo spins above.",
    "A breaking news ident, followed by a stylish tech anchor sitting in a digital newsroom shouting: 'Breaking update! VEO 3 is now live on the muapi platform!' As video effects flash behind her, she leans in and says: 'Text-to-video just got real — only on muapi!'",
  ],
  sora: [
    "Scene: A floating library suspended among golden clouds at sunset. Owl librarian wearing tiny spectacles hops from shelf to shelf; a book opens mid-air, pages flutter; ink letters rise and swirl around camera. Look: Warm sunset glow; soft haze; golden rim light. Audio: Soft page rustle.",
    "Scene: Submerged coral clearing, soft light filtering from above. Tiny jellyfish with monocle and top hat hosting tea for small seahorses. Jellyfish floats and pours tea -> bubbles rise slowly; seahorses sip -> tiny octopus clumsily serves cake. Look: Aqua-blue palette; subtle caustics.",
    "A cyclist rides through a lively European street at sunrise. The camera follows behind as warm golden light hits old stone buildings, people open café shops, and pigeons scatter. You hear bicycle wheels clicking, distant chatter, and a soft morning breeze.",
  ],
};

const MODELS = {
  // Google Veo 3.1
  "veo3-image-to-video": {
    id: "veo3-image-to-video",
    name: "Google Veo 3.1 Image to Video",
    cost: 45,
    family: "veo",
    type: "i2v",
    description:
      "Animate a custom start frame image into life while preserving detail.",
  },
  // OpenAI Sora 2 Pro
  "openai-sora-2-pro-image-to-video": {
    id: "openai-sora-2-pro-image-to-video",
    name: "OpenAI Sora 2 Pro Image to Video",
    cost: 50,
    family: "sora",
    type: "i2v",
    description:
      "HQ start frame image animations with cinematic rendering slots.",
  },
};

const getGenerationCost = (modelKey, duration, resolution) => {
  const isVeo = modelKey?.includes("veo");
  if (isVeo) return 500;
  const dur = parseInt(duration, 10) || 8;
  const rate = resolution === "1080p" ? 100 : 60;
  return dur * rate;
};


// Premium Interactive Cyberpunk Preset Themes
const PRESET_THEMES = [
  {
    name: "🎬 Cinematic",
    prompt:
      "A highly cinematic, photorealistic drone sweep over deep canyons at golden hour. Warm light rays breaking through light mist, 4k detail, dramatic pans.",
  },
  {
    name: "⚡ Sci-Fi Cyber",
    prompt:
      "Close up of an advanced humanoid android sitting in a dark server farm. Holographic diagnostic streams reflect in its glass eyes, neon cyber-teal accents, hyperreal detail.",
  },
  {
    name: "🌌 Cosmic Dream",
    prompt:
      "A dreamy, surreal shot of a floating neon garden suspended inside a cosmic stellar nebula. Bioluminescent vines grow, planets drift in the backdrop, warm purple lighting.",
  },
  {
    name: "🏍️ Neon Street",
    prompt:
      "High-speed tracking shot following a sleek futuristic motorbike driving through rain-slicked Tokyo streets at night. Bright neon reflections on wet asphalt, intense lights.",
  },
];
// Reusable Cyberpunk Glassmorphic Custom Dropdown Component
function CustomDropdown({
  value,
  onChange,
  options,
  disabled = false,
  upward = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full glass-input rounded p-2.5 text-xs font-semibold flex items-center justify-between transition-all duration-300 border border-[#2c2e3e] text-white select-none",
          disabled
            ? "opacity-45 cursor-not-allowed bg-black/10 border-dashed"
            : "hover:border-[#66fcf1]/45 cursor-pointer active:scale-[0.98]",
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : value}
        </span>
        <FaChevronDown
          className={cn(
            "w-3 h-3 text-[#c5c6c7]/60 transition-transform duration-300 ml-1.5 flex-shrink-0",
            isOpen && "rotate-180 text-[#66fcf1]",
          )}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className={cn(
            "absolute left-0 right-0 rounded border border-[#2c2e3e] bg-[#12131a]/95 backdrop-blur-xl shadow-2xl z-50 divide-y divide-white/5 animate-in duration-200 overscroll-contain max-h-60 overflow-y-auto",
            upward
              ? "bottom-full mb-1.5 slide-in-from-bottom-2"
              : "top-full mt-1.5 slide-in-from-top-2",
          )}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-3 py-2 text-xs font-medium cursor-pointer transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#66fcf1]/10 text-[#66fcf1]"
                    : "text-[#c5c6c7] hover:bg-white/5 hover:text-white",
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#66fcf1] shadow-[0_0_8px_#66fcf1]" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default function WorkspacePage() {
  const { data: session, status: authStatus } = useSession();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  // Model Parameters State
  const [modelFamily, setModelFamily] = useState("veo"); // veo | sora
  const [modelKey, setModelKey] = useState("veo3-image-to-video");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState(8);
  const [resolution, setResolution] = useState("720p");

  // UI & Active Tasks State
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeCreations, setActiveCreations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fileInputRef = useRef(null);

  // Sync model selection when family changes
  useEffect(() => {
    if (modelFamily === "veo") {
      setModelKey("veo3-image-to-video");
    } else {
      setModelKey("openai-sora-2-pro-image-to-video");
    }
  }, [modelFamily]);

  // Load creations on session start
  useEffect(() => {
    if (session) {
      fetchCreations();
    }
  }, [session]);

  // Poll active creations that are processing
  useEffect(() => {
    const processingCreations = activeCreations.filter(
      (c) => c.status === "processing",
    );
    if (processingCreations.length === 0) return;

    const interval = setInterval(() => {
      processingCreations.forEach((creation) => {
        checkStatus(creation.requestId);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeCreations]);

  const fetchCreations = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("/api/creations");
      if (response.ok) {
        const data = await response.json();
        setActiveCreations(data.creations || []);
      }
    } catch (err) {
      console.error("Failed to load creations history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const checkStatus = async (requestId) => {
    try {
      const response = await fetch(
        `/api/relive/check-status?requestId=${requestId}`,
      );
      if (response.ok) {
        const data = await response.json();
        const updated = data.creation;

        setActiveCreations((prev) =>
          prev.map((c) => (c.requestId === requestId ? updated : c)),
        );

        if (updated.status === "completed") {
          setSuccess("AI Memory generation completed successfully!");
          // Trigger browser notification or sound if needed
        } else if (updated.status === "failed") {
          setError(`AI generation failed: ${updated.error || "Unknown error"}`);
        }
      }
    } catch (err) {
      console.error("Error checking status for", requestId, err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setError("Image file exceeds the 8MB limit.");
      return;
    }

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed.");
      const data = await response.json();
      // Use the fully qualified url returned by upload API
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!session) {
      signIn("google");
      return;
    }

    setError("");
    setSuccess("");

    const selectedModel = MODELS[modelKey];
    if (!selectedModel) return;

    if (!imageUrl) {
      setError("An input start-frame image is required to generate the video.");
      return;
    }

    if (!prompt || prompt.trim() === "") {
      setError("A text prompt is required to guide the AI.");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("/api/relive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          modelKey,
          prompt,
          imageUrl: selectedModel.type === "i2v" ? imageUrl : null,
          aspectRatio,
          duration,
          resolution,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit task.");
      }

      setSuccess("Task submitted successfully! Processing initiated...");
      // Prepend to active creations list
      setActiveCreations((prev) => [data.creation, ...prev]);

      // Clear inputs
      setPrompt("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const selectPresetPrompt = () => {
    const presets = PRESET_PROMPTS[modelFamily];
    const randomIdx = Math.floor(Math.random() * presets.length);
    setPrompt(presets[randomIdx]);
  };

  const currentModelCost = getGenerationCost(modelKey, duration, resolution);

  return (
    <div className="w-full flex-grow flex flex-col relative overflow-y-auto">
      {/* Main Workspace Layout */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left column (Control Panel) - 5 cols */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="glass-premium rounded p-6 border border-[#2c2e3e]">
            <h2 className="text-lg font-black text-white tracking-wide mb-6 flex items-center gap-2">
              <FaVideo className="text-[#66fcf1]" /> Creation Controls
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Select AI Video Model Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#c5c6c7]/50 block">
                  Select AI Video Model
                </label>
                <CustomDropdown
                  value={modelKey}
                  onChange={(val) => {
                    setModelKey(val);
                    // Dynamically set modelFamily state based on selection
                    const selected = MODELS[val];
                    if (selected) {
                      setModelFamily(selected.family);
                    }
                  }}
                  options={[
                    {
                      value: "veo3-image-to-video",
                      label: "Google Veo 3.1 Image to Video (500 Credits)",
                    },
                    {
                      value: "openai-sora-2-pro-image-to-video",
                      label: `OpenAI Sora 2 Pro Image to Video (${resolution === "1080p" ? "100" : "60"} Credits/Sec)`,
                    },
                  ]}
                />
              </div>

              {/* Start Frame Image Uploader - Only visible for image-to-video models */}
              {MODELS[modelKey]?.type === "i2v" && (
                <div className="border-t border-[#2c2e3e]/40 pt-4">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#c5c6c7]/50 block mb-2">
                    Start Frame Image (Max 8MB)
                  </label>

                  {imageUrl ? (
                    <div className="relative aspect-video w-full rounded overflow-hidden border border-[#2c2e3e]">
                      <img
                        src={imageUrl}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2.5 right-2.5 p-2 rounded bg-black/60 hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove Image"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#2c2e3e] hover:border-[#66fcf1]/55 rounded aspect-video flex flex-col items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 transition-all duration-300 p-6 text-center group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {uploading ? (
                        <div className="w-8 h-8 border-2 border-[#66fcf1] border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded bg-white/5 border border-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                            <FaUpload size={14} className="text-[#66fcf1]" />
                          </div>
                          <span className="text-xs font-bold text-white block">
                            Click to upload frame
                          </span>
                          <span className="text-[10px] text-[#c5c6c7]/40 block mt-1">
                            Supports PNG, JPG, WEBP formats
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Prompt Input */}
              <div className="border-t border-[#2c2e3e]/40 pt-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#c5c6c7]/50">
                    Video Prompt Guidelines
                  </label>
                  <button
                    type="button"
                    onClick={selectPresetPrompt}
                    className="text-[10px] text-[#66fcf1] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <FaMagic size={9} /> Random Preset
                  </button>
                </div>

                {/* Preset Theme Quick Tags */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setPrompt(theme.prompt)}
                      className="text-[9px] font-bold px-2.5 py-1.5 rounded bg-[#15161c] border border-[#2c2e3e] hover:border-[#66fcf1]/40 text-[#c5c6c7] hover:text-[#66fcf1] transition-all cursor-pointer select-none"
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your scene in rich detail. Include camera movements, looking style, environment, lighting, and sounds for best results..."
                  className="w-full glass-input rounded p-3.5 text-xs placeholder-[#c5c6c7]/40 resize-none"
                  required
                />
              </div>

              {/* Aspect Ratio, Duration & Resolution Settings */}
              <div className="border-t border-[#2c2e3e]/40 pt-4 grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#c5c6c7]/40 block">
                    Aspect Ratio
                  </label>
                  <CustomDropdown
                    value={aspectRatio}
                    onChange={setAspectRatio}
                    options={[
                      { value: "16:9", label: "16:9 Landscape" },
                      { value: "9:16", label: "9:16 Portrait" },
                    ]}
                    upward={true}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#c5c6c7]/40 block">
                    Duration
                  </label>
                  {modelFamily === "sora" ? (
                    <CustomDropdown
                      value={duration}
                      onChange={setDuration}
                      options={[
                        { value: 4, label: "4 Secs" },
                        { value: 8, label: "8 Secs" },
                        { value: 12, label: "12 Secs" },
                        { value: 16, label: "16 Secs" },
                        { value: 20, label: "20 Secs" },
                      ]}
                      upward={true}
                    />
                  ) : (
                    <CustomDropdown
                      value={8}
                      onChange={() => {}}
                      options={[{ value: 8, label: "8 Secs" }]}
                      disabled={true}
                      upward={true}
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#c5c6c7]/40 block">
                    Resolution
                  </label>
                  {modelFamily === "sora" ? (
                    modelKey.includes("pro") ? (
                      <CustomDropdown
                        value={resolution}
                        onChange={setResolution}
                        options={[
                          { value: "720p", label: "720p HD" },
                          { value: "1080p", label: "1080p FHD" },
                        ]}
                        upward={true}
                      />
                    ) : (
                      <CustomDropdown
                        value="standard"
                        onChange={() => {}}
                        options={[{ value: "standard", label: "Standard" }]}
                        disabled={true}
                        upward={true}
                      />
                    )
                  ) : (
                    <CustomDropdown
                      value="auto"
                      onChange={() => {}}
                      options={[{ value: "auto", label: "Auto" }]}
                      disabled={true}
                      upward={true}
                    />
                  )}
                </div>
              </div>

              {/* Form submit response alerts */}
              {error && (
                <div className="p-3 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded border border-teal-500/20 bg-teal-500/10 text-[#66fcf1] text-xs flex items-center gap-2">
                  <FaCheckCircle className="flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Generate button */}
              <button
                type="submit"
                disabled={generating || uploading}
                className={cn(
                  "w-full py-4 rounded font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md",
                  modelFamily === "veo"
                    ? "bg-gradient-to-r from-[#66fcf1] to-[#00d2c4] text-[#0b0c10] hover:shadow-[0_0_20px_rgba(102,252,241,0.5)] border-none"
                    : "bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border-none",
                )}
              >
                {generating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaMagic size={11} />
                    <span>Generate Memory ({currentModelCost} credits)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right column (Studio Preview & Gallery History) - 7 cols */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Active creations tracker */}
          <div className="glass rounded p-6 border border-[#2c2e3e] flex-grow flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black text-white tracking-wide mb-6 flex items-center gap-2">
                <FaRegClock className="text-[#66fcf1]" /> Active Workspace Tasks
              </h2>

              {!session ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#66fcf1] text-xl">
                    <FaInfoCircle />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    Preview Blocked
                  </h3>
                  <p className="text-xs text-[#c5c6c7]">
                    Login is required to submit models pipeline tasks and poll
                    generation renders in real-time.
                  </p>
                  <button
                    onClick={() => signIn("google")}
                    className="bg-[#66fcf1] text-[#0b0c10] text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded hover:shadow-[0_0_12px_rgba(102,252,241,0.3)] transition-all cursor-pointer"
                  >
                    Authenticate Now
                  </button>
                </div>
              ) : loadingHistory ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                  <div className="w-8 h-8 border-2 border-[#66fcf1] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] text-[#c5c6c7]/50 uppercase tracking-widest font-bold">
                    Synchronizing history...
                  </span>
                </div>
              ) : activeCreations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[#c5c6c7]/30 text-lg">
                    <FaVideo />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    Workspace Empty
                  </h3>
                  <p className="text-xs text-[#c5c6c7]/70">
                    Write a detailed prompt on the left sidebar, choose a model,
                    and click Generate to start.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                  {activeCreations.map((creation) => (
                    <div
                      key={creation.id}
                      className={cn(
                        "glass rounded p-4 border transition-all duration-300 flex flex-col md:flex-row items-center gap-4",
                        creation.status === "processing"
                          ? creation.modelFamily === "veo"
                            ? "border-[#66fcf1]/50 bg-[#66fcf1]/2 neon-pulsing"
                            : "border-[#8b5cf6]/50 bg-[#8b5cf6]/2 purple-pulsing"
                          : creation.status === "failed"
                            ? "border-red-500/20 bg-red-500/2"
                            : "border-[#2c2e3e]",
                      )}
                    >
                      {/* Left: Input image preview or video thumbnail */}
                      <div className="w-24 aspect-video rounded bg-black/60 overflow-hidden flex items-center justify-center flex-shrink-0 relative border border-[#2c2e3e]/40">
                        {creation.status === "completed" &&
                        creation.videoFiles?.[0] ? (
                          <video
                            src={creation.videoFiles[0]}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            autoPlay
                            loop
                          />
                        ) : creation.imageUrl ? (
                          <img
                            src={creation.imageUrl}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-white/20">
                            <FaVideo size={20} />
                          </div>
                        )}

                        {/* Cost Tag */}
                        <div className="absolute bottom-1 right-1 bg-black/85 px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-wider flex items-center gap-0.5">
                          {getGenerationCost(creation.modelVariant, creation.duration, creation.resolution)}C
                        </div>
                      </div>

                      {/* Right: Info, Prompt, Status Bar */}
                      <div className="flex-grow w-full">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-white">
                              {creation.modelVariant.includes("veo")
                                ? "Google Veo 3.1"
                                : "OpenAI Sora 2"}
                            </span>
                            <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-semibold uppercase text-[#c5c6c7]/60">
                              {creation.aspectRatio}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={cn(
                                "text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border flex items-center gap-1.5",
                                creation.status === "completed"
                                  ? "bg-[#66fcf1]/10 border-[#66fcf1]/20 text-[#66fcf1]"
                                  : creation.status === "failed"
                                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400",
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full inline-block",
                                  creation.status === "completed"
                                    ? "bg-[#66fcf1] shadow-[0_0_8px_#66fcf1]"
                                    : creation.status === "failed"
                                      ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                                      : "bg-amber-400 animate-ping",
                                )}
                              />
                              <span>{creation.status}</span>
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-white font-medium leading-relaxed italic line-clamp-2">
                          "{creation.prompt}"
                        </p>

                        {/* Bottom action bar */}
                        <div className="flex items-center justify-between border-t border-[#2c2e3e]/40 pt-2 mt-2">
                          <span className="text-[9px] text-[#c5c6c7]/40 font-medium">
                            {new Date(creation.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>

                          {creation.status === "completed" &&
                            creation.videoFiles?.[0] && (
                              <a
                                href={`/api/download?url=${encodeURIComponent(creation.videoFiles[0])}`}
                                className="text-[10px] text-[#66fcf1] hover:underline flex items-center gap-1 font-bold uppercase tracking-wider"
                                download
                              >
                                <FaDownload size={9} /> Download video
                              </a>
                            )}

                          {creation.status === "failed" && (
                            <span
                              className="text-[9px] text-red-400/80 font-semibold line-clamp-1 max-w-[200px]"
                              title={creation.error}
                            >
                              Error:{" "}
                              {creation.error || "Generation pipeline crashed."}
                            </span>
                          )}

                          {creation.status === "processing" && (
                            <div className="flex items-center gap-1.5 text-[9px] text-amber-400 font-bold uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                              <span>Rendering clip...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {session && activeCreations.length > 0 && (
              <div className="border-t border-[#2c2e3e]/50 pt-4 mt-6 text-center">
                <Link
                  href="/gallery"
                  className="text-xs font-black text-[#66fcf1] uppercase tracking-wider hover:underline inline-flex items-center gap-1.5"
                >
                  Browse Full Showcase Gallery <FaExternalLinkAlt size={10} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
