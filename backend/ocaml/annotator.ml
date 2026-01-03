(* Simple OCaml Annotator Fallback *)

type style = Inline | Block | Color | SideBySide

let escape_regexp str =
  let re = Str.regexp "[.*+?^${}()|[\\]\\\\]" in
  Str.global_replace re "\\\\\\0" str

let annotate_inline text keywords =
  let pattern = "\\b\\(" ^ (String.concat "\\|" (List.map escape_regexp keywords)) ^ "\\)\\b" in
  let re = Str.regexp pattern in
  Str.global_replace re "\\0 /*:\\0:*/" text

let annotate_block text keywords =
  let lines = String.split_on_char '\n' text in
  let annotated_lines = List.map (fun line ->
    match List.find_opt (fun kw -> Str.string_match (Str.regexp (".*" ^ (escape_regexp kw) ^ ".*")) line 0) keywords with
    | Some kw -> "/* annotated: " ^ kw ^ " */\n" ^ line
    | None -> line
  ) lines in
  String.concat "\n" annotated_lines

let annotate_color text keywords =
  let pattern = "\\b\\(" ^ (String.concat "\\|" (List.map escape_regexp keywords)) ^ "\\)\\b" in
  let re = Str.regexp pattern in
  Str.global_replace re "\027[35m\\0\027[0m" text

let annotate text keywords style =
  match style with
  | Inline -> annotate_inline text keywords
  | Block -> annotate_block text keywords
  | Color -> annotate_color text keywords
  | SideBySide -> text (* Simplified fallback *)

