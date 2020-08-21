import React from 'react';
import Terminal from './react-console-emulator/Terminal';
import { InterpContext } from '../contexts/InterpContext';

// Creates the repl
// Uses InterpContext.eval to evaluate messages
// Use the ref.pushToStdout method to asynchronously add to the output
export const Repl = React.forwardRef((_props, ref) => {
  const interp = React.useContext(InterpContext);
  const terminalRef = React.useRef(null);
  const pushToStdout = str => {
    str.split('\n').forEach(terminalRef.current.pushToStdout);
  };
  const clearStdout = () => {
    return terminalRef.current.clearStdout();
  };
  React.useImperativeHandle(ref, () => ({ pushToStdout, clearStdout }));
  React.useEffect(() => {
    const welcome = `
      Welcome to ${interp.name}!
      Use Ctrl+L to clear the terminal screen
    `;
    if (interp && terminalRef.current) {
      clearStdout().then(() => {
        pushToStdout(welcome);
      });
    }
  }, [interp, terminalRef]);

  return (
    <Terminal
      promptLabel=">"
      autoFocus={true}
      noDefaults={true}
      runCommand={str => { interp.eval(str).then(pushToStdout); }}
      noNewlineParsing={true}
      ref={terminalRef}
    />
  );
});

Repl.propTypes = {
};

