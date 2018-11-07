import Link from "next/link";
import UpdateItem from "../components/UpdateItem";

// destructing props to query which is the original setup in sell.js
const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Sell;
