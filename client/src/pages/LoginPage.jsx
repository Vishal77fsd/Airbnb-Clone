import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const userInfo = await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(userInfo.data);
      alert("Login Successfull");
      setRedirect(true);
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 ">
        <h1 className="text-3xl text-center mb-4">Login</h1>
        <form className="max-w-md  mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="JohnDoe@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password Here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-700">
            Don't have an account yet?{" "}
            <Link to={"/register"} className="text-black underline">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
