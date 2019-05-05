import React, { Component } from "react";
import { AUTH_TOKEN } from "../constants";
import { Mutation } from "react-apollo";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphql/mutations";
import { History } from "history";
export interface LoginProps {
  history: History;
}
export interface LoginState {
  login: boolean;
  email: string;
  password: string;
  name: string;
}
export interface completeData {
  login: {
    token: string;
  };
  signup: {
    token: string;
  };
}
class Login extends Component<LoginProps, LoginState> {
  state = {
    login: true, // switch between Login and SignUp
    email: "",
    password: "",
    name: ""
  };

  render() {
    const { login, email, password, name } = this.state;
    return (
      <div>
        <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={(data: completeData) => this._confirm(data)}
          >
            {(mutation: () => void) => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? "login" : "create account"}
              </div>
            )}
          </Mutation>
          <span

            onClick={() => this.setState(prev => ({ login: !prev.login }))}
          >
            or {login ? ` create new account` : " login"}
          </span>
        </div>
      </div>
    );
  }

  _confirm = async (data: completeData) => {
    const { token } = this.state.login ? data.login : data.signup;
    this._saveUserData(token);
    this.props.history.push(`/`);
  };

  _saveUserData = (token:string) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };
}

export default Login;
