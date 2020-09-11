
EMCC := emcc
EMCC_CFLAGS := -Wno-shift-negative-value -O3 -Dunix -I_build
EMCC_LDFLAGS := -lnodefs.js -s 'EXPORTED_FUNCTIONS=["_memset", "_main"]' -s 'EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap"]' --embed-file assets
# https://make.mad-scientist.net/papers/advanced-auto-dependency-generation
DEPFLAGS = -MT $@ -MMD -MF _build/deps/$*.d
NODE := node

# Used by config scripts
export EMCC
export NODE

SOURCES := $(wildcard src/*.c)
OBJECTS := $(patsubst src/%.c, _build/%.o, $(SOURCES))
DEPFILES := $(patsubst src/%.c, _build/deps/%.d, $(SOURCES))

.DEFAULT: all
.PHONY: clean distclean
.SUFFIXES:

all: _build/camlrunm.js

clean:
	$(RM) _build/camlrunm.{html,js,wasm,data}
	$(RM) _build/*.o
	$(RM) _build/deps/*.d

distclean: clean
	$(RM) _build/{m,s}.h
	$(RM) -d _build/deps
	$(RM) -d _build

# https://www.gnu.org/software/make/manual/html_node/Multiple-Targets.html#Rules-with-Grouped-Targets
_build/camlrunm.html _build/camlrunm.js _build/camlrunm.wasm &: $(OBJECTS)
	$(EMCC) $(EMCC_LDFLAGS) $^ -o _build/camlrunm.html

_build/%.o: src/%.c _build/deps/%.d _build/m.h _build/s.h | _build _build/deps
	$(EMCC) $(DEPFLAGS) $(EMCC_CFLAGS) -c $< -o $@

_build/m.h: | _build
	case "$$(sh config/runtest.sh config/sizes.c)" in                        \
		"4 4 4") ;;                                                          \
		"4 8 8") echo "#define SIXTYFOUR" >> $@;;                            \
		*)       echo "Caml Light won't run on this architecture."; exit 2;; \
	esac
	case "$$(sh config/runtest.sh config/endian.c)" in                       \
		0) echo "#define MOSML_BIG_ENDIAN" >> $@;;                           \
		1) echo "#undef MOSML_BIG_ENDIAN" >> $@;;                            \
		2) echo "Caml Light won't run on this architecture."; exit 2;;       \
	esac
	echo "#define ALIGNMENT" >> $@
	sh config/runtest.sh config/dblalign.c; case $$? in                      \
	  0) ;;                                                                  \
	  *) echo "#define ALIGN_DOUBLE" >> $@;;                                 \
	esac

_build/s.h: | _build
	rm -f $@
	sh config/runtest.sh config/schar.c; case $$? in                         \
		0) ;;                                                                \
		1) sh config/runtest.sh config/schar2.c; case $$? in                 \
			0) echo "#define SIGNED_CHAR_WORKS" >> $@;;                      \
			*) echo "Unsigned/Signed char doesn't work"; exit 2;;            \
		esac;;                                                               \
	esac
	if sh config/runtest.sh -Dcopy=memmove -Dreverse config/bytecopy.c; then \
	  echo "#define HAS_MEMMOVE" >> $@;                                      \
	fi
	if sh config/runtest.sh -Dcopy=bcopy config/bytecopy.c; then             \
	  echo "#define HAS_BCOPY" >> $@;                                        \
	fi
	if sh config/runtest.sh -Dcopy=memcpy -Dreverse config/bytecopy.c; then  \
	  echo "#define HAS_MEMCPY" >> $@;                                       \
	fi
	sh config/runtest.sh config/setjmp.c >/dev/null 2>&1; case $$? in        \
	  0) echo "#define HAS__SETJMP" >> $@;;                                  \
	  *)                                                                     \
	esac
	echo "#define sighandler_return_type void" >> $@
	if sh config/runtest.sh config/signals.c; then                           \
		echo "#define BSD_SIGNALS" >> $@;                                    \
	fi
	echo "#define HAS_STRERROR" >> $@
	: "Don't test for unix library, we don't need it"

$(DEPFILES): ; @:

_build:
	mkdir -p $@
_build/deps:
	mkdir -p $@

-include $(DEPFILES)
