import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

// Best practice to put all of your queries in all Caps with underscores
// The way we use this query is through Render Prop
const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

// Render Prop being used, allows us to go around a high-order component and lets us put a component directly inside below (<p></p>) that's a query and the child of that component will be a function that'll give us a loading state, an error, or an actual list of the items
export default class Items extends Component {
  render() {
    return (
      <div>
        <p>Items!</p>
        {/*
          The only allowable child of a <Query> Component is a function.
          Now that function delivers what's called a payload.
          ES6 note: on the arrow function the parenthesis (payload => line 32) is uneccessary for something with only one argument, if there were multiple then the () would be needed.
        */}
        <Query query={ALL_ITEMS_QUERY}>
          {payload => {
            console.log(payload);
            return <p>Hey I'm the child of query</p>
          }}

        </Query>
      </div>
    )
  }
}

// basically wrap our component (Items) with the high-order component (withItems) that would expose your items through a prop
// export default withItems(Items);
