
fun clone_basis (basis : basis) : basis =
    List.map (fn (k, ref v) => (k, ref v)) basis

val current_basis = ref (clone_basis initialBasis)

fun usmalltalk_eval (str : string) : string =
    let val () = TextIO.outputBuf := ""
        val basis = !current_basis
        val xdefs = stringsxdefs ("<website>", String.fields (fn c => c = #"\n") str)
        val basis' = readEvalPrintWith eprintln (xdefs, basis, (NOT_PROMPTING, PRINTING))
        val output = !TextIO.outputBuf
        val () = TextIO.outputBuf := ""
        val () = current_basis := basis'
    in  output
    end

fun usmalltalk_reset (str : unit) : unit = current_basis := clone_basis initialBasis

val () =
    JsCore.exec1
    { stmt = "usmalltalk_eval = f"
    , arg1 = ("f", JsCore.==> (JsCore.string, JsCore.string))
    , res = JsCore.unit
    }
    usmalltalk_eval

val () =
    JsCore.exec1
    { stmt = "usmalltalk_reset = f"
    , arg1 = ("f", JsCore.==> (JsCore.unit, JsCore.unit))
    , res = JsCore.unit
    }
    usmalltalk_reset


