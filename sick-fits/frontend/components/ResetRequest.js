// Reset Request Component: renders out and takes in user input for account reset and verifies against the backend
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

// Linking over our graphql mutation for signin
const RESET_REQUEST_MUTATION = gql`
  mutation RESET_REQUEST_MUTATION($email: String!) {
    resetRequest(email: $email) {
      message
    }
  }
`;

class ResetRequest extends Component {
  // Setting up the initial state for our form fields
  state = {
    email: '',
  };

  // State save function for form input
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation mutation={RESET_REQUEST_MUTATION} variables={this.state}>
        {/* Passing in our reset function from our mutation with our error and loading states */}
        {(reset, { error, loading, called }) => (
          // Post method setup as a fallback so we aren't exposing user submitted data in our url or don't use a <Form> tag and just use a collection of inputs.
          <Form
            method="post"
            onSubmit={async e => {
              // prevent our default behavior from launching without input
              e.preventDefault();
              // await reset since event is async
              await reset();
              // setting our initial user state
              this.setState({ email: '' });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link!</p>
              )}
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
              <button type="submit">Request Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default ResetRequest;
