//* -------------------GATED SIGN IN WRAPPER COMPONENT----------------*
/* Purpose: A gated sign in wrapper component to check if user is
   signed in and notify them of components that require sign in
   privileges.
*--------------------------------------------------------------------*/
import { Query } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './SignIn';

const SignInWrapper = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      console.log(data);
      if (loading) return <p>Loading...</p>;
      if (!data.me) {
        return (
          <div>
            <p>Please Sign In Before Continuing 🙏</p>
            <SignIn />
          </div>
        );
      }
      return props.children;
    }}
  </Query>
);

export default SignInWrapper;
