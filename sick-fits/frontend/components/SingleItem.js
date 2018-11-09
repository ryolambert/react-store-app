import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import styled from "styled-components";

//
const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
`;

// Adding in our database query connect from graphQl
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

// Setting up one of two methods to for error handling of null IDs by:
// 1. Create a resolver on the backend in Query.js that throws an error that displays here.
// 2. Handling on client-side we create an if for !data.item

class SingleItem extends Component {
  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.item)
            return (
              <p>
                No Item Found for: {this.props.id}
                🤷‍
              </p>
            );
          console.log(data);
          const item = data.item;
          return <SingleItemStyles>
            <img src={item.largeImage} alt="{item.title}"/>
          </SingleItemStyles>
        }}
      </Query>
    );
  }
}

export default SingleItem;
