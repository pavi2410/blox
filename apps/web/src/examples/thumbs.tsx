import type { JSX } from "solid-js";

const frame = (bg: string, kids: JSX.Element) => (
  <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="360" fill={bg} />
    {kids}
  </svg>
);

const thumbs: Record<string, () => JSX.Element> = {
  hello: () =>
    frame("#16161d", (
      <>
        <rect x="90" y="88" width="300" height="184" rx="12" fill="#26262e" />
        <rect x="114" y="112" width="180" height="12" rx="3" fill="#8a8a96" />
        <rect x="114" y="140" width="252" height="32" rx="6" fill="#1e1e24" stroke="#3a3a45" />
        <rect x="114" y="192" width="88" height="32" rx="6" fill="#4f8cff" />
      </>
    )),
  cafe: () =>
    frame("#16161d", (
      <>
        <rect x="48" y="36" width="384" height="288" rx="12" fill="#26262e" />
        <rect x="72" y="56" width="140" height="12" rx="3" fill="#8a8a96" />
        <rect x="72" y="88" width="160" height="36" rx="6" fill="#4f8cff" />
        <rect x="248" y="88" width="160" height="36" rx="6" fill="#4f8cff" />
        <rect x="72" y="136" width="160" height="36" rx="6" fill="#66dd88" />
        <rect x="248" y="136" width="160" height="36" rx="6" fill="#66dd88" />
        <rect x="72" y="200" width="336" height="10" rx="3" fill="#3a3a45" />
        <rect x="72" y="248" width="100" height="36" rx="6" fill="#ffaa44" />
        <rect x="188" y="248" width="100" height="36" rx="6" fill="#3a3a45" />
      </>
    )),
  light: () =>
    frame("#16161d", (
      <>
        <rect x="195" y="36" width="90" height="250" rx="12" fill="#2a2a32" />
        <rect x="232" y="286" width="16" height="50" fill="#3a3a45" />
        <circle cx="240" cy="90" r="28" fill="#ff3344" />
        <circle cx="240" cy="160" r="28" fill="#5a4a18" />
        <circle cx="240" cy="230" r="28" fill="#1a4a22" />
      </>
    )),
  spiral: () =>
    frame("#16161d", (
      <path
        d="M240 180m0 8a8 8 0 1 1 0-16 12 12 0 1 1 0 24 20 20 0 1 1 0-40 32 32 0 1 1 0 64 48 48 0 1 1 0-96 72 72 0 1 1 0 144 104 104 0 1 1 0-208"
        fill="none"
        stroke="#ff6680"
        stroke-width="6"
        stroke-linecap="round"
      />
    )),
  ball: () =>
    frame("#1e1e24", <circle cx="300" cy="140" r="28" fill="#4f8cff" />),
  keys: () =>
    frame("#ffffff", (
      <>
        <rect x="210" y="150" width="48" height="48" rx="4" fill="#22aa66" />
        <rect x="36" y="36" width="200" height="10" rx="3" fill="#c8c8d0" />
      </>
    )),
  melody: () =>
    frame("#16161d", (
      <>
        <rect x="70" y="180" width="36" height="120" rx="4" fill="#ff6680" />
        <rect x="130" y="140" width="36" height="160" rx="4" fill="#ffaa44" />
        <rect x="190" y="100" width="36" height="200" rx="4" fill="#66dd88" />
        <rect x="250" y="80" width="36" height="220" rx="4" fill="#4f8cff" />
        <rect x="310" y="50" width="36" height="250" rx="4" fill="#c084fc" />
        <rect x="370" y="120" width="36" height="180" rx="4" fill="#ffe066" />
      </>
    )),
  breakout: () =>
    frame("#16161d", (
      <>
        {["#ff6680", "#ffaa44", "#66dd88", "#4f8cff"].map((c, row) =>
          [0, 1, 2, 3, 4, 5].map((col) => (
            <rect x={24 + col * 74} y={36 + row * 28} width="66" height="20" rx="3" fill={c} />
          )),
        )}
        <rect x="190" y="318" width="90" height="12" rx="3" fill="#e8e8ef" />
        <circle cx="240" cy="250" r="8" fill="#ffe066" />
      </>
    )),
  sort: () =>
    frame("#16161d", (
      <>
        {[4, 9, 2, 7, 11, 5, 8, 3, 10, 6, 1, 12].map((h, i) => (
          <rect
            x={20 + i * 38}
            y={300 - h * 18}
            width="28"
            height={h * 18}
            rx="3"
            fill={i === 2 || i === 3 ? "#ffe066" : "#4f8cff"}
          />
        ))}
      </>
    )),
};

export function Thumb(props: { id: string }) {
  return thumbs[props.id]?.() ?? frame("#16161d", null);
}
