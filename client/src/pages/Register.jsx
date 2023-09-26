import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      email,
      password,
    };

    // Sending data
    axios
      .post("/register", data)
      .then((response) => {
        console.log(response);
        alert("Registration Successfull. Now you can log in");
      })
      .catch((err) => {
        console.log(err);
        alert("Registration Failed. Please try again later");
      });
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 ">
        <h1 className="text-3xl text-center mb-4">Register</h1>
        <form className="max-w-md  mx-auto" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-700">
            Have an account?{" "}
            <Link to={"/login"} className="text-black underline">
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
