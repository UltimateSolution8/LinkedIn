export interface CommentPayload {
  thing_id: string
  text: string
}

export interface CommentResponse {
  comment_id: string
}

export interface DMPayload {
  to: string
  subject: string
  text: string
}

export interface DMResponse {
  success: boolean
}
