// Sign Up Component: renders out and takes in user input for account sign up and passes it to the backend.
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

// Linking over our graphql mutation for SignUp
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

class SignUp extends Component {
  // Setting up the initial state for our form fields
  state = {
    name: '',
    email: '',
    password: '',
  };

  // State save function for form input
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {/* Passing in our signup function from our mutation with our error and loading states */}
        {(signup, { error, loading }) => (
          // Post method setup as a fallback so we aren't exposing user submitted data in our url or don't use a <Form> tag and just use a collection of inputs.
          <Form
            method="post"
            onSubmit={async e => {
              // prevent our default behavior from launching without input
              e.preventDefault();
              // assigning a const res for a custom error/success response on intercept if wanted, otherwise needs an await since our event is async
              const res = await signup();
              // setting our initial user state
              this.setState({ name: '', email: '', password: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for an Account</h2>
              <Error error={error} />
              <label htmlFor="email">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={this.state.name}
                  onChange={this.saveToState}
                />
              </label>
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
              <label htmlFor="password">
                Password
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
        )}
      </Mutation>
    );
  }
}

export default SignUp;
