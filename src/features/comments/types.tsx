import { type Dispatch,  type SetStateAction } from "react";


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
  total_replies: number;
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
    updateComment:  (comments: Comment[], commentId: number, updates: Partial<Comment>) => Comment[];
    textInput: string;
    handleLike: (commentId: number) => void;
    handleReply: (e:React.FormEvent<HTMLFormElement>, commentId: number) => void;
    handleViewMore: (commentId: number) => void;
    showReplyForm: (commentId: number) => void;
    setTextInput: Dispatch<SetStateAction<string>>;
    isSubmitting: boolean;
    setIsSubmitting: Dispatch<SetStateAction<boolean>>;

}
