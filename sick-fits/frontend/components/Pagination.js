// NPM Imports
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";
// Relative Imports
import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";

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
      // Setting up variables to pass in our page place in the pagination
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      const page = props.page;
      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! - Page {page} of {pages}
            </title>
          </Head>
          <Link
            // 🌟 AWESOME NOTE: Prefetch doesn't work in dev mode, but does in production. It's a huge boost for performance, by essentially preloading this element (can be used on any element)
            prefetch
            href={{
              pathname: "items",
              query: { page: page - 1 }
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ⬅ Prev
            </a>
          </Link>
          <p>
            Page {props.page} of {pages}!
          </p>
          <p> {count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page + 1 }
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next ➡
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
