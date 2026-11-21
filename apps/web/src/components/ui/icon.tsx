import type { JSX } from "@solidjs/web";

// 24×24 stroke icons; inherit colour from the surrounding text.
const paths = {
  undo: () => (
    <>
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </>
  ),
  redo: () => (
    <>
      <path d="m15 14 5-5-5-5" />
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </>
  ),
  play: () => <path d="M7 4.5v15l12-7.5z" fill="currentColor" />,
  pause: () => (
    <>
      <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
    </>
  ),
  stop: () => <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />,
  bug: () => (
    <>
      <rect x="7" y="8" width="10" height="12" rx="5" />
      <path d="M9.5 8V7a2.5 2.5 0 0 1 5 0v1M12 12v8M3 13h4M17 13h4M4 7l3 2.5M20 7l-3 2.5M4 19l3-2M20 19l-3-2" />
    </>
  ),
  step: () => (
    <>
      <path d="M4 15a8 8 0 0 1 14.5-4.5" />
      <path d="M19 5v6h-6" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </>
  ),
  close: () => <path d="M6 6l12 12M18 6 6 18" />,
  popout: () => (
    <>
      <rect x="3" y="7" width="14" height="14" rx="2" />
      <path d="M10 3h11v11M21 3l-9 9" />
    </>
  ),
  newTab: () => (
    <>
      <path d="M14 4h6v6M20 4l-8 8" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>
  ),
  trash: () => <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />,
  chevronRight: () => <path d="m9 6 6 6-6 6" />,
  chevronDown: () => <path d="m6 9 6 6 6-6" />,
  check: () => <path d="m5 12 5 5 9-10" />,
} satisfies Record<string, () => JSX.Element>;

export type IconName = keyof typeof paths;

export function Icon(props: { name: IconName; size?: number }) {
  return (
    <svg
      class="ico"
      width={props.size ?? 16}
      height={props.size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {paths[props.name]()}
    </svg>
  );
}
