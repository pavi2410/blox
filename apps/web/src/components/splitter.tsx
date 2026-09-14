export function Splitter(props: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  const down = (e: PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const start = props.value;
    const move = (ev: PointerEvent) => {
      const next = Math.round(Math.min(props.max, Math.max(props.min, start - (ev.clientX - startX))));
      props.onChange(next);
    };
    const up = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  return <div class="splitter" onPointerDown={down} title="Drag to resize" />;
}
