
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { PostsListPage, CreatePostPage, PostDetailPage } from '@/features/posts';
import { LoginPage, SignupPage, ChangePasswordPage, Logout } from '@/features/auth';
import { UserProfilePage } from '@/features/users';
import AppLayout from '@/app/AppLayout';

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
  BLOG: '/posts',
  BLOG_DETAIL: (id: string | number = ':postId'): string => `/post/${id}`,
  ABOUT: '/about',
  NOT_FOUND: '*',
};

// 2. Flat Route Definitions (No RootLayout needed)
const routes: RouteObject[] = [
  {
    element: <AppLayout/>,
    children: [
        { path: PATHS.LOGIN, element: <LoginPage /> },
        { path: PATHS.LOGOUT, element: <Logout /> },
        { path: PATHS.SIGNUP, element: <SignupPage /> },
        { path: PATHS.CREATE_POST, element: <CreatePostPage/>},
        { path: PATHS.CHANGE_PASSWORD, element: <ChangePasswordPage/> },
        { path: PATHS.USER_PROFILE_PAGE, element: <UserProfilePage/> },
        { path: PATHS.HOME, element: <PostsListPage /> },
        { path: PATHS.BLOG, element: <PostsListPage /> },
        { path: PATHS.BLOG_DETAIL(), element: <PostDetailPage /> },
        { path: PATHS.NOT_FOUND, element: <Navigate to={PATHS.LOGIN} replace /> },
      ]
  }
];

export const router = createBrowserRouter(routes);