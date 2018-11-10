import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { perPage } from '../config';

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
    <Query query={PAGINATION_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        return (
          <PaginationStyles>
          <p>
            Page {props.page} of {pages}!
          </p>
          </PaginationStyles>
        );
      }}
    </Query>
);

export default Pagination;
