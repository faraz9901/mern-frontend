import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Home } from "lucide-react";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import Register from "./pages/Register";


export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/edit", element: <Edit /> },
    ],
    loader: () => { }
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);



function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
