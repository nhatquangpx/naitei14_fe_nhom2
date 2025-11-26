export class APIError extends Error {
  constructor(message: string, public statusCode?: number, public originalError?: Error) {
    super(message)
    this.name = 'APIError'
  }
}

export class ProductError extends APIError {
  constructor(message: string, public originalError?: Error) {
    super(message, undefined, originalError)
    this.name = 'ProductError'
  }
}

export class OrderError extends APIError {
  constructor(message: string, public originalError?: Error) {
    super(message, undefined, originalError)
    this.name = 'OrderError'
  }
}

export class ReviewError extends APIError {
  constructor(message: string, public originalError?: Error) {
    super(message, undefined, originalError)
    this.name = 'ReviewError'
  }
}

