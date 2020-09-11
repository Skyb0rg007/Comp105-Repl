import React from 'react';

export const EditorContext = React.createContext({
    value: '<uninitialized>',
    setValue: str => { throw new Error(`Unable to call setValue("${str}") - context not initialized`); }
});

