/** Single-line text input with the app's field styling. */
export function TextField(props: {
  ref?: (el: HTMLInputElement) => void;
  value?: string;
  placeholder?: string;
  class?: string;
  "aria-label"?: string;
}) {
  return (
    <input
      ref={props.ref}
      type="text"
      autocomplete="off"
      class={props.class ? `field ${props.class}` : "field"}
      value={props.value ?? ""}
      placeholder={props.placeholder}
      aria-label={props["aria-label"]}
    />
  );
}
