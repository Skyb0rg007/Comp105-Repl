import React from 'react';

const mapToString = map => {
    let s = [];
    map.forEach((v, k) => {
        s.push(`"${k}" => "${v}"`)
    });
    return `Map (${map.size}) {${s.join(', ')}}`
};

export const InterpContext = React.createContext({
    name: '<uninitialized>',
    mode: '',
    autoCloseBrackets: '',
    extension: '.txt',
    setFilemap: filemap => console.log(`Unable to call 'setFilemap(${mapToString(filemap)})' - context not initialized`),
    eval: str => console.log(`Unable to call 'eval("${str}")' - context not initialized`),
    reset: () => console.log(`Unable to call 'reset()' - context not initialized`)
});
