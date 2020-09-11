
structure JsMap : JS_MAP =
struct
    structure J = JsCore

    type map = foreignptr

    fun empty () = J.exec0
        { stmt = "return new Map()"
        , res = J.fptr
        } ()
    fun clear m = J.exec1
        { stmt = "m.clear()"
        , res = J.unit
        , arg1 = ("m", J.fptr)
        } m
    fun copy m = J.exec1
        { stmt = "return new Map(m)"
        , res = J.fptr
        , arg1 = ("m", J.fptr)
        } m
    fun fromList xs =
        prim("execStmtJS", ("return new Map(xs)", "xs", xs))
    fun get (m, k) = J.exec2
        { stmt = "return m.get(k)"
        , res = J.string
        , arg1 = ("m", J.fptr)
        , arg2 = ("k", J.string)
        } (m, k)
    fun has (m, k) = J.exec2
        { stmt = "return m.has(k)"
        , res = J.bool
        , arg1 = ("m", J.fptr)
        , arg2 = ("k", J.string)
        } (m, k)
    fun set (m, k, v) = J.exec3
        { stmt = "m.set(k, v)"
        , res = J.unit
        , arg1 = ("m", J.fptr)
        , arg2 = ("k", J.string)
        , arg3 = ("v", J.string)
        } (m, k, v)
    fun delete (m, k) = J.exec2
        { stmt = "return m.delete(k)"
        , res = J.bool
        , arg1 = ("m", J.fptr)
        , arg2 = ("k", J.string)
        } (m, k)
    fun size m = J.exec1
        { stmt = "return m.size"
        , res = J.int
        , arg1 = ("m", J.fptr)
        } m
    fun forEach m f = J.exec2
        { stmt = "m.forEach(function(v, k) { f([k, v]); })"
        , res = J.unit
        , arg1 = ("m", J.fptr)
        , arg2 = ("f", J.===> (J.string, J.string, J.unit))
        } (m, f)
    fun lookup (m, k) =
        if has (m, k)
        then SOME (get (m, k))
        else NONE
end

