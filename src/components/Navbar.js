import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';

const N = ({currentLang, languages, onLangSelect, run}) => {
  return (
    <Navbar bg="light" expand="lg" onSelect={onLangSelect} className="justify-content-between">
      <Navbar.Brand>Comp 105</Navbar.Brand>
      <Form inline>
        <Button variant="outline-success" onClick={run}>
          Run
        </Button>
      </Form>
      <Nav>
        <NavDropdown title={currentLang}>
          {languages.map(lang => (
            <NavDropdown.Item eventKey={lang} key={lang}>
              {lang}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

N.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onLangSelect: PropTypes.func.isRequired,
  currentLang: PropTypes.string.isRequired,
  run: PropTypes.func.isRequired
};

export { N as Navbar };

