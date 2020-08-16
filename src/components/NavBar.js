import React from 'react'
import { Link } from "react-router-dom";
const NavBar = () => (
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
                <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="logo"/>
            </a>

            <a role="button" href="/" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
                <Link to="/database" className="navbar-item">
                    Database
                </Link>

                <Link to="/game" className="navbar-item">
                    Game
                </Link>

                <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link" href="/">
                        More
                    </a>

                    <div className="navbar-dropdown">
                        <a className="navbar-item" href="/">
                            About
                        </a>
                        <a className="navbar-item" href="/">
                            Jobs
                        </a>
                        <a className="navbar-item" href="/">
                            Contact
                        </a>
                        <hr className="navbar-divider" />
                        <a className="navbar-item" href="/">
                            Report an issue
                        </a>
                    </div>
                </div>
            </div>
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <a className="button is-primary" href="/">
                            <strong>Sign up</strong>
                        </a>
                        <Link className="button is-light" to="/auth/login">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

export default NavBar;
