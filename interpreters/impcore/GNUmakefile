
EMCC := emcc
EMCC_CFLAGS := -pedantic -std=c11 -Wall -Wextra -s ASSERTIONS=1
EMCC_LDFLAGS := -s 'EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap", "FS"]'
EMCC_LDLIBS :=
# https://make.mad-scientist.net/papers/advanced-auto-dependency-generation
DEPFLAGS = -MT $@ -MMD -MP -MF _build/deps/$*.d

OUTPUT_JS := ../../src/interpreters/impcore.js
OUTPUT_WASM := ../../public/impcore.wasm

SOURCES := $(wildcard src/*.c)
HEADERS := $(wildcard src/*.h)
OBJECTS := $(patsubst src/%.c, _build/%.o, $(SOURCES))
DEPFILES := $(patsubst src/%.c, _build/deps/%.d, $(SOURCES))

.DEFAULT: all
.PHONY: clean distclean
.SUFFIXES:

all: $(OUTPUT_JS) $(OUTPUT_WASM)

clean:
	$(RM) _build/impcore.html _build/impcore.js _build/impcore.wasm
	$(RM) impcore.patch
	$(RM) _build/*.o
	$(RM) _build/deps/*.d

distclean: clean
	$(RM) $(OUTPUT_JS) $(OUTPUT_WASM)

$(OUTPUT_JS): _build/impcore.js impcore.js.in
	sed >$@ \
		-e '/{{SCRIPT}}/ {' -e 'r _build/impcore.js' -e 'd' -e '}' \
		impcore.js.in

$(OUTPUT_WASM): _build/impcore.wasm
	cp $< $@

# https://www.gnu.org/software/make/manual/html_node/Multiple-Targets.html#Rules-with-Grouped-Targets
_build/impcore.html _build/impcore.js _build/impcore.wasm &: $(OBJECTS)
	$(EMCC) $(EMCC_LDFLAGS) $^ -o _build/impcore.html

_build/%.o: src/%.c _build/deps/%.d
	$(EMCC) $(DEPFLAGS) $(EMCC_CFLAGS) -c $< -o $@

impcore.patch: original src
	$(RM) $@
	diff --recursive --unified --new-file original src > $@ \
		|| if [ $$? -ne 1 ]; then return 1; fi

$(DEPFILES): ; @:

-include $(DEPFILES)

