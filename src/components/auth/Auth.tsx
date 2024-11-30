"use client";

import { useState } from "react";
import "./style.scss";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { gql, useMutation } from "@apollo/client";
import { useToast } from "@/contexts/toastContext";
import { useRouter } from "next/navigation";
import AnimationBg from "@/utils/AnimationBg";

const login = gql`
  mutation logIn($userName: String!, $password: String!) {
    loginUser(userName: $userName, password: $password) {
      role
      token
    }
  }
`;

type Data = {
  loginUser: {
    role: string;
    token: string;
  };
};

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { setLoginToken } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [logIn, { loading, error }] = useMutation<Data>(login, {
    onError: (error) => {
      if (error.message.includes("Password invalid")) {
        addToast("Invalid Uesrname or Password", "error");
        setErrorMessage("Invalid Uesrname or Password");
        setUsername("");
        setPassword("");
      } else {
        addToast(error.message, "error");
      }
      return;
    },
    //refetchQueries: [query, "getAllAdmins"],
    onCompleted: (data) => {
      addToast(
        `Logged in as ${
          data.loginUser.role === "superAdmin"
            ? "Super Admin"
            : data.loginUser.role === "admin"
            ? "Admin"
            : data.loginUser.role === "user"
            ? "User"
            : "Unauthorize"
        }`,

        `${
          data.loginUser.role === "superAdmin"
            ? "success"
            : data.loginUser.role === "admin"
            ? "success"
            : data.loginUser.role === "user"
            ? "success"
            : "error"
        }`
      );

      setUsername("");
      setPassword("");
      setErrorMessage("");
      setLoginToken(data.loginUser.token, data.loginUser.role);

      if (data.loginUser.role === "superAdmin") {
        localStorage.setItem("role", "superAdmin");
        router.push("/superAdmin-dashboard");
      } else if (data.loginUser.role === "admin") {
        localStorage.setItem("role", "admin");
        router.push("/admin-dashboard");
      } else if (data.loginUser.role === "user") {
        localStorage.setItem("role", "user");
        router.push("/user-dashboard");
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    logIn({
      variables: {
        userName: username,
        password: password,
      },
    });
    setErrorMessage("");
  };

  return (
    <section id="auth">
      <div className="fg">
        <div className="title">
          <h3>Dashboard</h3>
          <h5 className="highlight">login</h5>
        </div>
        <div className="card">
          <form onSubmit={handleLogin}>
            <div className="form-field">
              <label className="highlight">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                required
              />
            </div>
            <div className="form-field">
              <label className="highlight">Password:</label>
              <input
                type={openPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
              <button
                title={openPassword ? "Hide password" : "Show Password"}
                type="button"
                onClick={() => setOpenPassword(!openPassword)}
              >
                {openPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errorMessage && (
              <p className="error-text text-s">{errorMessage}</p>
            )}
            {error && !errorMessage && (
              <p className="error-text text-s">Error: {error.message}</p>
            )}
            <button title="Login" type="submit">
              {loading ? <RefreshCw size={24} className="loader" /> : "Login"}
            </button>
          </form>
        </div>

        <div className="card empty">
          <AnimationBg />
        </div>
      </div>
    </section>
  );
};

export default Auth;
