import Link from 'next/link';
import Items from '../components/Items';

const Home = props => (
  <div>
    {/* Note: without parseFloat our current page number would be passed in as a null string instead of an integer. */}
    <Items page={parseFloat(props.query.page) || 1}/>
  </div>
);

export default Home;