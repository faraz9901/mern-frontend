import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import Edit from "./pages/Edit";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthService } from "./services/auth.service";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "edit", element: <Edit /> },
    ],
    loader: () => AuthService.checkSession("dashboard"),
  },
  {
    path: "/login",
    element: <Login />,
    loader: () => AuthService.checkSession("login"),
  },
  {
    path: "/register",
    element: <Register />,
    loader: () => AuthService.checkSession("register"),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
