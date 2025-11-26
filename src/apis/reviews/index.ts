import { ProductReview } from '@/types/review'
import { 
  API_BASE_URL,
  CONTENT_TYPE_JSON,
  FIELD_CREATED_AT,
  ERROR_GET_REVIEWS,
  ERROR_CREATE_REVIEW,
} from '@/constants/common'
import { ReviewError } from '@/lib/errors'

const API_DELAY_MS = 100

const createDelayPromise = (ms: number) => {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const getReviewsByProductId = async (productId: number): Promise<ProductReview[]> => {
  await createDelayPromise(API_DELAY_MS)
  
  const response = await fetch(`${API_BASE_URL}/reviews?productId=${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON,
    },
  })

  if (!response.ok) {
    throw new ReviewError(ERROR_GET_REVIEWS)
  }

  return response.json()
}

export const createReview = async (review: Omit<ProductReview, 'id' | 'date' | 'createdAt'>): Promise<ProductReview> => {
  await createDelayPromise(API_DELAY_MS)
  
  const newReview: ProductReview = {
    ...review,
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString('vi-VN'),
    [FIELD_CREATED_AT]: new Date().toISOString(),
  }

  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(newReview),
  })

  if (!response.ok) {
    throw new ReviewError(ERROR_CREATE_REVIEW)
  }

  return response.json()
}

export const hasUserReviewedProduct = async (userId: string, productId: number): Promise<boolean> => {
  await createDelayPromise(API_DELAY_MS)
  
  const response = await fetch(`${API_BASE_URL}/reviews?userId=${encodeURIComponent(userId)}&productId=${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON,
    },
  })

  if (!response.ok) {
    return false
  }

  const reviews = await response.json()
  return reviews.length > 0
}

