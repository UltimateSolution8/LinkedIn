interface GTagEventParams {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
}

interface Window {
    gtag: (
        command: 'config' | 'event' | 'set' | 'js',
        targetId: string,
        config?: GTagEventParams | { user_id?: string; [key: string]: any }
    ) => void;
    dataLayer: any[];
}


export interface User {
  id: string
  reddit_user_id: string
  reddit_username: string
  created_at: string
}

export interface CommentPayload {
  thing_id: string
  text: string
}

export interface DMPayload {
  to: string
  subject: string
  text: string
}

export interface CommentResponse {
  comment_id: string
}

export interface DMResponse {
  success: boolean
}

export interface AuthURLResponse {
  auth_url: string
}

