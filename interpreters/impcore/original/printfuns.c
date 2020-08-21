#include "all.h"
/* printfuns.c S192b */
void printname(Printbuf output, va_list_box *box) {
    Name np = va_arg(box->ap, Name);
    bufputs(output, np == NULL ? "<null>" : nametostr(np));
}
/* printfuns.c S192c */
void printchar(Printbuf output, va_list_box *box) {
    int c = va_arg(box->ap, int);
    bufput(output, c);
}
/* printfuns.c S192e */
void printpar(Printbuf output, va_list_box *box) {
    Par p = va_arg(box->ap, Par);
    if (p == NULL) {
        bprint(output, "<null>");
        return;
    }

    switch (p->alt){
    case ATOM:
        bprint(output, "%n", p->atom);
        break;
    case LIST:
        bprint(output, "(%P)", p->list);
        break;
    }
}
/* printfuns.c S297g */
void printexp(Printbuf output, va_list_box *box) {
    Exp e = va_arg(box->ap, Exp);
    if (e == NULL) {
        bprint(output, "<null>");
        return;
    }

    switch (e->alt){
    case LITERAL:
        bprint(output, "%v", e->literal);
        break;
    case VAR:
        bprint(output, "%n", e->var);
        break;
    case SET:
        bprint(output, "(set %n %e)", e->set.name, e->set.exp);
        break;
    case IFX:
        bprint(output, "(if %e %e %e)", e->ifx.cond, e->ifx.truex, e->ifx.falsex
                                                                              );
        break;
    case WHILEX:
        bprint(output, "(while %e %e)", e->whilex.cond, e->whilex.exp);
        break;
    case BEGIN:
        bprint(output, "(begin%s%E)", e->begin?" ":"", e->begin);
        break;
    case APPLY:
        bprint(output, "(%n%s%E)", e->apply.name,
                      e->apply.actuals?" ":"", e->apply.actuals);
        break;
    }
}
/* printfuns.c S298a */
void printdef(Printbuf output, va_list_box *box) {
    Def d = va_arg(box->ap, Def);
    if (d == NULL) {
        bprint(output, "<null>");
        return;
    }

    switch (d->alt) {
    case VAL:
        bprint(output, "(val %n %e)", d->val.name, d->val.exp);
        break;
    case EXP:
        bprint(output, "%e", d->exp);
        break;
    case DEFINE:
        bprint(output, "(define %n (%N) %e)", d->define.name,
                      d->define.userfun.formals,
              d->define.userfun.body);
        break;
    }
}
/* printfuns.c S298b */
void printxdef(Printbuf output, va_list_box *box) {
    XDef d = va_arg(box->ap, XDef);
    if (d == NULL) {
        bprint(output, "<null>");
        return;
    }

    switch (d->alt) {
    case USE:
        bprint(output, "(use %n)", d->use);
        break;
    case TEST:
        /* print unit test [[d->test]] to file [[output]] S299a */
        {   UnitTest t = d->test;
            switch (t->alt) {
            case CHECK_EXPECT:
                bprint(output, "(check-expect %e %e)",
                       t->check_expect.check, t->check_expect.expect);
                break;
            case CHECK_ASSERT:
                bprint(output, "(check-assert %e)", t->check_assert);
                break;
            case CHECK_ERROR:
                bprint(output, "(check-error %e)", t->check_error);
                break;
            default:
                assert(0);
            }
        }
        break;
    case DEF:
        bprint(output, "%t", d->def);
        break;
    }
    assert(0);
}
/* printfuns.c S299b */
void printvalue(Printbuf output, va_list_box *box) {
    Value v = va_arg(box->ap, Value);
    bprint(output, "%d", v);
}
/* printfuns.c S299c */
void printfun(Printbuf output, va_list_box *box) {
    Func f = va_arg(box->ap, Func);
    switch (f.alt) {
    case PRIMITIVE:
        bprint(output, "<%n>", f.primitive);
        break;
    case USERDEF:
        bprint(output, "<userfun (%N) %e>", f.userdef.formals, f.userdef.body);
        break;
    default:
        assert(0);
    }
}
