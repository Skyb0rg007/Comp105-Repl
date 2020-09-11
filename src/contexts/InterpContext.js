import React from 'react';

const mapToString = map => {
    let s = [];
    map.forEach((v, k) => {
        s.push(`"${k}" => "${v}"`)
    });
    return `Map (${map.size}) {${s.join(', ')}}`
};

const raiseErr = str => {
    throw new Error(`Unable to call '${str}' - context not initialized`);
};

export const InterpContext = React.createContext({
    name: '<uninitialized>', // Display name
    mode: '', // CodeMirror editor mode
    autoCloseBrackets: '', // CodeMirror auto-closing brackets
    extension: '.txt', // File extension
    setFilemap: filemap => raiseErr(`interp.setFilemap(${mapToString(filemap)})`), // Set the filesystem
    eval: str => raiseErr(`interp.eval("${str}")`), // Evaluate a string
    reset: () => raiseErr('interp.reset()'), // Reset the evaluation context
    numTests: 0, // Number of pending tests
    runTests: () => raiseErr('interp.runTests()') // Run pending tests
});

