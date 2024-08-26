import React, { createContext, useContext } from "react";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="App-header">
      <div>
        <Link className="App-link" to="/dashboard">
          Dashboard
        </Link>
      </div>
      <div>
        <Link className="App-link" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (auth) {
      auth.login(true);
      navigate("/dashboard");
    }
  };

  return (
    <div onClick={handleClick} className="App-header">
      Login
    </div>
  );
};

const Dashboard: React.FC = () => {
  return <div className="App-header">Dashboard Page</div>;
};

const Error: React.FC = () => {
  return <div className="App-header">Error Page</div>;
};

type ContextType = {
  isLogged: boolean;
  login: (status: boolean) => void;
};

const AuthContext = createContext<ContextType | null>(null);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);

  if (!auth) return <Error />;

  return auth.isLogged ? <>{children}</> : <Navigate to="/login" replace />;
};

const Profile: React.FC = () => {
  const { profileId, menuId } = useParams();

  React.useEffect(() => {
    alert(`Завантаження даних для ID: ${profileId}`);
  }, [profileId]);

  return (
    <div className="App-header">
      Profile Page ID: {profileId} Menu: {menuId}
    </div>
  );
};

function App() {
  const [isLogged, login] = React.useState(false);

  return (
    <AuthContext.Provider value={{ isLogged, login }}>
      <BrowserRouter>
        <Routes>
          <Route index Component={Home} />
          <Route path="/login/*" Component={Login} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:profileId/menu/:menuId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/*" Component={Error} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
