
(* Expose interface via the global 'uscheme' *)

fun clone_basis (basis : basis) : basis =
    List.map (fn (k, ref v) => (k, ref v)) basis

val current_basis = ref (clone_basis initialBasis)

fun uscheme_eval (str : string) : string =
    let val () = TextIO.outputBuf := ""
        val basis = !current_basis
        val xdefs = stringsxdefs ("<website>", String.fields (fn c => c = #"\n") str)
        val basis' = readEvalPrintWith eprintln (xdefs, basis, (NOT_PROMPTING, PRINTING))
        val output = !TextIO.outputBuf
        val () = TextIO.outputBuf := ""
        val () = current_basis := basis'
    in  output
    end

fun uscheme_reset (str : unit) : unit = current_basis := clone_basis initialBasis

val () = prim("execStmtJS", ("uscheme_eval = f", "f", uscheme_eval))
val () = prim("execStmtJS", ("uscheme_reset = f", "f", uscheme_reset))

