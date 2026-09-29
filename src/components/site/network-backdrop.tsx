const nodes = [
  { x: 8, y: 22 },
  { x: 24, y: 58 },
  { x: 38, y: 18 },
  { x: 52, y: 46 },
  { x: 66, y: 24 },
  { x: 78, y: 62 },
  { x: 92, y: 34 },
  { x: 16, y: 82 },
  { x: 60, y: 84 },
  { x: 88, y: 78 },
];

const links: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [4, 5],
  [4, 6],
  [5, 6],
  [1, 7],
  [7, 8],
  [5, 8],
  [5, 9],
  [8, 9],
  [2, 4],
];

/** Decorative network-node visualization. Hidden from assistive tech. */
export function NetworkBackdrop({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute inset-0 tech-grid" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-70"
      >
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a]!.x}
            y1={nodes[a]!.y}
            x2={nodes[b]!.x}
            y2={nodes[b]!.y}
            stroke="var(--color-grid)"
            strokeWidth="0.15"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="0.45" fill="var(--color-node)" opacity="0.9" />
            <circle cx={n.x} cy={n.y} r="1.4" fill="none" stroke="var(--color-node)" strokeWidth="0.08">
              <animate
                attributeName="r"
                values="0.6;2.4;0.6"
                dur={`${4 + (i % 4)}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;0;0.55"
                dur={`${4 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}
