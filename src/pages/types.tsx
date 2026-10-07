// types.ts
import { type Dispatch,  type SetStateAction } from "react";


export interface LoginFormData {
  email: string;
  password?: string; // Optional if using passwordless/OTP
}

export interface SignupFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string; 
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>; // For validation errors
}

export interface Comment {
  id: number;
  author: string;
  comment: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  isEditing: boolean;
  showReplies: boolean;
  showReplyForm: boolean;
  replies: Comment[];
}

export interface CommentSectionProps {
  postId: number | string;
  commentsFromDB: Comment[];
  onAddComment: (newComment: Comment) => void;
}


export interface commentComponentProps {
    depth: number;
    comment: Comment;
    setComments: Dispatch<SetStateAction<Comment[]>>;
    updateComment:  (comments: Comment[], commentId: number, updates: Partial<Comment>) => Comment;
    textInput: string;
    handleLike: (commentId: number) => void;
    handleReply: (e:React.FormEvent<HTMLFormElement>, commentId: number) => void;
    handleViewMore: (commentId: number) => void;
    showReplyForm: (commentId: number) => void;
    setTextInput: Dispatch<SetStateAction<string>>;
    isSubmitting: boolean;
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;

}
