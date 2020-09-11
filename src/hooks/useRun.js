import React from 'react';
import { EditorContext } from '../contexts/EditorContext';
import { InterpContext } from '../contexts/InterpContext';

export const useRun = () => {
    const editor = React.useContext(EditorContext);
    const interp = React.useContext(InterpContext);
    return () => {
        interp.reset().then(() => {
            interp.eval(editor.value).then(res => {
                replRef.current.pushToStdout(res);
            });
        });
    };
};

