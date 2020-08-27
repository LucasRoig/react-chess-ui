import React from "react"
import FormField from "../components/FormField";
import ApiService from "../services/ApiService";
import AuthService from "./AuthService";
const BASE_STATE = {
    email:"",
    password:"",
    username: "",
    confirmPassword: "",
    errors: false
}
class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = BASE_STATE
    }

    handleChange = (event) => {
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        });
    }

    setErrors = (boolean) => () => this.setState({errors: boolean});

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            this.setErrors(true)();
        } else {
            AuthService.signUp({
                email: this.state.email,
                password: this.state.password,
                username: this.state.username,
                handleError: this.setErrors(true)
            })
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} style={{maxWidth: "500px", margin:"auto"}}>
                <FormField label="Email"
                           control={<input name="email" className="input" type="email" required onChange={this.handleChange} value={this.state.email}/>}
                />
                <FormField label="Username"
                           control={<input name="username" className="input" type="text" required onChange={this.handleChange} value={this.state.username}/>}
                />
                <FormField label="Password"
                           control={<input name="password" className="input" type="password" required onChange={this.handleChange} value={this.state.password}/>}
                />
                <FormField label="Confirm Password"
                           control={<input name="confirmPassword" className="input" type="password" required onChange={this.handleChange} value={this.state.confirmPassword}/>}
                />
                <FormField control={<button className="button is-link" type="submit">Valider</button>}/>
                {this.state.errors && <div className="notification is-danger is-light">Erreur</div>}
            </form>
        )
    }
}

export default SignUpPage;