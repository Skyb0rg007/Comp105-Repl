// vim: set ts=2 sw=2:
import React from 'react';

import { Content } from './components/Content';
import { Navbar } from './components/Navbar';
import { InterpContext } from './contexts/InterpContext';
import { Impcore } from './interpreters/impcore';
import { UScheme } from './interpreters/uscheme';
import { TUScheme } from './interpreters/tuscheme';
import { USmalltalk } from './interpreters/usmalltalk';
import { Sml } from './interpreters/sml';
import { useQueryParams } from './hooks/useQueryParams';
import { Footer } from './components/Footer';

const interpreters = new Map([
  ['impcore', new Impcore()],
  ['uscheme', new UScheme()],
  ['tuscheme', new TUScheme()],
  ['usmalltalk', new USmalltalk()],
  ['sml', new Sml()]
]);

export const App = () => {
  const queryParams = useQueryParams();
  let queryLang = queryParams.get('lang');
  if (!queryLang || !interpreters.has(queryLang)) {
    if (queryLang) console.log(`Invalid language "${queryLang}"`);
    queryLang = 'impcore';
  }
  const [currentLang, setCurrentLang] = React.useState(queryLang);
  const contentRef = React.useRef(null);
  const onLangSelect = lang => {
    setCurrentLang(lang);
  };
  const run = () => {
    contentRef.current.run();
  };
  return (
    <React.Fragment>
      <InterpContext.Provider value={interpreters.get(currentLang)}>
        <Navbar
          currentLang={currentLang}
          languages={Array.from(interpreters.keys())}
          onLangSelect={onLangSelect}
          run={run}
        />
        <main>
          <Content ref={contentRef} />
        </main>
      </InterpContext.Provider>
    </React.Fragment>
  );
};
