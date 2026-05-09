'use client';

import React from 'react';

interface BusinessDigitizerProps {
  className?: string;
  width?: string;
  height?: string;
}

export const BusinessDigitizer: React.FC<BusinessDigitizerProps> = ({
  className = '',
  width = '100%',
  height = '100%',
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 200 100"
      style={{ color: 'rgba(255,255,255,0.15)' }}
    >
      {/* Connection paths */}
      <g
        stroke="currentColor"
        fill="none"
        strokeWidth="0.3"
        strokeDasharray="100 100"
        pathLength="100"
        markerStart="url(#biz-circle-marker)"
      >
        <path strokeDasharray="100 100" pathLength="100" d="M 10 20 h 79.5 q 5 0 5 5 v 30" />
        <path strokeDasharray="100 100" pathLength="100" d="M 180 10 h -69.7 q -5 0 -5 5 v 30" />
        <path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" />
        <path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" />
        <path strokeDasharray="100 100" pathLength="100" d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" />
        <path d="M 94.8 95 v -36" />
        <path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" />
        <path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" />
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1s" fill="freeze" calcMode="spline" keySplines="0.25,0.1,0.5,1" keyTimes="0; 1" />
      </g>

      {/* Animated data pulses — gold for business data */}
      <g mask="url(#biz-mask-1)">
        <circle className="biz-line biz-line-1" cx="0" cy="0" r="8" fill="url(#biz-gold-grad)" />
      </g>
      <g mask="url(#biz-mask-2)">
        <circle className="biz-line biz-line-2" cx="0" cy="0" r="8" fill="url(#biz-blue-grad)" />
      </g>
      <g mask="url(#biz-mask-3)">
        <circle className="biz-line biz-line-3" cx="0" cy="0" r="8" fill="url(#biz-purple-grad)" />
      </g>
      <g mask="url(#biz-mask-4)">
        <circle className="biz-line biz-line-4" cx="0" cy="0" r="8" fill="url(#biz-white-grad)" />
      </g>
      <g mask="url(#biz-mask-5)">
        <circle className="biz-line biz-line-5" cx="0" cy="0" r="8" fill="url(#biz-green-grad)" />
      </g>
      <g mask="url(#biz-mask-6)">
        <circle className="biz-line biz-line-6" cx="0" cy="0" r="8" fill="url(#biz-gold-grad)" />
      </g>
      <g mask="url(#biz-mask-7)">
        <circle className="biz-line biz-line-7" cx="0" cy="0" r="8" fill="url(#biz-blue-grad)" />
      </g>
      <g mask="url(#biz-mask-8)">
        <circle className="biz-line biz-line-8" cx="0" cy="0" r="8" fill="url(#biz-purple-grad)" />
      </g>

      {/* CPU Box — represents HUM's AI core */}
      <g>
        {/* Connection pins */}
        <g fill="url(#biz-pin-gradient)">
          <rect x="93" y="37" width="2.5" height="5" rx="0.7" />
          <rect x="104" y="37" width="2.5" height="5" rx="0.7" />
          <rect x="116.3" y="44" width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)" />
          <rect x="122.8" y="44" width="2.5" height="5" rx="0.7" transform="rotate(90 116.25 45.5)" />
          <rect x="104" y="16" width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)" />
          <rect x="114.5" y="16" width="2.5" height="5" rx="0.7" transform="rotate(180 105.25 39.5)" />
          <rect x="80" y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)" />
          <rect x="87" y="-13.6" width="2.5" height="5" rx="0.7" transform="rotate(270 115.25 19.5)" />
        </g>
        {/* Core chip */}
        <rect x="85" y="40" width="30" height="20" rx="2" fill="#0a0a0a" filter="url(#biz-shadow)" stroke="#c9a84c" strokeWidth="0.3" strokeOpacity="0.6" />
        {/* HUM text with animated gold shimmer */}
        <text x="91" y="52.5" fontSize="7" fill="url(#biz-text-grad)" fontWeight="700" letterSpacing="0.1em">HUM</text>
      </g>

      {/* Node labels */}
      <text x="4" y="18" fontSize="3.5" fill="rgba(255,255,255,0.4)" fontWeight="500" letterSpacing="0.05em">BUSINESS</text>
      <text x="160" y="8" fontSize="3.5" fill="rgba(255,255,255,0.4)" fontWeight="500" letterSpacing="0.05em">CREATOR</text>
      <text x="118" y="18" fontSize="3.5" fill="rgba(255,255,255,0.4)" fontWeight="500" letterSpacing="0.05em">CAMPAIGN</text>
      <text x="155" y="82" fontSize="3.5" fill="rgba(255,255,255,0.4)" fontWeight="500" letterSpacing="0.05em">ROI</text>
      <text x="20" y="28" fontSize="3.5" fill="rgba(255,255,255,0.4)" fontWeight="500" letterSpacing="0.05em">AUDIENCE</text>

      <defs>
        {/* Masks */}
        <mask id="biz-mask-1"><path d="M 10 20 h 79.5 q 5 0 5 5 v 24" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-2"><path d="M 180 10 h -69.7 q -5 0 -5 5 v 24" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-3"><path d="M 130 20 v 21.8 q 0 5 -5 5 h -10" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-4"><path d="M 170 80 v -21.8 q 0 -5 -5 -5 h -50" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-5"><path d="M 135 65 h 15 q 5 0 5 5 v 10 q 0 5 -5 5 h -39.8 q -5 0 -5 -5 v -20" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-6"><path d="M 94.8 95 v -36" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-7"><path d="M 88 88 v -15 q 0 -5 -5 -5 h -10 q -5 0 -5 -5 v -5 q 0 -5 5 -5 h 14" strokeWidth="0.5" stroke="white" /></mask>
        <mask id="biz-mask-8"><path d="M 30 30 h 25 q 5 0 5 5 v 6.5 q 0 5 5 5 h 20" strokeWidth="0.5" stroke="white" /></mask>

        {/* Gradients */}
        <radialGradient id="biz-gold-grad" fx="1">
          <stop offset="0%" stopColor="#e8c96a" />
          <stop offset="50%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="biz-blue-grad" fx="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="biz-purple-grad" fx="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="biz-white-grad" fx="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="biz-green-grad" fx="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <filter id="biz-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#c9a84c" floodOpacity="0.3" />
        </filter>

        <marker id="biz-circle-marker" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="18" markerHeight="18">
          <circle cx="5" cy="5" r="2" fill="#0a0a0a" stroke="#333" strokeWidth="0.5">
            <animate attributeName="r" values="0; 3; 2" dur="0.5s" />
          </circle>
        </marker>

        <linearGradient id="biz-pin-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F4F4F" />
          <stop offset="60%" stopColor="#1a1a1a" />
        </linearGradient>

        <linearGradient id="biz-text-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#888">
            <animate attributeName="offset" values="-2; -1; 0" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="25%" stopColor="#e8c96a">
            <animate attributeName="offset" values="-1; 0; 1" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
          <stop offset="50%" stopColor="#888">
            <animate attributeName="offset" values="0; 1; 2" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0; 0.5; 1" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
