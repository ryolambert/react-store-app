import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

// Seting our query for the mutation to send out the data to our database
// For our mutation we are passing in the argument types such that when they are called they run the mutator createItem in the schema and used the passed in variable as the title, description, etc.
// Then gives back the item's id at the bottom there.
const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  // Refering to handleChange on line 20, if we didn't use the arrow function with an instance property we'd have to create and bind with a constructor handleChange like below:
  // constructor() {
  //   super();
  //   this.handleChange = this.handleChange.bind(this);
  // }

  // Setting up base state to be filled out
  state = {
    title: "Cool Shoes",
    description: "I love those shoes",
    image: "dog.jpg",
    largeImage: "large-dog.jpg",
    price: 1000
  };

  // Method with an arrow to utilize an instance property to make *this accessible. Otherwise regular methods for ES6 classes won't allow you to bind to the instance of a property
  handleChange = e => {
    // Great event handler that allows us to take in and mirror multiple input types
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      // When this mutation fires it'll take a copy of the this.state that lines up with all the variables for the query
      // We're setting up another mutation, payload with everything like in Items query, but with called with returns back a boolean
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await createItem();
              // change them to the single item page
              console.log(res);
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
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
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
// exporting our our query to make it easier to do testing and reuse among other components 👍
export { CREATE_ITEM_MUTATION };
