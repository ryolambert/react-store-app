// User frontend component
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      # TODO: Add cart & orders
    }
  }
`;

// * Making user component
const User = props => (
  // {...props} allows us to add in additional props if needed
  <Query {...props} query={CURRENT_USER_QUERY}>
    {/* Allows us to pass in our payload without having to redefine our query and pass it every time or prop drill. */}
    {payload => props.children(payload)}
  </Query>
);

// Sets our user prop types so the only thing that we must pass as a child is a function
User.PropTypes = {
  children: PropTypes.func.isRequired
};

export default User;
export { CURRENT_USER_QUERY };
