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

export const b = (
  type: string,
  fields?: Record<string, unknown>,
  inputs?: Record<string, In>,
  extraState?: unknown,
): B => {
  const out: B = { type };
  if (fields) out.fields = fields;
  if (inputs) out.inputs = inputs;
  if (extraState !== undefined) out.extraState = extraState;
  return out;
};

export const bool = (on: boolean): In => ({ block: b("logic_boolean", { BOOL: on ? "TRUE" : "FALSE" }) });
const slot = (i: number) => String.fromCharCode(65 + i);
const logicOp = (op: string, ins: In[]): In => ({
  block: b(
    "logic_operation",
    { OP: op },
    Object.fromEntries(ins.map((it, i) => [slot(i), it])),
    ins.length > 2 ? { itemCount: ins.length } : undefined,
  ),
});
export const and = (...ins: In[]): In => logicOp("AND", ins);
export const or = (...ins: In[]): In => logicOp("OR", ins);
export const iff = (cond: In, then: B, els?: B) =>
  els
    ? b("controls_if", undefined, { IF0: cond, DO0: { block: then }, ELSE: { block: els } }, { hasElse: true })
    : b("controls_if", undefined, { IF0: cond, DO0: { block: then } });

export const emptyList = (): In => ({ block: b("lists_create_with", undefined, undefined, { itemCount: 0 }) });
export const emptyDict = (): In => ({ block: b("dict_create") });
export const dget = (dict: In, key: string): In => ({ block: b("dict_get", undefined, { KEY: txt(key), DICT: dict }) });
export const dset = (dict: In, key: string, value: In) =>
  b("dict_set", undefined, { KEY: txt(key), DICT: dict, VALUE: value });
export const getAt = (list: In, at: In): In => ({
  block: b("lists_getIndex", { MODE: "GET", WHERE: "FROM_START" }, { VALUE: list, AT: at }),
});
export const append = (list: In, item: In) =>
  b("lists_setIndex", { MODE: "INSERT", WHERE: "LAST" }, { LIST: list, TO: item });

export const constrain = (value: In, lo: number, hi: number): In => ({
  block: b("math_constrain", undefined, { VALUE: value, LOW: num(lo), HIGH: num(hi) }),
});
export const keyDown = (key: string): In => ({ block: b("input_key", { KEY: key }) });

export const defn = (name: string, body: B, x: number, y: number): B => ({
  ...b("procedures_defnoreturn", { NAME: name }, { STACK: { block: body } }),
  x,
  y,
});
export const call = (name: string) => b("procedures_callnoreturn", { NAME: name }, undefined, { name });

export const forVar = (name: string, from: number, to: number, body: B) =>
  b("controls_for", { VAR: { id: name } }, { FROM: num(from), TO: num(to), BY: num(1), DO: { block: body } });
export const each = (name: string, list: In, body: B) =>
  b("controls_forEach", { VAR: { id: name } }, { LIST: list, DO: { block: body } });

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
