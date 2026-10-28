'use client'

import { useCart } from '@/contexts/cart-context'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function CartModal() {
  const {
    cart,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  return (
    <Dialog open={isCartOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="size-6 text-amber-600" />
            Your Cart
          </DialogTitle>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="size-24 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <ShoppingBag className="size-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start adding delicious items to your cart!
            </p>
            <Button
              onClick={closeCart}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4 max-h-[calc(90vh-240px)]">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative size-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <ShoppingBag className="size-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.type === 'menu_package' ? 'Package' : 'Menu Item'}
                            {item.serves_persons && ` • Good for ${item.serves_persons} persons`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 flex-shrink-0"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="size-3 text-red-600" />
                        </Button>
                      </div>

                      {/* Price and Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-600">
                            ₱{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₱{item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-4 border-t space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-amber-600">₱{cartTotal.toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Link href="/events/checkout" className="flex-1">
                  <Button
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    onClick={closeCart}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={closeCart}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
