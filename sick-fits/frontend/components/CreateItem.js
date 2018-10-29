import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";

class CreateItem extends Component {
  //Refering to handleChange on line 20, if we didn't use the arrow function with an instance property we'd have to create and bind with a constructor handleChange like below:
  // constructor() {
  //   super();
  //   this.handleChange = this.handleChange.bind(this);
  // }

  // Setting up base state to be filled out
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };

  // Method with an arrow to utilize an instance property to make *this accessible. Otherwise regular methods for ES6 classes won't allow you to bind to the instance of a property
  handleChange = (e) => {
    console.log(e.target);
  }

  render() {
    return (
      <Form>
        <fieldset>
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
        </fieldset>
      </Form>
    );
  }
}

export default CreateItem;
