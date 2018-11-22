import CreateItem from '../components/CreateItem';
import SignInWrapper from '../components/SignInWrapper';

// Currently configured as a stateless component as opposed to a React Component
const Sell = props => (
  <div>
    <SignInWrapper>
      <CreateItem />
    </SignInWrapper>
  </div>
);

export default Sell;
