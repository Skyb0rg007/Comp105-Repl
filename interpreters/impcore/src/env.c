#include "all.h"
/* env.c 55b */
struct Valenv {
    Namelist  xs;
    Valuelist vs;
    // invariant: lists have the same length
};
/* env.c 55c */
Valenv mkValenv(Namelist xs, Valuelist vs) {
    Valenv e = malloc(sizeof(*e));
    assert(e != NULL);
    assert(lengthNL(xs) == lengthVL(vs));
    e->xs = xs;
    e->vs = vs;
    return e;
}
/* env.c 55d */
static Value* findval(Name x, Valenv env) {
    Namelist  xs;
    Valuelist vs;

    for (xs=env->xs, vs=env->vs; xs && vs; xs=xs->tl, vs=vs->tl)
        if (x == xs->hd)
            return &vs->hd;
    return NULL;
}
/* env.c 56a */
bool isvalbound(Name name, Valenv env) {
    return findval(name, env) != NULL;
}
/* env.c 56b */
Value fetchval(Name name, Valenv env) {
    Value *vp = findval(name, env);
    assert(vp != NULL);
    return *vp;
}
/* env.c 56c */
void bindval(Name name, Value val, Valenv env) {
    Value *vp = findval(name, env);
    if (vp != NULL)
        *vp = val;              // safe optimization
    else {
        env->xs = mkNL(name, env->xs);
        env->vs = mkVL(val,  env->vs);
    }
}
/* env.c S300c */
struct Funenv {
    Namelist xs;
    Funclist funs;
    // invariant: both lists are the same length
};
/* env.c S300d */
Funenv mkFunenv(Namelist xs, Funclist funs) {
    Funenv env = malloc(sizeof *env);
    assert(env != NULL);
    assert(lengthNL(xs) == lengthFL(funs));
    env->xs = xs;
    env->funs = funs;
    return env;
}
/* env.c S300e */
static Func* findfun(Name name, Funenv env) {
    Namelist xs   = env->xs;
    Funclist funs = env->funs;

    for ( ; xs && funs; xs = xs->tl, funs = funs->tl)
        if (name == xs->hd)
            return &funs->hd;
    return NULL;
}
/* env.c S300f */
bool isfunbound(Name name, Funenv env) {
    return findfun(name, env) != NULL;
}
/* env.c S301a */
Func fetchfun(Name name, Funenv env) {
    Func *fp = findfun(name, env);
    assert(fp != NULL);
    return *fp;
}
/* env.c S301b */
void bindfun(Name name, Func fun, Funenv env) {
    Func *fp = findfun(name, env);
    if (fp != NULL)
        *fp = fun;              // safe optimization
    else {
        env->xs   = mkNL(name, env->xs);
        env->funs = mkFL(fun,  env->funs);
    }
}
/* env.c S301c */
void dump_fenv_names(Funenv env) {
    Namelist xs;
    if (env)
        for (xs = env->xs; xs; xs = xs->tl)
            print("%n\n", xs->hd);
}
