import React from 'react';

// Contains the entire application state
export const AppContext = React.createContext({
  editor: {
    value: '',
    setValue: _value => undefined
  },
  repl: {
    history: {
      value: [], // To render
      push: _line => undefined, // Add when running commands
      scrollUp: () => undefined, // On up-arrow
      scrollDown: () => undefined // On down-arrow
    },
    stdout: {
      value: [], // To render
      push: _line => undefined, // To add
      clear: () => undefined, // On ctrl+L
    },
    prompt: {
      value: '>',
      setValue: _prompt => undefined
    }
  }
});

