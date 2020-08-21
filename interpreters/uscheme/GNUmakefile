
SMLTOJS := smltojs
CLOSURE_COMPILER := google-closure-compiler

OUTPUT_JS := ../../src/interpreters/uscheme.js

SOURCES := $(addprefix src/, \
	JS_MAP.sig               \
	JsMap.sml                \
	stubs.sml                \
	run.sml                  \
	mlscheme.sml             \
	uscheme.mlb              \
	)

.DEFAULT: all
.PHONY: clean distclean
.SUFFIXES:

all: $(OUTPUT_JS)

clean:
	$(RM) -r MLB src/MLB
	$(RM) _build/index.html _build/amalg.js _build/optimized.js

distclean: clean
	$(RM) $(OUTPUT_JS)
	$(RM) -d _build

_build/index.html: $(SOURCES) | _build
	$(SMLTOJS) --output _build/index src/uscheme.mlb
	$(RM) -r MLB

_build/amalg.js: _build/index.html
	sed -n 's/.*src="\(.*\)".*/\1/p' $< | xargs cat >$@

_build/optimized.js: _build/amalg.js
	# $(CLOSURE_COMPILER) --jscomp_off='*' --js=$< --js_output_file=$@
	cp $< $@

$(OUTPUT_JS): _build/optimized.js uscheme.js.in
	sed >$@ \
		-e '/{{SCRIPT}}/ {' -e 'r _build/optimized.js' -e 'd' -e '}' \
		uscheme.js.in

_build:
	mkdir -p $@

