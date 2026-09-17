"use client";

type ProfileIdentityFrameProps = {
  recordId: string;
};

// A bounding-bracket + converging-guide-lines frame, drawn in on mount via
// stroke-dashoffset (see MemberProfile's entrance timeline for ".identity-frame-line").
// This is the same construction/blueprint vocabulary as Hero's logo-build
// sequence, scaled down to frame a member's identity instead of the mark.
export function ProfileIdentityFrame({ recordId }: ProfileIdentityFrameProps) {
  return (
    <svg
      className="pointer-events-none absolute -inset-[38px] z-[1] max-[520px]:-inset-[26px]"
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden="true"
    >
      {/* corner brackets */}
      {[
        { x: 6, y: 6, rot: 0 },
        { x: 214, y: 6, rot: 90 },
        { x: 214, y: 214, rot: 180 },
        { x: 6, y: 214, rot: 270 },
      ].map((corner, index) => (
        <path
          key={index}
          d="M0 14 V2 H14"
          transform={`translate(${corner.x} ${corner.y}) rotate(${corner.rot})`}
          className="identity-frame-line"
          stroke="rgba(var(--accent-a),.55)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      ))}

      {/* converging guide lines */}
      <path d="M2 2 L70 46" className="identity-frame-line" stroke="rgba(var(--accent-a),.22)" strokeWidth={1} />
      <path d="M218 2 L150 46" className="identity-frame-line" stroke="rgba(var(--accent-b),.22)" strokeWidth={1} />
      <path d="M2 218 L70 174" className="identity-frame-line" stroke="rgba(var(--accent-b),.22)" strokeWidth={1} />
      <path d="M218 218 L150 174" className="identity-frame-line" stroke="rgba(var(--accent-a),.22)" strokeWidth={1} />

      {/* continuously rotating orbit ring */}
      <g
        className="identity-frame-line profile-orbit-spinner"
        transform="rotate(0 110 110)"
      >
        <circle
          cx="110"
          cy="110"
          r="96"
          stroke="rgba(var(--accent-a),.2)"
          strokeWidth={1}
          strokeDasharray="4 10 1 7"
        />
        <circle cx="206" cy="110" r="2.2" fill="rgba(var(--accent-a),.82)" />
        <circle cx="14" cy="110" r="1.4" fill="rgba(var(--accent-b),.52)" />
      </g>

      <text
        x="110"
        y="14"
        textAnchor="middle"
        className="identity-frame-line fill-white/25 font-mono"
        style={{ fontSize: "6.5px", letterSpacing: "0.14em" }}
      >
        RECORD / {recordId}
      </text>
    </svg>
  );
}
