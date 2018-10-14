import Link from 'next/link';

const Nav = () => (
  <div>
    <Link href="/sell">
      <a>Sell!</a>
    </Link>
    <br />
    <Link href="/">
      <a>Home!</a>
    </Link>
  </div>
);

export default Nav;