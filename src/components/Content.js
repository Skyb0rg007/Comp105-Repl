import React from 'react';
// import PropTypes from 'prop-types';
import { Editor } from './Editor';
import { Repl } from './Repl';
import { InterpContext } from '../contexts/InterpContext';
import { useQueryParams } from '../hooks/useQueryParams';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const Content = React.forwardRef((_props, ref) => {
  const interp = React.useContext(InterpContext);
  const replRef = React.useRef(null);
  const queryParams = useQueryParams();
  let queryTemplate = queryParams.get('template');
  const [editorValue, setEditorValue] = React.useState('');
  React.useEffect(() => {
    if (queryTemplate) {
      fetch(`${process.env.PUBLIC_URL}/templates/${queryTemplate}`)
        .then(response => 
            response.ok ?  response.text() : `;; Error reading data from template "${queryTemplate}"`)
        .then(data => setEditorValue(data));
    }
  }, [queryTemplate]);
  const run = () => {
    interp.reset().then(() => {
      interp.eval(editorValue).then(res => {
        replRef.current.pushToStdout(res);
      });
    });
  };
  React.useImperativeHandle(ref, () => ({ run }));
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
});

Content.propTypes = {
};

