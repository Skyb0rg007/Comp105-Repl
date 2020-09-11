// vim: set tw=2 sw=2:
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Terminal.module.css';
import { InterpContext } from '../../contexts/InterpContext';

const TerminalMessage = ({ content }) => {
  return (<div style={styles.message}>{content}</div>)
};
TerminalMessage.propTypes = {
  content: PropTypes.node
};

// These are the actions that the Terminal will take that manipulate its state
export const TerminalContext = React.createContext({
  stdout: [], // ReactDOM.node array
  pushToStdout: node => undefined, // ReactDOM.node -> unit
  clearStdout: () => undefined, // unit -> unit
  history: [], // string array
  pushToHistory: line => undefined, // string -> unit
  scrollUp: inputRef => undefined, // ReactDOM.node -> unit
  scrollDown: inputRef => undefined, // ReactDOM.node -> unit
});

// Provider for the TerminalContext from an external stdout state
export const TerminalContextProvider = ({ stdout, setStdout, children }) => {
  const [history, setHistory] = React.useState([]);
  const [historyPos, setHistoryPos] = React.useState(null);
  const [prevHistoryPos, setPrevHistoryPos] = React.useState(null);
  const pushToStdout = node => {
    stdout.push(node);
    setStdout(stdout);
  };
  const pushToHistory = line => {
    history.push(line);
    setHistory(history);
  };
  const clearStdout = () => setStdout([]);
  const scrollUp = inputRef => {
    throw new Error('Scroll up');
  };
  const scrollDown = inputRef => {
    throw new Error('Scroll down');
  };
  return (
    <TerminalContext.Provider value={{
      stdout,
      pushToStdout,
      clearStdout,
      history,
      pushToHistory,
      scrollUp,
      scrollDown
    }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const Terminal = ({ promptLabel }) => {
  const ctx = React.useContext(TerminalContext);
  // The <input> element
  const inputRef = React.useRef(null);

  const focusTerminal = () => {
    if (inputRef.current) {
      const isTextSelected = window.getSelection().type === 'Range';
      if (!isTextSelected)
        inputRef.current.focus();
    }
  };
  const handleInput = event => {
    switch (event.key) {
      case 'Enter':
        const rawInput = inputRef.current.value;
        ctx.pushHistory(rawInput);
        const echo = <span>{promptLabel} {rawInput}</span>;
        ctx.pushStdout(echo);
        break;
      case 'ArrowUp': 
        ctx.scrollUp(inputRef.current);
        break;
      case 'ArrowDown':
        ctx.scrollDown(inputRef.current);
        break;
      default:
        // Ctrl + L
        if (event.ctrlKey && event.keyCode === 76) {
          ctx.clearStdout();
          event.preventDefault();
        }
        break;
    }
  };
  // Focus on load
  React.useEffect(() => {
    focusTerminal();
  }, [inputRef]);

  return (
    <div style={styles.container} onClick={focusTerminal}>
      <div style={styles.content}>
        {/* Stdout */}
        {ctx.stdout.map((line, i) => (
          <TerminalMessage key={i} content={line} />
        ))}
        {/* Input area */}
        <div style={styles.inputArea}>
          {/* Prompt Label */}
          <span style={styles.promptLabel}>{promptLabel}</span>
          {/* Input */}
          <input
          ref={inputRef}
          style={styles.input}
          type='text'
          autoComplete='off'
          onKeyDown={handleInput}
        />
          </div>
        </div>
      </div>
  );
};
Terminal.propTypes = {
  promptLabel: PropTypes.string.isRequired,
  runCommand: PropTypes.string.isRequired
};

