
(* The mlscheme program uses 'getEnv' do determine certain settings.
 * This stub ensures that those lookups are always false.
 *)
structure OS =
struct
    structure Process =
    struct
        fun getEnv "NOERRORLOC" = NONE
          | getEnv "BPCOPTIONS" = NONE
          | getEnv _ = NONE
    end
    end

structure TextIO =
struct
    (* File output is accumulated via this output buffer
     * Since all output operations are to stdout/stderr, we can shortcut.
     * The 'outputBuf' is read + cleared in the driver
     *)
    val outputBuf = ref ""

    type outstream = unit
    val stdOut : outstream = ()
    val stdErr : outstream = ()
    fun output (() : outstream, x : string) : unit = outputBuf := !outputBuf ^ x
    fun print (x : string) : unit = output (stdOut, x)

    (* File input is stored via this JsMap
     * It maps file names to file content.
     * The 'instream' structure also tracks the position in the file.
     * Since writing to a file is never done concurrently with execution,
     * race conditions can be ignored.
     *)
    fun filemap () : JsMap.map = prim("execStmtJS", ("return uscheme_filemap", ""))

    type instream = { name: string, pos: int ref }
    fun inputLine ({ name, pos } : instream) : string option =
        case JsMap.lookup (filemap(), name) of
             NONE => NONE
           | SOME content =>
               let val substr = Substring.extract (content, !pos, NONE)
                   val line = Substring.takel (fn c => c <> #"\n") substr
                   val line_len = Substring.size line
               in  pos := !pos + line_len + 1;
                   SOME (Substring.string line ^ "\n")
               end
    fun openIn (str : string) : instream =
        if JsMap.has (filemap(), str)
        then { name = str, pos = ref 0 }
        else raise Fail "nonexistent file"
    fun closeIn (stream : instream) : unit = ()
    val stdIn : instream = { name = "<stdin>", pos = ref 0 }

end

val print : string -> unit = TextIO.print

