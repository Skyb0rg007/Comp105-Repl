
(* Interface into the JavaScript 'Map' class, with string keys + values *)

signature JS_MAP =
sig

    type map

    val empty : unit -> map
    val fromList : (string * string) list -> map
    val copy : map -> map
    val get : map * string -> string (* Unsafe! *)
    val has : map * string -> bool
    val set : map * string * string -> unit
    val lookup : map * string -> string option
    val clear : map -> unit
    val delete : map * string -> bool
    val size : map -> int
    val forEach : map -> (string * string -> unit) -> unit

end

