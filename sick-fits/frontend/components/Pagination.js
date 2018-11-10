import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";

// Initializing our Pagination Query => connected to our graphQL db
const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

/*
  Notes: Setting up a simple stateless functional component that'll paginate our Items.js component
*/

const Pagination = props => (
  <PaginationStyles>
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => <p>👋 Pagination Count: {data.itemsConnection.aggregate.count}!</p>}
    </Query>
  </PaginationStyles>
);

export default Pagination;
