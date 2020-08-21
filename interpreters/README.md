
# Interface:


Each interpreter produces the interface file 'src/interpreters/%LANG%.js',
which returns a JavaScript class with the following fields + methods:

* name : String
  - The name the interpreter uses
* mode : String
  - The CodeMirror mode the editor should use
* autoCloseBrackets : String
  - CodeMirror setting determining which brackets to auto-close
* extension : String
  - The interpreter language's file extension (including the dot)
* setFilemap : Map<String, String> -> Promise<Unit>
  - Sets the filesystem used by the interpreter
* eval : string -> string promise
  - Evaluates the given string, returning any output
* reset : string -> unit promise
  - Resets the interpreter environment
* Constructor should not take arguments

The website imports this class a part of the main bundle, so any
code splitting should be done as a part of the constructor, since
no class instances are created until the user selects the language.
This class instance should only be constructed once per site visit.

