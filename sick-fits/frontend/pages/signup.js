import styled from 'styled-components';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import ResetRequest from '../components/ResetRequest';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fix, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignUpPage = props => (
  <Columns>
    <SignUp />
    <SignIn />
    <ResetRequest />
  </Columns>
);

export default SignUpPage;
