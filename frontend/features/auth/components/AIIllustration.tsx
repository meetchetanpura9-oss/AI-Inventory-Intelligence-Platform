"use client";

import { motion, useReducedMotion } from "framer-motion";
import { memo } from "react";

const nodes = [
  { cx: 150, cy: 76 },
  { cx: 182, cy: 102 },
  { cx: 128, cy: 112 },
  { cx: 160, cy: 136 },
  { cx: 198, cy: 142 },
  { cx: 112, cy: 154 },
];

const flowPaths = [
  "M188 164C244 190 260 206 312 206",
  "M180 250C238 248 262 248 314 248",
  "M424 216C464 210 486 196 524 176",
  "M444 248C484 260 500 282 528 306",
];

const labels = [
  { x: 62, y: 316, text: "Warehouse" },
  { x: 115, y: 46, text: "AI Engine" },
  { x: 325, y: 306, text: "Forecast" },
  { x: 508, y: 118, text: "Recommendations" },
  { x: 505, y: 280, text: "Dark Store" },
  { x: 500, y: 374, text: "Customer" },
];

export const AIIllustration = memo(function AIIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl will-change-transform"
      animate={reduceMotion ? undefined : { transform: ["translate3d(0,0,0)", "translate3d(0,-8px,0)", "translate3d(0,0,0)"] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 640 390"
        role="img"
        aria-label="Animated inventory intelligence pipeline from warehouse to AI recommendations, dark store, and customer"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="flow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="55%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="30" y="198" width="150" height="96" rx="18" fill="#0B2034" stroke="rgba(255,255,255,.14)" />
        <path d="M48 198l56-42 58 42" fill="#102B43" stroke="rgba(255,255,255,.14)" />
        <rect x="58" y="226" width="28" height="28" rx="5" fill="#2563EB" opacity=".75" />
        <rect x="96" y="226" width="28" height="28" rx="5" fill="#2DD4BF" opacity=".65" />
        <rect x="134" y="226" width="28" height="28" rx="5" fill="#22C55E" opacity=".65" />
        <rect x="70" y="262" width="78" height="18" rx="5" fill="rgba(255,255,255,.12)" />

        <motion.g
          filter="url(#softGlow)"
          animate={reduceMotion ? undefined : { opacity: [0.78, 1, 0.78], scale: [1, 1.015, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="158" cy="126" r="72" fill="rgba(37,99,235,.12)" stroke="url(#flow)" />
          <path
            d="M126 121c-14-4-18-23-6-33 2-18 24-24 36-10 14-9 35 1 34 20 18 7 19 32 2 41 1 20-23 31-38 17-14 8-35 0-36-17"
            fill="rgba(59,130,246,.18)"
            stroke="url(#flow)"
            strokeWidth="2"
          />
          {nodes.map((node, index) => (
            <motion.circle
              key={`${node.cx}-${node.cy}`}
              {...node}
              r="4"
              fill="#A7F3D0"
              animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55], r: [3.5, 5, 3.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
            />
          ))}
          <path d="M150 76L182 102L160 136L128 112L112 154M160 136L198 142M128 112L150 76" stroke="#93C5FD" strokeWidth="1.5" opacity=".8" />
        </motion.g>

        {flowPaths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke="url(#flow)"
            strokeWidth="3"
            strokeDasharray="9 9"
            strokeLinecap="round"
            fill="none"
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, -72] }}
            transition={{ duration: 12 + index, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <rect x="312" y="168" width="132" height="112" rx="22" fill="#0B2034" stroke="rgba(255,255,255,.14)" />
        <motion.path
          d="M336 242c18-30 34-19 49-42 18 22 32 5 43-18"
          fill="none"
          stroke="#22C55E"
          strokeWidth="4"
          strokeLinecap="round"
          animate={reduceMotion ? undefined : { pathLength: [0.45, 1, 0.45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="336" y="260" width="74" height="8" rx="4" fill="rgba(255,255,255,.16)" />
        <rect x="336" y="188" width="42" height="9" rx="4" fill="#3B82F6" opacity=".8" />

        <rect x="504" y="130" width="108" height="72" rx="18" fill="#0B2034" stroke="rgba(255,255,255,.14)" />
        <motion.path
          d="M526 166l20 18 42-42"
          stroke="#22C55E"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={reduceMotion ? undefined : { pathLength: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="516" y="220" width="82" height="46" rx="14" fill="rgba(59,130,246,.16)" stroke="rgba(255,255,255,.12)" />
        <path d="M530 251c8-18 22-18 30 0 8-18 22-18 30 0" stroke="#93C5FD" strokeWidth="3" fill="none" />

        <rect x="492" y="290" width="46" height="34" rx="10" fill="#111C2D" stroke="rgba(255,255,255,.14)" />
        <rect x="548" y="290" width="46" height="34" rx="10" fill="#111C2D" stroke="rgba(255,255,255,.14)" />
        <circle cx="515" cy="344" r="10" fill="#2DD4BF" opacity=".75" />
        <circle cx="571" cy="344" r="10" fill="#3B82F6" opacity=".75" />

        {labels.map((label) => (
          <text key={label.text} x={label.x} y={label.y} fill="#CBD5E1" fontSize="12" fontWeight="600">
            {label.text}
          </text>
        ))}
      </svg>
      <div className="absolute right-5 top-5 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-100">
        Live AI Loop
      </div>
    </motion.div>
  );
});
