# Makefile for the Moscow ML 2.10 version of the Caml Light runtime system

OPTS=-DTHREADED
include ../Makefile.inc

BASECFLAGS= -Dunix -O3 $(OPTS)

ifeq ($(UNAME_S),Cross_W32)
	BASECFLAGS= -Dunix -DCAMLRT -DWIN32 -D_CONSOLE -D_MBCS -O3 $(OPTS)
endif

BASEOBJS=interp.o expand.o misc.o stacks.o fix_code.o main.o fail.o signals.o \
  freelist.o major_gc.o minor_gc.o memory.o alloc.o roots.o \
  compare.o ints.o floats.o str.o io.o \
  extern.o externcp.o intern.o interncp.o \
  hash.o sys.o meta.o parsing.o lexing.o gc_ctrl.o mosml.o unix.o \
  runtime.o md5sum.o callback.o

DOBJS=$(OBJS:.o=.d.o) debugger.d.o

UNIXPRIMS=compare.c extern.c externcp.c floats.c gc_ctrl.c hash.c \
  intern.c interncp.c interp.c ints.c io.c lexing.c meta.c parsing.c \
  str.c sys.c mosml.c unix.c md5sum.c callback.c

DOSPRIMS=compare.c extern.c externcp.c floats.c gc_ctrl.c hash.c \
  intern.c interncp.c interp.c ints.c io.c lexing.c meta.c parsing.c \
  str.c sys.c graph.c mosml.c msdos.c md5sum.c

BASEPRIMS=$(UNIXPRIMS)

PRIMS=$(BASEPRIMS)
OBJS=$(BASEOBJS) $(ADDOBJS)
LIBS=$(BASELIBS) $(ADDRUNLIBS)
CFLAGS=$(BASECFLAGS) $(ADDRUNCFLAGS)

all: camlrunm$(EXE)

camlrunm$(EXE): $(OBJS) prims.o
	$(LD) -o camlrunm$(EXE) prims.o $(OBJS) $(LIBS)
	$(STRIP) camlrunm$(EXE)

camlrunmd$(EXE): $(DOBJS) prims.d.o
	$(LD) $(CFLAGS) -o camlrunmd$(EXE) prims.d.o $(DOBJS) $(LIBS)


# For cross compiling to WIN32
camlrt.dll: $(OBJS) prims.o
	$(DYNLD) -o camlrt.dll prims.o $(OBJS) $(LIBS) -mconsole
#        $(CC) $(CFLAGS) /Fecamlrt.dll prims.obj $(OBJS) $(LIBS) /link /subsystem:console /def:"mosmldll.def"
#        $(CC) $(CFLAGS) /Fecamlrt.dll prims.obj $(OBJS) $(LIBS) /link /subsystem:console


clean:
	rm -f camlrunm$(EXE) camlrunmd$(EXE) *.o *.a
	rm -f primitives prims.c opnames.h jumptbl.h
	rm -f .debugobj/*.o
	rm -f m.h s.h

install:
	${INSTALL_PROGRAM} camlrunm$(EXE) $(DESTDIR)$(BINDIR)
	${INSTALL_PROGRAM} camlrunm$(EXE) $(DESTDIR)$(LIBDIR)
	${INSTALL_DATA} *.h $(DESTDIR)$(INCDIR)

uninstall:
	${UNINSTALL_PROGRAM} $(DESTDIR)$(BINDIR)/camlrunm$(EXE)
	${UNINSTALL_PROGRAM} $(DESTDIR)$(LIBDIR)/camlrunm$(EXE)
	cd $(DESTDIR)$(INCDIR) && ${UNINSTALL_DATA} *.h

install_w32: camlrt.dll
	${INSTALL_PROGRAM} camlrt.dll $(DESTDIR)$(BINDIR)
	${INSTALL_PROGRAM} camlrt.dll $(DESTDIR)$(LIBDIR)
	${INSTALL_DATA} *.h $(DESTDIR)$(INCDIR)

uninstall_w32:
	${UNINSTALL_PROGRAM} $(DESTDIR)$(BINDIR)/camlrt.dll
	${UNINSTALL_PROGRAM} $(DESTDIR)$(LIBDIR)/camlrt.dll
	cd $(DESTDIR}$(INCDIR) && ${UNINSTALL_DATA} *.h

primitives : $(PRIMS)
	sed -n -e '/\/\* ML \*\//s/.* \([a-zA-Z0-9_][a-zA-Z0-9_]*\) *(.*/\1/p' \
                $(PRIMS) > primitives2
	sh -c 'if cmp -s primitives primitives2; \
        then rm primitives2; \
        else mv primitives2 primitives; \
        fi'

prims.c : primitives
	(echo '#include "mlvalues.h"'; \
	 echo '#include "prims.h"'; \
	 sed -e 's/.*/extern value &();/' primitives; \
	 echo 'c_primitive cprim[] = {'; \
	 sed -e 's/.*/  &,/' primitives; \
	 echo '  0 };'; \
         echo 'char * names_of_cprim[] = {'; \
	 sed -e 's/.*/  "&",/' primitives; \
	 echo '  0 };') > prims.c

opnames.h : instruct.h
	sed -e '/\/\*/d' \
            -e 's/enum /char * names_of_/' \
            -e 's/{$$/[] = {/' \
            -e 's/\([A-Z][A-Z_0-9]*\)/"\1"/g' instruct.h > opnames.h

# jumptbl.h is required only if you have GCC 2.0 or later
jumptbl.h : instruct.h
	awk -f ../tools/make-jumptbl instruct.h > jumptbl.h

.SUFFIXES: .d.o

.c.d.o:
	sh -c 'if  [ ! -d .debugobj ] ; then mkdir .debugobj; fi'
	cd .debugobj; $(CC) -Dunix -c -g -I.. -I.. -DDEBUG $(OPTS) ../$<
	mv .debugobj/$*.o $*.d.o

depend : prims.c opnames.h jumptbl.h
	mv Makefile Makefile.bak
	(sed -n -e '1,/^### DO NOT DELETE THIS LINE/p' Makefile.bak;	 \
         gcc -MM -I.. $(OPTS) *.c; \
         gcc -MM -I.. $(OPTS) -DDEBUG *.c | sed -e 's/\.o/.d.o/') > Makefile
	rm Makefile.bak

### EVERYTHING THAT GOES BEYOND THIS COMMENT WILL BE ERASED WITHOUT WARNING
### DO NOT DELETE THIS LINE
debugger.o: debugger.c
