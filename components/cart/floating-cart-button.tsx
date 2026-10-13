'use client'

import { useCart } from '@/contexts/cart-context'

export function FloatingCartButton() {
  const { cartCount, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      className="fixed right-6 bottom-24 z-50 size-16 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
    >
      <div className="relative">
        <img
          src="/add-to-cart.png"
          alt="Shopping Cart"
          width={40}
          height={40}
          className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
          }}
        />
        
        {cartCount > 0 && (
          <div className="absolute -top-2 -right-2 size-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center border-2 border-white animate-in zoom-in shadow-lg">
            {cartCount > 99 ? '99+' : cartCount}
          </div>
        )}
      </div>
    </button>
  )
}
