import React from 'react'
import { Link } from "react-router-dom";
import {connect, useDispatch} from "react-redux";
import {logoutSuccessAction} from "../store/AuthReducer";
const NavBar = (props) => {
    let dispatch = useDispatch();
    function logout() {
        dispatch(logoutSuccessAction())
    }
    return (
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
                    {props.isAuthenticated &&
                        <Link to="/database" className="navbar-item">
                            Database
                        </Link>
                    }
                    <Link to="/game" className="navbar-item">
                        Game
                    </Link>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        {props.isAuthenticated ?
                            <button className="button is-light" onClick={logout}>Logout</button>
                            :
                            <div className="buttons">
                                <a className="button is-primary" href="/">
                                    <strong>Sign up</strong>
                                </a>
                                <Link className="button is-light" to="/auth/login">
                                    Log in
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}
export default connect(mapStateToProps)(NavBar);
