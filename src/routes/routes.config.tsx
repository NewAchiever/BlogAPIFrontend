import React from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';

// Import Layouts & Pages
//import RootLayout from '../layouts/RootLayout';
import Home from '../pages/home';
import BlogList from '../pages/get_posts';
import BlogPostDetail from '../pages/blog_post_detail';
import About from '../pages/about';
import Login from '../pages/login';
import Signup from '../pages/signup';
import Logout from '../pages/logout';
import { CreatePostPage } from '../pages/createPost';
import { ChangePasswordPage } from '../pages/changePasswordPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import AppLayout from '../AppLayout';

// 1. Centralized Paths
export interface RoutesConfig {
  LOGIN: string;
  LOGOUT: string;
  SIGNUP: string;
  HOME: string;
  CREATE_POST: string;
  CHANGE_PASSWORD: string;
  USER_PROFILE_PAGE: string;
  BLOG: string;
  BLOG_DETAIL: (id?: string | number) => string;
  ABOUT: string;
  NOT_FOUND: string;
}

export const PATHS: RoutesConfig = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  SIGNUP: '/signup',
  HOME: '/',
  CREATE_POST: '/create_post',
  CHANGE_PASSWORD: '/change_password',
  USER_PROFILE_PAGE: '/profile',
  BLOG: '/get_posts',
  BLOG_DETAIL: (id: string | number = ':postId'): string => `/get_post/${id}`,
  ABOUT: '/about',
  NOT_FOUND: '*',
};

// 2. Flat Route Definitions (No RootLayout needed)
const routes: RouteObject[] = [
  {
    element: <AppLayout/>,
    children: [
        { path: PATHS.LOGIN, element: <Login /> },
        { path: PATHS.LOGOUT, element: <Logout /> },
        { path: PATHS.SIGNUP, element: <Signup /> },
        { path: PATHS.CREATE_POST, element: <CreatePostPage/>},
        { path: PATHS.CHANGE_PASSWORD, element: <ChangePasswordPage/> },
        { path: PATHS.USER_PROFILE_PAGE, element: <UserProfilePage/> },
        { path: PATHS.HOME, element: <Home /> },
        { path: PATHS.BLOG, element: <BlogList /> },
        { path: PATHS.BLOG_DETAIL(), element: <BlogPostDetail /> },
        { path: PATHS.ABOUT, element: <About /> },
        { path: PATHS.NOT_FOUND, element: <Navigate to={PATHS.LOGIN} replace /> },
      ]
  }
];

export const router = createBrowserRouter(routes);