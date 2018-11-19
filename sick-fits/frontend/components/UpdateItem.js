import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

// Setting our query for the mutation to send out the data to our database
// For our mutation we are passing in the argument types such that when they are called they run the mutator updateItem in the schema and used the passed in variable as the title, description, etc.
// Then gives back the item's id at the bottom there.
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  // Refering to handleChange on line 20, if we didn't use the arrow function with an instance property we'd have to create and bind with a constructor handleChange like below:
  // constructor() {
  //   super();
  //   this.handleChange = this.handleChange.bind(this);
  // }

  // Setting up base state to be filled out
  state = {};

  // Method with an arrow to utilize an instance property to make *this accessible. Otherwise regular methods for ES6 classes won't allow you to bind to the instance of a property
  handleChange = e => {
    // Great event handler that allows us to take in and mirror multiple input types
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log('Updating Item!!!');
    console.log(this.state);
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    console.log('Updated 👍');
  };

  render() {
    return (
      // Creating a query to nest the mutation in, in order to expose the query to the user on render
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id,
        }}
      >
        {/* Our render prop function that verifies loading status, if not then returns our Mutation for render, which exposes our item data and updateItem function */}
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          // Second If Statement for Items not found in database
          if (!data.item)
            return <p>No Item Found for ID: {this.props.id} 🤷‍</p>;

          return (
            // When this mutation fires it'll take a copy of the this.state that lines up with all the variables for the query
            // We're setting up another mutation, payload with everything like in Items query, but with called with returns back a boolean
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                // Here we're passing a method to a component method 🤟
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  {/* Showing user within fieldset when there's errors and loading */}
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      {/* Normally a textarea wouldn't be a self-closing tag but React is smart enough to know, and allows us to assign a value prop. */}
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? 'ing' : 'e'} Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
// exporting our our query to make it easier to do testing and reuse among other components 👍
export { UPDATE_ITEM_MUTATION };
