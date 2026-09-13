/** Minimal builders for Blockly serialized workspace state. */

export interface B {
  type: string;
  fields?: Record<string, unknown>;
  inputs?: Record<string, In>;
  extraState?: unknown;
  next?: { block: B };
  x?: number;
  y?: number;
}
export type In = { block?: B; shadow?: B };

export const b = (type: string, fields?: Record<string, unknown>, inputs?: Record<string, In>): B => ({
  type,
  fields,
  inputs,
});

/** Variadic block (text_join / lists_create_with) with ADD0..n inputs. */
export const items = (type: string, ...ins: In[]): In => ({
  block: { ...b(type), extraState: { itemCount: ins.length }, inputs: Object.fromEntries(ins.map((it, i) => [`ADD${i}`, it])) },
});

export const num = (n: number) => ({ shadow: b("math_number", { NUM: n }) });
export const txt = (t: string) => ({ shadow: b("text", { TEXT: t }) });
export const colour = (c: string) => ({ shadow: b("colour_picker", { COLOUR: c }) });
export const v = (name: string) => ({ block: b("variables_get", { VAR: { id: name } }) });
export const set = (name: string, value: In) => b("variables_set", { VAR: { id: name } }, { VALUE: value });
export const change = (name: string, by: number | In) =>
  b("math_change", { VAR: { id: name } }, { DELTA: typeof by === "number" ? num(by) : by });
export const math = (op: string, a: In, c: In): In => ({ block: b("math_arithmetic", { OP: op }, { A: a, B: c }) });
export const cmp = (op: string, a: In, c: In): In => ({ block: b("logic_compare", { OP: op }, { A: a, B: c }) });

/** Chain statements into a linked list. */
export const seq = (...blocks: B[]): B => {
  for (let i = blocks.length - 2; i >= 0; i--) blocks[i].next = { block: blocks[i + 1] };
  return blocks[0];
};

export const hat = (type: string, body: B, fields?: Record<string, unknown>, inputs?: Record<string, In>, x = 20, y = 20): B => ({
  ...b(type, fields, { ...inputs, DO: { block: body } }),
  x,
  y,
});

export const program = (vars: string[], ...top: B[]) => ({
  variables: vars.map((name) => ({ name, id: name })),
  blocks: { languageVersion: 0, blocks: top },
});
