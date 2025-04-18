// import "./Sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { List, Storefront, Chat, AccountBalanceWallet, Person, Help } from "@mui/icons-material";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* Navbar for Small Screens */}
      <Navbar bg="dark" variant="dark" expand="lg" className="d-lg-none">
        <Navbar.Brand className="ms-3">Barter & Bidding</Navbar.Brand>
        <Navbar.Toggle onClick={() => setShow(true)} />
      </Navbar>

      {/* Sidebar */}
      <div className="d-none d-lg-flex flex-column bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
        <h2 className="mb-4">User Profile</h2>
        <Nav className="flex-column">
          <Link to="/" className="nav-link text-white"><List /> Dashboard</Link>
          <Link to="/listings" className="nav-link text-white"><Storefront /> Listings</Link>
          <Link to="/messages" className="nav-link text-white"><Chat /> Messages</Link>
          <Link to="/wallet" className="nav-link text-white"><AccountBalanceWallet /> Wallet</Link>
          <Link to="/profile" className="nav-link text-white"><Person /> Profile</Link>
          <Link to="/support" className="nav-link text-white"><Help /> Support</Link>
        </Nav>
      </div>

      {/* Offcanvas Sidebar for Mobile */}
      <Offcanvas show={show} onHide={() => setShow(false)} className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Link to="/" className="nav-link text-white" onClick={() => setShow(false)}><List /> Dashboard</Link>
            <Link to="/listings" className="nav-link text-white" onClick={() => setShow(false)}><Storefront /> Listings</Link>
            <Link to="/messages" className="nav-link text-white" onClick={() => setShow(false)}><Chat /> Messages</Link>
            <Link to="/wallet" className="nav-link text-white" onClick={() => setShow(false)}><AccountBalanceWallet /> Wallet</Link>
            <Link to="/profile" className="nav-link text-white" onClick={() => setShow(false)}><Person /> Profile</Link>
            <Link to="/support" className="nav-link text-white" onClick={() => setShow(false)}><Help /> Support</Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
