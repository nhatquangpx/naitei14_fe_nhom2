import { Order } from '@/types/order'
import { 
  API_BASE_URL,
  CONTENT_TYPE_JSON,
  FIELD_CREATED_AT,
  ERROR_CREATE_ORDER,
  ERROR_GET_ORDERS,
} from '@/constants/common'
import { OrderError } from '@/lib/errors'

const API_DELAY_MS = 100

const createDelayPromise = (ms: number) => {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  await createDelayPromise(API_DELAY_MS)
  
  const newOrder: Order = {
    ...order,
    id: crypto.randomUUID(),
    [FIELD_CREATED_AT]: new Date().toISOString(),
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(newOrder),
  })

  if (!response.ok) {
    throw new OrderError(ERROR_CREATE_ORDER)
  }

  return response.json()
}

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  await createDelayPromise(API_DELAY_MS)
  
  const response = await fetch(`${API_BASE_URL}/orders?userId=${encodeURIComponent(userId)}&status=completed`, {
    method: 'GET',
    headers: {
      'Content-Type': CONTENT_TYPE_JSON,
    },
  })

  if (!response.ok) {
    throw new OrderError(ERROR_GET_ORDERS)
  }

  return response.json()
}

export const hasUserPurchasedProduct = async (userId: string, productId: number): Promise<boolean> => {
  await createDelayPromise(API_DELAY_MS)
  
  const orders = await getOrdersByUserId(userId)
  
  return orders.some(order => 
    order.status === 'completed' &&
    order.items.some(item => item.productId === productId)
  )
}

