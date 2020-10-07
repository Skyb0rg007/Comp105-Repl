import React from 'react';

export const TerminalContext = React.createContext();

export const TerminalContextProvider = ({ stdout, setStdout, children }) => {
  const [history, setHistory] = React.useState([]);
  const [historyPos, setHistoryPos] = React.useState(null);
  const [prevHistoryPos, setPrevHistoryPos] = React.useState(null);
  const [promptLabel, setPromptLabel] = React.useState('>');
  // React.useEffect(() => {
    // const id = setInterval(() => console.log(stdout), 1000);
    // return () => clearInterval(id);
  // }, [stdout]);
  const pushToStdout = node => {
    setStdout([...stdout, node]);
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
      stdout,        // ReactDOM.node list
      pushToStdout,  // ReactDOM.node -> unit
      clearStdout,   // unit -> unit
      pushToHistory, // string -> unit
      scrollUp,      // ReactDOM.node -> unit
      scrollDown,    // ReactDOM.node -> unit
      promptLabel,   // string
      setPromptLabel // string -> unit
    }}>
      {children}
    </TerminalContext.Provider>
  );
};

