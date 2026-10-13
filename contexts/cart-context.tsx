'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export interface CartItem {
  id: string
  type: 'menu_item' | 'menu_package'
  name: string
  price: number
  quantity: number
  image_url?: string
  description?: string
  // For packages
  serves_persons?: number
  items?: any[]
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  isAuthenticated: boolean
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  checkAuth: () => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('lydias_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('lydias_cart', JSON.stringify(cart))
  }, [cart])

  const checkAuth = async (): Promise<boolean> => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const authenticated = !!user
    setIsAuthenticated(authenticated)
    return authenticated
  }

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      // Check if item already exists
      const existingIndex = prevCart.findIndex(i => i.id === item.id && i.type === item.type)
      
      if (existingIndex >= 0) {
        // Update quantity
        const newCart = [...prevCart]
        newCart[existingIndex].quantity += 1
        toast.success(`Added another ${item.name} to cart`, {
          description: `Quantity: ${newCart[existingIndex].quantity}`,
        })
        return newCart
      } else {
        // Add new item
        toast.success(`${item.name} added to cart!`, {
          description: 'Click the cart icon to view your items',
        })
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.id === id)
      if (item) {
        toast.info(`${item.name} removed from cart`)
      }
      return prevCart.filter(item => item.id !== id)
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    if (cart.length > 0) {
      toast.info('Cart cleared')
    }
    setCart([])
  }

  const openCart = async () => {
    const authenticated = await checkAuth()
    if (!authenticated) {
      router.push('/events/login?next=' + window.location.pathname)
      return
    }
    setIsCartOpen(true)
  }

  const closeCart = () => {
    setIsCartOpen(false)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        isAuthenticated,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        checkAuth,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
