import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from './Editor';
import { Repl } from './Repl';
import { InterpContext } from '../contexts/InterpContext';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const Content = () => {
  const interp = React.useContext(InterpContext);
  const replRef = React.useRef(null);
  const [editorValue, setEditorValue] = React.useState(';; Initial content');
  const run = () => {
    interp.reset().then(() => {
      interp.eval(editorValue).then(res => {
        replRef.current.pushToStdout(res);
      });
    });
  };
  return (
    <Container>
      <Row>
        <Col>
          <Editor value={editorValue} onEdit={setEditorValue} onCtrlEnter={run} />
        </Col>
        <Col>
          <Repl ref={replRef} />
        </Col>
      </Row>
    </Container>
  );
};

Content.propTypes = {
};

