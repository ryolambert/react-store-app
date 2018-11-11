// Sign Up Component: renders out and takes in user input for account sign up and passes it to the backend.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

class SignUp extends Component {
  // Setting up the initial state for our form fields
  state = {
    name: '',
    password: '',
    email: '',
  };

  // State save function for form input
  saveToState = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }


  render() {
    return (
      <Form>
        <fieldset>
          <h2>Sign Up for an Account</h2>
          <label htmlFor="email">
            Email
            <input
              type="email"
              name="email"
              placeholder="email"
              value={this.state.email}
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="name">
            Name
            <input
              type="text"
              name="name"
              placeholder="name"
              value={this.state.name}
              onChange={this.saveToState}
            />
          </label>
          <label htmlFor="password">
            <input
              type="password"
              name="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.saveToState}
            />
          </label>

          <button type="submit">Sign Up!</button>
        </fieldset>
      </Form>
    )
  }
}

export default  SignUp;