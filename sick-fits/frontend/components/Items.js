// NPM Imports
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
// Relative Imports
import Item from './Item';
import Pagination from './Pagination';
// ‼ Because perPage is a named export it needs the curly braces, if it were a default export then this wouldn't be an issu
import { perPage } from '../config';

// Best practice to put all of your queries in all Caps with underscores
// The way we use this query is through Render Prop
const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

// Render Prop being used, allows us to go around a high-order component and lets us put a component directly inside below (<p></p>) that's a query and the child of that component will be a function that'll give us a loading state, an error, or an actual list of the items
class Items extends Component {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
        {/* The only allowable child of a <Query> Component is a function.
          Now that function delivers what's called a payload.
          ES6 note: on the arrow function the parenthesis (payload => line 32) is uneccessary for something with only one argument, if there were multiple then the () would be needed.

        Now, destructured payload out into data, error and loading to avoid having to redo each piece */}
        <Query
          query={ALL_ITEMS_QUERY}
          // ‼ One way to solve refreshing page cache after adding to the database to display items, but the biggest issue is with fetchPolicy network only we're having to constantly redownload each page again slowing down our page loads and taking away our ability to cache previous pages.
          // @ Or use refetch on our mutation in CreateItem, but again we run into another issue of possibly having to again run more calculations and requests per item, which would slow performance if hundreds of items were listed.
          // @ Currently as it stands Apollo does not have an option to for setting parameters/logic on partial caches like timers, etc.
          // fetchPolicy="network-only"
          variables={{
            // setting up query with skip and first to display out the proper number or items defined by perPage and have it display out that number or skip per page left
            skip: this.props.page * perPage - perPage,
          }}
        >
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              // This is how you loop over things in React, you take an array of things and map over it and for each item of the array return something else
              <ItemsList>
                {data.items.map(item => (
                  <Item item={item} key={item.id} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}

// basically wrap our component (Items) with the high-order component (withItems) that would expose your items through a prop
// export default withItems(Items);
export default Items;
export { ALL_ITEMS_QUERY };
