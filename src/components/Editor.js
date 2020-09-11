import React from 'react';
import PropTypes from 'prop-types';
import { InterpContext } from '../contexts/InterpContext';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import './Editor.css';
// import './uscheme-mode';
// import 'codemirror/mode/scheme/scheme';

export const Editor = ({ onCtrlEnter, value, onEdit }) => {

  const [instance, setInstance] = React.useState(null);
  const { mode, autoCloseBrackets } = React.useContext(InterpContext);

  // Setup the key bindings
  React.useEffect(() => {
    // Edit for more keybindings
    const keyMap = {
      'Ctrl-/': cm => cm.toggleComment(),
      'Ctrl-Enter': _cm => onCtrlEnter()
    };
    if (instance)
      instance.addKeyMap(keyMap);
  }, [instance, onCtrlEnter]);

  const options = {
    mode: mode,
    theme: 'gruvbox-dark',
    smartIndent: true,
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: autoCloseBrackets,
  };

  return (
    <CodeMirror
      value={value}
      onBeforeChange={(_editor, _data, value) => onEdit(value)}
      options={options}
      editorDidMount={editor => setInstance(editor)}
      className='editor'
    />
  );
};

Editor.propTypes = {
  onCtrlEnter: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired
};

