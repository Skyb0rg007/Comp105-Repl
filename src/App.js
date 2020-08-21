import React from 'react';
import logo from './logo.svg';

import { Content } from './components/Content';
import { Navbar } from './components/Navbar';
import { InterpContext } from './contexts/InterpContext';
import { Impcore } from './interpreters/impcore';
import { UScheme } from './interpreters/uscheme';

let interpreters = new Map([
    ['impcore', new Impcore()],
    ['uscheme', new UScheme()]
]);

export const App = () => {
    const [currentLang, setCurrentLang] = React.useState('impcore');
    const onLangSelect = lang => {
        setCurrentLang(lang);
    };
    return (
        <React.Fragment>
            <Navbar
              currentLang={currentLang}
              languages={Array.from(interpreters.keys())}
              onLangSelect={onLangSelect} />
            <InterpContext.Provider value={interpreters.get(currentLang)}>
                <Content />
            </InterpContext.Provider>
        </React.Fragment>
    );
}
