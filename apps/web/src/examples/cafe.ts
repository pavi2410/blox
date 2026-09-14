import {
  and,
  append,
  b,
  call,
  change,
  cmp,
  defn,
  dict,
  each,
  emptyList,
  hat,
  iff,
  items,
  match,
  math,
  num,
  program,
  seq,
  set,
  txt,
  v,
  type In,
} from "./build";

const join = (...ins: In[]) => items("text_join", ...ins);
const ui = (...kids: ReturnType<typeof b>[]): In => ({ block: seq(...kids) });
const show = (...kids: ReturnType<typeof b>[]) => b("ui_show", undefined, { TREE: ui(...kids) });
const col = (...kids: ReturnType<typeof b>[]) => b("ui_column", undefined, { KIDS: ui(...kids) });
const row = (...kids: ReturnType<typeof b>[]) => b("ui_row", undefined, { KIDS: ui(...kids) });
const lab = (t: string | In) => b("ui_label", undefined, { TEXT: typeof t === "string" ? txt(t) : t });
const btn = (label: string, msg: string) => b("ui_button", undefined, { TEXT: txt(label), MSG: txt(msg) });
const field = (id: string) => b("ui_input", undefined, { ID: txt(id) });
const read = (id: string): In => ({ block: b("ui_value", undefined, { ID: txt(id) }) });
const print = (t: In) => b("io_print", undefined, { VALUE: t });
const speak = (t: In) => b("web_speak", undefined, { TEXT: t });
const save = (key: string, value: In) => b("web_store_save", undefined, { VALUE: value, KEY: txt(key) });
const load = (key: string): In => ({ block: b("web_store_load", undefined, { KEY: txt(key) }) });
const toNum = (x: In): In => ({ block: b("conv", { OP: "Number" }, { VALUE: x }) });
const isEmpty = (x: In): In => ({ block: b("text_isEmpty", undefined, { VALUE: x }) });
const listEmpty = (x: In): In => ({ block: b("lists_isEmpty", undefined, { VALUE: x }) });
const get = (dict: In, key: In): In => ({ block: b("dict_get", undefined, { KEY: key, DICT: dict }) });
const has = (dict: In, key: In): In => ({ block: b("dict_has", undefined, { DICT: dict, KEY: key }) });
const eq = (a: In, s: string) => cmp("EQ", a, txt(s));
const mod = (a: In, n: number): In => ({
  block: b("math_modulo", undefined, { DIVIDEND: a, DIVISOR: num(n) }),
});
const when = (msg: string, body: ReturnType<typeof b>): [In, ReturnType<typeof b>] => [txt(msg), body];

const MENU: [string, string, number][] = [
  ["Espresso $3", "espresso", 3],
  ["Latte $4", "latte", 4],
  ["Tea $3", "tea", 3],
  ["Cocoa $4", "cocoa", 4],
  ["Bagel $5", "bagel", 5],
  ["Cake $6", "cake", 6],
  ["Juice $4", "juice", 4],
  ["Water $1", "water", 1],
];

const pairs = (items: [string, string, number][]) => {
  const rows: ReturnType<typeof b>[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const [a, bItem] = [items[i], items[i + 1]];
    rows.push(row(btn(a[0], a[1]), ...(bItem ? [btn(bItem[0], bItem[1])] : [])));
  }
  return rows;
};

const setup = defn(
  "setup",
  seq(
    set("prices", dict(...MENU.map(([, key, price]): [In, In] => [txt(key), num(price)]))),
    set("cart", emptyList()),
    set("subtotal", num(0)),
    set("tip", num(0)),
    set("total", num(0)),
    set("name", txt("friend")),
    set("note", txt("")),
    set("lines", txt("")),
    set("stamp", txt("")),
    set("visits", toNum(load("cafe.visits"))),
    set("screen", txt("home")),
  ),
  20,
  1100,
);

const addItem = defn(
  "add item",
  seq(
    set("price", get(v("prices"), v("msg"))),
    append(v("cart"), join(v("msg"), txt(" $"), v("price"))),
    change("subtotal", v("price")),
    print(join(txt("+ "), v("msg"), txt(" $"), v("price"))),
    call("show"),
  ),
  520,
  1100,
);

