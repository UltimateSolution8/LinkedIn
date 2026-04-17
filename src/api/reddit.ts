import client from './client'
import type { CommentPayload, CommentResponse, DMPayload, DMResponse } from '../types/gtag'

export async function postComment(payload: CommentPayload): Promise<CommentResponse> {
  const { data } = await client.post<CommentResponse>('/reddit/comment', payload)
  return data
}

export async function sendDM(payload: DMPayload): Promise<DMResponse> {
  const { data } = await client.post<DMResponse>('/reddit/dm', payload)
  return data
}
