import React from 'react'
import { Link } from "react-router-dom";
import {connect, useDispatch} from "react-redux";
import {logoutSuccessAction} from "../store/AuthReducer";
import {LOGIN, SIGN_UP} from "../Routes";
const NavBar = (props) => {
    let [isBurgerActive, setBurgerActive] = React.useState(false);
    const handleBurgerClick = () => {
        setBurgerActive(!isBurgerActive);
    }
    const disableBurger = () => {
        setBurgerActive(false);
    }
    let dispatch = useDispatch();
    function logout() {
        dispatch(logoutSuccessAction())
    }
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link to="/database" className="navbar-item" href="https://bulma.io">
                    <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt="logo"/>
                </Link>

                <a role="button" className={"navbar-burger burger " + (isBurgerActive ? "is-active" : "")}
                   onClick={handleBurgerClick} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={"navbar-menu " + (isBurgerActive ? "is-active" : "")}>
                <div className="navbar-start">
                    {props.isAuthenticated &&
                        <Link to="/database" className="navbar-item" onClick={disableBurger}>
                            Database
                        </Link>
                    }
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        {props.isAuthenticated ?
                            <button className="button is-light" onClick={() => {disableBurger();logout()}}>Logout</button>
                            :
                            <div className="buttons">
                                <Link className="button is-primary" to={SIGN_UP} onClick={disableBurger}>
                                    <strong>Sign up</strong>
                                </Link>
                                <Link className="button is-light" to={LOGIN} onClick={disableBurger}>
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
