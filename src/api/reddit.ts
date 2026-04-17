import client from './client'
import type { CommentPayload, CommentResponse, DMPayload, DMResponse } from '../types/reddit'

export async function postComment(payload: CommentPayload): Promise<CommentResponse | null> {
  return client.post<CommentResponse>('/reddit/comment', payload)
}

export async function sendDM(payload: DMPayload): Promise<DMResponse | null> {
  return client.post<DMResponse>('/reddit/dm', payload)
}
