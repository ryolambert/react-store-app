import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';

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
        <Pagination></Pagination>
          {/* The only allowable child of a <Query> Component is a function.
          Now that function delivers what's called a payload.
          ES6 note: on the arrow function the parenthesis (payload => line 32) is uneccessary for something with only one argument, if there were multiple then the () would be needed.

        Now, destructured payload out into data, error and loading to avoid having to redo each piece */}
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading}) => {
            if(loading) return <p>Loading...</p>
            if(error) return <p>Error: {error.message}</p>
            return (
              // This is how you loop over things in React, you take an array of things and map over it and for each item of the array return something else
              <ItemsList>
                {data.items.map(item => <Item item={item} key={item.id}/>)}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination></Pagination>
      </Center>
    )
  }
}

// basically wrap our component (Items) with the high-order component (withItems) that would expose your items through a prop
// export default withItems(Items);
export default Items;
export { ALL_ITEMS_QUERY };