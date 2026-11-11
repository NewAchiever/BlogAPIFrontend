
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { PostsListPage, CreatePostPage, PostDetailPage, SavedDraftsListPage } from '@/features/posts';
import { LoginPage, SignupPage, ChangePasswordPage, Logout } from '@/features/auth';
import { UserProfilePage, AuthorProfilePage } from '@/features/users';
import AppLayout from '@/app/AppLayout';
import EditDraftPage from '@/features/posts/pages/EditDraftPage';
import ProtectedRoute from './ProtectedRoutes';
import PageNotFound from '@/shared/pages/PageNotFound';

// 1. Centralized Paths
export interface RoutesConfig {
  LOGIN: string;
  LOGOUT: string;
  SIGNUP: string;
  HOME: string;
  CREATE_POST: string;
  CHANGE_PASSWORD: string;
  USER_PROFILE_PAGE: string;
  AUTHOR_PROFILE_PAGE: string;
  BLOG: string;
  DRAFTS: string;
  DRAFT_DETAIL: (id?: string | number) => string;
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
  AUTHOR_PROFILE_PAGE: '/author',
  BLOG: '/posts',
  DRAFTS: '/drafts',
  DRAFT_DETAIL: (id: string | number = ':postId'): string => `/draft/${id}`,
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
        { path: PATHS.SIGNUP, element: <SignupPage /> },
        {
          element: <ProtectedRoute/>,
          children: [
            { path: PATHS.LOGOUT, element: <Logout /> },
            { path: PATHS.CREATE_POST, element: <CreatePostPage/>},
            { path: PATHS.CHANGE_PASSWORD, element: <ChangePasswordPage/> },
            { path: PATHS.USER_PROFILE_PAGE, element: <UserProfilePage/> },
            { path: PATHS.AUTHOR_PROFILE_PAGE, element: <AuthorProfilePage/> },
            { path: PATHS.HOME, element: <PostsListPage /> },
            { path: PATHS.BLOG, element: <PostsListPage /> },
            { path: PATHS.DRAFTS, element: <SavedDraftsListPage /> },
            { path: PATHS.DRAFT_DETAIL(), element: <EditDraftPage /> },
            { path: PATHS.BLOG_DETAIL(), element: <PostDetailPage /> },
          ]
        },
        { path: PATHS.NOT_FOUND, element: <PageNotFound/> },
      ]
  }
];

export const router = createBrowserRouter(routes);