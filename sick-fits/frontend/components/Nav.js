import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut';

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        {/* The payload has data inside of it already, so we're using a two level destructuring into data then further into me */}
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {/* ⚛ React Tip: "<> </>" React fragment wrapping our jsx- */}
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <SignOut />
          </>
        )}
        {!me && (
          <>
            <Link href="/signup">
              <a>Sign In</a>
            </Link>
          </>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
