import { Product } from '@/types/product'
import { 
  API_BASE_URL,
  ERROR_GET_FEATURED_PRODUCTS,
  ERROR_GET_ALL_PRODUCTS,
  ERROR_SEARCH_PRODUCTS,
  ERROR_GET_PRODUCT,
  QUERY_PARAM_PRICE_GTE,
  QUERY_PARAM_PRICE_LTE,
  DEFAULT_CATEGORY,
} from '@/constants/common'
import { ProductError } from '@/lib/errors'

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products?_limit=6`)
  
  if (!response.ok) {
    throw new ProductError(ERROR_GET_FEATURED_PRODUCTS)
  }
  
  return response.json()
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`)
  
  if (!response.ok) {
    throw new ProductError(ERROR_GET_ALL_PRODUCTS)
  }
  
  return response.json()
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  color?: string
}

export const searchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams()
  
  if (filters.search) {
    params.append('q', filters.search)
  }
  
  if (filters.category) {
    params.append('category', filters.category)
  }
  
  if (filters.minPrice !== undefined) {
    params.append(QUERY_PARAM_PRICE_GTE, filters.minPrice.toString())
  }
  
  if (filters.maxPrice !== undefined) {
    params.append(QUERY_PARAM_PRICE_LTE, filters.maxPrice.toString())
  }
  
  if (filters.color) {
    params.append('color', filters.color)
  }
  
  const queryString = params.toString()
  const url = queryString 
    ? `${API_BASE_URL}/products?${queryString}`
    : `${API_BASE_URL}/products`
  
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new ProductError(ERROR_SEARCH_PRODUCTS)
  }
  
  let products: Product[] = await response.json()
  
  // Filter by search text if provided (json-server doesn't support full-text search well)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    products = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
    )
  }
  
  return products
}

export const getProductById = async (id: number): Promise<Product | null> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new ProductError(ERROR_GET_PRODUCT)
  }
  
  const product: Product = await response.json()
  
  // Generate images array if not exists
  if (!product.images) {
    product.images = [
      product.image,
      product.image,
      product.image,
      product.image,
      product.image,
    ]
  }
  
  // Set default values if missing
  if (!product.shortDescription) {
    product.shortDescription = product.description || ''
  }
  
  if (!product.fullDescription) {
    const category = product.category || DEFAULT_CATEGORY
    product.fullDescription = `
      <p><strong>Tên phổ thông:</strong> ${product.name}</p>
      <p><strong>Tên khoa học:</strong> ${product.name}</p>
      <p><strong>Họ thực vật:</strong> ${category}</p>
      <p><strong>Chiều cao:</strong> 0,8-1,2m</p>
      <p>${product.description || 'Sản phẩm chất lượng cao, phù hợp cho không gian sống của bạn.'}</p>
      <p>Cây có nguồn gốc từ nhiều nơi trên thế giới, được du nhập và phân bố rộng khắp ở Việt Nam. Cây phát triển tốt trong môi trường trong nhà, thích hợp với ánh sáng gián tiếp và độ ẩm vừa phải.</p>
    `
  }
  
  if (!product.tags) {
    product.tags = [DEFAULT_CATEGORY, 'Trang trí', product.category || 'Phổ biến']
  }
  
  // Get related products
  const allProducts = await getAllProducts()
  product.relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
    .slice(0, 4)
  
  return product
}

