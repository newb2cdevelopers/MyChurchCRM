import Navbar from "../navbar";
import RoutesCollection from "../../routes/mainRouter";

function Layout() {
  return (
    <>
      <Navbar />
      <div className="main">{RoutesCollection}</div>
    </>
  );
}

export default Layout;
