import React, {Component} from 'react';
import FormField from "../components/FormField";
import AuthService from "./AuthService";

const BASE_STATE = {
  email:"",
  password:"",
  errors: false
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = BASE_STATE;
  }

  handleChange = (event) => {
      const name = event.target.name;
      this.setState({
        [name]: event.target.value
      });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    AuthService.login({
      email: this.state.email,
      password: this.state.password,
      handleInvalidCredentials: this.setErrors(true)
    });
  }

  setErrors = (boolean) => () => this.setState({errors: boolean});

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{maxWidth: "500px", margin:"auto"}}>
        <FormField label="Email"
                   control={<input name="email" className="input" type="email" required onChange={this.handleChange} value={this.state.email}/>}
        />
        <FormField label="Password"
                   control={<input name="password" className="input" type="password" required onChange={this.handleChange} value={this.state.password}/>}
        />
        <FormField control={<button className="button is-link" type="submit">Valider</button>}/>
        {this.state.errors && <div className="notification is-danger is-light">Identifiant ou mot de passe invalide</div>}
      </form>
    )
  }
}

export default LoginPage;
