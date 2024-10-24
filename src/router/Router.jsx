import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import HomeView from "../pages/HomeView";
import MenuView from "../pages/MenuView";
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import AdminDash from '../pages/AdminDash/AdminDash';
import Usres from '../pages/AdminDash/Usres';
import Manue from '../pages/AdminDash/Manue';
import ManageOrders from '../pages/AdminDash/ManageOrders';
import ManageItem from '../pages/AdminDash/ManageItem'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <HomeView />,
      },
      {
        path: "/menu",
        element: <MenuView />,
      },
      {
        path: "/menu/:id",
        element: <MenuView />,
      },
      {
        path:"login", element:<Login />,
      },
      {
        path:"signup", element:<SignUp />,
      },{
        path:"dash", element:<AdminDash />, children: [
          {
            path: "user",
            element: <Usres />,
          },
          {
            path: "manue",
            element: <Manue />,
          },
          {
            path: "orders",
            element: <ManageOrders />,
          },
          {
            path: "item",
            element: <ManageItem />,
          },
        ]
      }]
  },
]);
export default router;
