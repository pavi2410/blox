type Node = {
  type: string;
  x?: number;
  y?: number;
  next?: { block?: Node };
  inputs?: Record<string, { block?: Node }>;
};

type Rect = { x: number; y: number; w: number; h: number; c: string };

const STMT = /^(DO\d*|ELSE|STACK|TREE|KIDS|PAIRS|CASES)$/;

const HUES: [string, number][] = [
  ["ui_", 190],
  ["events_ui", 190],
  ["events_", 40],
  ["canvas_", 280],
  ["input_", 280],
  ["turtle_", 120],
  ["dict_", 20],
  ["web_store", 305],
  ["web_", 330],
  ["io_", 160],
  ["time_", 200],
  ["logic_", 210],
  ["controls_if", 210],
  ["controls_match", 210],
  ["controls_", 120],
  ["math_", 230],
  ["text_", 160],
  ["lists_", 260],
  ["colour_", 20],
  ["variables_", 330],
  ["procedures_", 290],
];

const fill = (type: string) =>
  `hsl(${HUES.find(([p]) => type.startsWith(p))?.[1] ?? 220} 50% 45%)`;

const walk = (block: Node, x: number, y: number, depth: number, out: Rect[]): number => {
  out.push({ x: x + depth * 10, y, w: Math.max(48, 132 - depth * 12), h: 16, c: fill(block.type) });
  let cy = y + 20;
  for (const [name, slot] of Object.entries(block.inputs ?? {})) {
    if (STMT.test(name) && slot.block) cy = walk(slot.block, x, cy, depth + 1, out);
  }
  return block.next?.block ? walk(block.next.block, x, cy, depth, out) : cy;
};

const rootsOf = (state: object): Node[] =>
  (state as { blocks?: { blocks?: Node[] } }).blocks?.blocks ?? [];

export function Preview(props: { state: object }) {
  const rects: Rect[] = [];
  for (const b of rootsOf(props.state)) walk(b, b.x ?? 0, b.y ?? 0, 0, rects);

  if (!rects.length) {
    return (
      <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
        <rect width="480" height="360" fill="#16161d" />
      </svg>
    );
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.w);
    maxY = Math.max(maxY, r.y + r.h);
  }
  const bw = Math.max(maxX - minX, 80);
  const bh = Math.max(maxY - minY, 60);
  const s = Math.min(432 / bw, 312 / bh);
  const ox = (480 - bw * s) / 2 - minX * s;
  const oy = (360 - bh * s) / 2 - minY * s;

  return (
    <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill="#16161d" />
      <g transform={`translate(${ox} ${oy}) scale(${s})`}>
        {rects.map((r) => (
          <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="4" fill={r.c} />
        ))}
      </g>
    </svg>
  );
}
