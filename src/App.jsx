import { useRoutes } from "react-router-dom";
import "./App.css";

import Toast from "./Components/Toast/Toast";
import routes from "./routes";

function App() {
  const router = useRoutes(routes);

  return (
    <>
      <Toast />
      {router}
    </>
  );
}

export default App;
