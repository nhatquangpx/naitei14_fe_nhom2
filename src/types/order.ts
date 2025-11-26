export interface OrderItem {
  productId: number
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
  completedAt?: string
}

