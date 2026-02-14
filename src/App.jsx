import "./App.css";
import useAuth from "./hooks/useAuth";

function App() {
  const { user } = useAuth();
 // console.log(user);
  if (user) {
    return (
      <>
        Hi {user?.displayName} : {user.email}
        <img src={user?.photoURL} />
      </>
    );
  }
  return <></>
}

export default App;
