'use client'

import { FloatingCartButton } from '@/components/cart/floating-cart-button'
import { CartModal } from '@/components/cart/cart-modal'

export function CartWrapper() {
  return (
    <>
      <FloatingCartButton />
      <CartModal />
    </>
  )
}
