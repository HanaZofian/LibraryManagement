// Import React and ReactDOM for rendering the app
import * as React from "react";
import * as ReactDOM from "react-dom/client";

// Import React Router components
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Import app components
import ManagementHeader from "./ManagementHeader";
import LibraryHeader from "./LibraryHeader";
import AdminLogin from "./components/AdminLogin";
import LoginMenu from "./components/LoginMenu";
import BookForm from "./components/BookForm";
import ViewBook from "./components/ViewBook";
import Library from "./components/Library";
import ProtectedAdminRoute from "./AdminRoute";
import "./index.css"; // Import global CSS (including Tailwind if used)

// Define routes for the app
const router = createBrowserRouter([
  {
    path: "/",               // Main route
    element: <LibraryHeader />,       
    children: [
      {
        path: "",           
        element: <LoginMenu />, 
      },
      {
        path: "AdminLogin",           
        element: <AdminLogin />, 
      },
    ],
  },

{
  element: <ProtectedAdminRoute />,  // paths under this element cannot be accesed without adminToken
  children: [
    {
      path: "/Admin",
      element: <ManagementHeader />,
      children: [
        {
          path: "ViewBook",
          element: <ViewBook />,
        },
        {
          path: "EditBook/:id",  
          element: <BookForm />,
        },
        {
          path: "BookForm", 
          element: <BookForm />,
        },
      ],
    },
  ],
},

{
  path: "/Member",               
  element: <LibraryHeader />,        
  children: [
    {
      path: "Library",           
      element: <Library />, 
    },
  ],
},

]);

// Render the app to the DOM with router support
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* RouterProvider enables route-aware rendering and navigation */}
    <RouterProvider router={router} /> 
  </React.StrictMode>
);
