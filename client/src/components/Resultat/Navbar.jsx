import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./styles.css"

function NavbarR({ handleNavClick }) {
  return (
    <>
      <Navbar bg="light" variant="light" className="custom-navbar">
        <Container>
          <Navbar.Brand></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => handleNavClick('QUESTIONS')}className="navquest" >Questions</Nav.Link>
            <Nav.Link onClick={() => handleNavClick('REPONSES')}>Réponses</Nav.Link>
            <Nav.Link onClick={() => handleNavClick('STATISTIQUES')}>Statistique</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarR;