const showScreen = defn(
  "show",
  seq(
    set("lines", txt("")),
    each("line", v("cart"), set("lines", join(v("lines"), v("line"), txt(" · ")))),
    set("stamp", txt("")),
    iff(
      and(cmp("EQ", mod(v("visits"), 3), num(0)), cmp("GT", v("visits"), num(0))),
      set("stamp", txt("Stamp card: free drink on us next time.")),
    ),
    match(
      v("screen"),
      [
        [
          txt("home"),
          show(
            col(
              lab("Blox Cafe"),
              lab("Order at the counter. What's your name?"),
              field("name"),
              lab(join(txt("Visits: "), v("visits"))),
              btn("See menu", "menu"),
            ),
          ),
        ],
        [
          txt("menu"),
          show(
            col(
              lab(join(txt("Hi "), v("name"), txt(" — tap to add"))),
              ...pairs(MENU),
              lab(join(txt("Cart: "), v("lines"))),
              lab(join(txt("Subtotal $"), v("subtotal"))),
              row(btn("Checkout", "checkout"), btn("Clear", "clear"), btn("Home", "home")),
            ),
          ),
        ],
        [
          txt("pay"),
          show(
            col(
              lab("Your order"),
              lab(v("lines")),
              lab(join(txt("Subtotal $"), v("subtotal"))),
              lab(join(txt("Tip $"), v("tip"))),
              lab(join(txt("Total $"), v("total"))),
              lab("Note for the barista"),
              field("note"),
              row(btn("No tip", "tip0"), btn("10%", "tip10"), btn("15%", "tip15")),
              row(btn("Pay", "pay"), btn("Back", "menu")),
            ),
          ),
        ],
      ],
      show(
        col(
          lab(join(txt("Thanks, "), v("name"), txt("!"))),
          lab(join(txt("Paid $"), v("total"))),
          lab(join(txt("Note: "), v("note"))),
          lab(v("stamp")),
          lab(join(txt("Visits: "), v("visits"))),
          btn("Order again", "again"),
        ),
      ),
    ),
  ),
  520,
  20,
);

export const cafe = program(
  [
    "msg",
    "screen",
    "name",
    "note",
    "cart",
    "line",
    "lines",
    "prices",
    "price",
    "subtotal",
    "tip",
    "total",
    "visits",
    "stamp",
  ],
  hat("events_start", seq(call("setup"), call("show")), undefined, undefined, 20, 20),
  hat(
    "events_ui",
    seq(
      iff(has(v("prices"), v("msg")), call("add item")),
      match(v("msg"), [
        when(
          "menu",
          seq(
            iff(
              eq(v("screen"), "home"),
              seq(set("name", read("name")), iff(isEmpty(v("name")), set("name", txt("friend")))),
            ),
            set("screen", txt("menu")),
            call("show"),
          ),
        ),
        when("home", seq(set("screen", txt("home")), call("show"))),
        when(
          "checkout",
          iff(
            listEmpty(v("cart")),
            print(txt("Cart is empty")),
            seq(set("tip", num(0)), set("total", v("subtotal")), set("screen", txt("pay")), call("show")),
          ),
        ),
        when("clear", seq(set("cart", emptyList()), set("subtotal", num(0)), print(txt("Cart cleared")), call("show"))),
        when("tip0", seq(set("tip", num(0)), set("total", v("subtotal")), call("show"))),
        when(
          "tip10",
          seq(set("tip", math("MULTIPLY", v("subtotal"), num(0.1))), set("total", math("ADD", v("subtotal"), v("tip"))), call("show")),
        ),
        when(
          "tip15",
          seq(set("tip", math("MULTIPLY", v("subtotal"), num(0.15))), set("total", math("ADD", v("subtotal"), v("tip"))), call("show")),
        ),
        when(
          "pay",
          seq(
            set("note", read("note")),
            iff(isEmpty(v("note")), set("note", txt("none"))),
            change("visits", 1),
            save("cafe.visits", v("visits")),
            print(join(txt("Paid $"), v("total"), txt(" for "), v("name"))),
            speak(join(txt("Thanks "), v("name"))),
            set("screen", txt("done")),
            call("show"),
          ),
        ),
        when("again", seq(call("setup"), call("show"))),
      ]),
    ),
    { VAR: { id: "msg" } },
    undefined,
    20,
    220,
  ),
  showScreen,
  addItem,
  setup,
);
