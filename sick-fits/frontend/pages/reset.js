import Reset from '../components/Reset';

// Currently configured as a stateless component as opposed to a React Component
const ResetPage = props => (
  <div>
    <p>Reset Your Password {props.query.resetToken}</p>
    <Reset resetToken={props.query.resetToken} />
  </div>
);

export default ResetPage;
