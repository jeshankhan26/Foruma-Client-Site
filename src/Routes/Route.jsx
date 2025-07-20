import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import React from "react";
import ReactDOM from "react-dom/client";
import Root from "../Pages/Frontend/Root";
import Home from "../Pages/Frontend/Home/Home";
import Membership from "../Pages/Frontend/Member/Membership";
import Login from "../Pages/Frontend/Auth/Login";
import Register from "../Pages/Frontend/Auth/Register";
import PrivateRoute from "./privateRoute";
import AdminDashboard from "../Pages/Backend/Dashboard/AdminDashboard";
import Admin_Dashboard from "../Pages/Backend/Admin/Admin_Dashboard";
import User_Dashboard from "../Pages/Backend/User/User_Dashboard";
import Dashboard from "../Pages/Backend/Dashboard/Dashboard";
import AddTag from "../Pages/Backend/User/Tag/AddTag";
import AllTags from "../Pages/Backend/User/Tag/AllTags";
import AddPost from "../Pages/Backend/User/Posts/AddPost";
import AllPost from "../Pages/Backend/User/Posts/AllPost";
import MyProfile from "../Pages/Backend/Profile/MyProfile";
import CommentsPage from "../Pages/Backend/User/Posts/CommentsPage";
import ManageUsers from "../Pages/Backend/Admin/UserManage/ManageUsers";
import CreateAnnouncement from "../Pages/Backend/Admin/Annoucement/CreateAnnouncement";
import PostComments from "../Pages/Backend/Admin/Reports/PostComments";
import ReportedActivities from "../Pages/Backend/Admin/Reports/ReportedActivities";
import AnnouncementActivities from "../Pages/Backend/Admin/Annoucement/AnnouncementActivities";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
      {index:true,element:<Home></Home>},
      {path:"member",element:<PrivateRoute>
        <Membership></Membership>
      </PrivateRoute>}
    ]
  },
  {
    path:"login",
    element:<Login></Login>
  },
  {
    path:"register",
    element:<Register></Register>
  },
 {
  path: "adminDashboard",
  element: (
    <PrivateRoute>
      <AdminDashboard />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <Admin_Dashboard /> },
    { path: "manageuser", element: <ManageUsers /> }, 
    { path: "announcement", element: <CreateAnnouncement /> }, 
    { path: "report", element: <ReportedActivities /> }, 
    { path: "activities", element: <AnnouncementActivities /> }, 
  ],
}
,
  {
    path:"dashboard",
    element:
    <PrivateRoute>
      <Dashboard></Dashboard>
      </PrivateRoute>,
    children:[
      {index:true,element:<User_Dashboard></User_Dashboard>},
      {path:"/dashboard/addpost",element:<AddPost></AddPost>},
      {path:"/dashboard/addtags",element:<AddTag></AddTag>},
      {path:"/dashboard/alltags",element:<AllTags></AllTags>},
      {path:"/dashboard/allpost",element:<AllPost></AllPost>},
      {path:"/dashboard/myprofile",element:<MyProfile></MyProfile>},
      {path:"/dashboard/comments/:postId" ,element:<CommentsPage />}
    ]
  }
]);
