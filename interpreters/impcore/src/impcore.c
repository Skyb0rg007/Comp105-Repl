#ifndef __EMSCRIPTEN__
#  error "This file is meant to be compiled with emscripten"
#endif

#include <emscripten.h>
#include "all.h"

// Globals
bool read_tick_as_quote = false;
Valenv globals;
Funenv functions;

// Evaluate
void EMSCRIPTEN_KEEPALIVE impcore_eval(const char *defs)
{
    XDefstream xdefs = stringxdefs("impcore.eval", defs);
    if (setjmp(errorjmp))
        return;
    readevalprint(xdefs, globals, functions, ECHOES);
}

// Initialize the environment
int EMSCRIPTEN_KEEPALIVE main(void)
{
    set_toplevel_error_format(WITHOUT_LOCATIONS);

    installprinter('c', printchar);
    installprinter('d', printdecimal);
    installprinter('e', printexp);
    installprinter('E', printexplist);
    installprinter('f', printfun);
    installprinter('n', printname);
    installprinter('N', printnamelist);
    installprinter('p', printpar);
    installprinter('P', printparlist);
    installprinter('s', printstring);
    installprinter('t', printdef);
    installprinter('v', printvalue);
    installprinter('V', printvaluelist);
    installprinter('%', printpercent);

    globals = mkValenv(NULL, NULL);
    functions = mkFunenv(NULL, NULL);

    {
        static const char *prims[] = {
            "+", "-", "*", "/", "<", ">", "=", "println", "print", "printu", 0
        };
        for (const char **p = prims; *p; p++) {
            Name x = strtoname(*p);
            bindfun(x, mkPrimitive(x), functions);
        }
    }

    {
        const char *fundefs = 
            ";  predefined Impcore functions 23a \n"
            "(define and (b c) (if b c b))\n"
            "(define or  (b c) (if b b c))\n"
            "(define not (b)   (if b 0 1))\n"
            ";  predefined Impcore functions 23b \n"
            "(define <= (x y) (not (> x y)))\n"
            "(define >= (x y) (not (< x y)))\n"
            "(define != (x y) (not (= x y)))\n"
            ";  predefined Impcore functions 23c \n"
            "(define mod (m n) (- m (* n (/ m n))))\n"
            "(define negated (n) (- 0 n))\n";
        if (setjmp(errorjmp))
            assert(0); // if error in predefined function, die horribly
        readevalprint(stringxdefs("predefined functions", fundefs), globals, functions, NO_ECHOES);
    }

    /* Note: emscripten doesn't really exit here */
    return EXIT_SUCCESS;
}

