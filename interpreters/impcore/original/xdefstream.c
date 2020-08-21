#include "all.h"
/* xdefstream.c S185g */
struct XDefstream {
    Parstream pars;                  /* where input comes from */
};
/* xdefstream.c S186a */
XDefstream xdefstream(Parstream pars) {
    XDefstream xdefs = malloc(sizeof(*xdefs));
    assert(xdefs);
    assert(pars);
    xdefs->pars = pars;
    return xdefs;
}
/* xdefstream.c S186b */
XDefstream filexdefs(const char *filename, FILE *input, Prompts prompts) {
    return xdefstream(parstream(filelines(filename, input), prompts));
}
XDefstream stringxdefs(const char *stringname, const char *input) {
    return xdefstream(parstream(stringlines(stringname, input), NO_PROMPTS));
}
/* xdefstream.c S186c */
XDef getxdef(XDefstream xdr) {
    Par p = getpar(xdr->pars);
    if (p == NULL) 
        return NULL;
    else
        return parsexdef(p, parsource(xdr->pars));
}
