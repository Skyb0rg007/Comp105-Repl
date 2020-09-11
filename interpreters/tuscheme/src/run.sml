
(* Expose interface via the global 'tuscheme' *)

fun clone_basis (basis : basis) : basis =
    ( #1 basis
    , #2 basis
    , List.map (fn (k, ref v) => (k, ref v)) (#3 basis)
    )

val current_basis = ref (clone_basis initialBasis)

fun tuscheme_eval (str : string) : string =
    let val () = TextIO.outputBuf := ""
        val basis = !current_basis
        val xdefs = stringsxdefs ("<website>", String.fields (fn c => c = #"\n") str)
        val basis' = readEvalPrintWith eprintln (xdefs, basis, (NOT_PROMPTING, PRINTING))
        val output = !TextIO.outputBuf
        val () = TextIO.outputBuf := ""
        val () = current_basis := basis'
    in  output
    end

fun tuscheme_reset (str : unit) : unit = current_basis := clone_basis initialBasis

val () =
    JsCore.exec1
    { stmt = "tuscheme_eval = f"
    , arg1 = ("f", JsCore.==> (JsCore.string, JsCore.string))
    , res = JsCore.unit
    }
    tuscheme_eval

val () =
    JsCore.exec1
    { stmt = "tuscheme_reset = f"
    , arg1 = ("f", JsCore.==> (JsCore.unit, JsCore.unit))
    , res = JsCore.unit
    }
    tuscheme_reset


