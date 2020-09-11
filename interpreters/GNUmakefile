
INTERPRETERS := impcore uscheme tuscheme usmalltalk

.DEFAULT: all
.PHONY: all clean distclean $(INTERPRETERS)
.SUFFIXES:

all: $(INTERPRETERS)

# Remove all intermediate files
# This should be done to get to a pre-commit state
clean:
	for interp in $(INTERPRETERS); do $(MAKE) -C $$interp clean; done

# Additionally remove all final source files
# This should not be done before commit, since it breaks the site
distclean:
	for interp in $(INTERPRETERS); do $(MAKE) -C $$interp distclean; done

# GNU makefile function to create targets for each interpreter
$(foreach interp, $(INTERPRETERS), $(eval $(interp): ; $$(MAKE) -C $(interp) all))

