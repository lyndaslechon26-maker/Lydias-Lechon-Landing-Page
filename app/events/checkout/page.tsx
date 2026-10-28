"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { createOnlineOrder, type CheckoutItem } from "@/app/actions/online-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  ShoppingBag, 
  MapPin, 
  Store, 
  CreditCard, 
  Clock,
  ArrowLeft,
  Loader2,
  Truck,
  Check,
  Wallet
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, checkAuth } = useCart()
  
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash' | 'card' | 'bank_transfer'>('cash')
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check auth and cart on mount
  useEffect(() => {
    const init = async () => {
      const authenticated = await checkAuth()
      if (!authenticated) {
        router.push("/events/login?next=/events/checkout")
        return
      }
      
      if (cart.length === 0) {
        toast.error("Your cart is empty")
        router.push("/events/menu")
      }
    }
    init()
  }, [])

  const deliveryFee = orderType === 'delivery' ? 50 : 0
  const total = cartTotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast.error("Please enter delivery address")
      return
    }

    setIsSubmitting(true)

    try {
      // Map cart items to checkout items
      const items: CheckoutItem[] = cart.map(item => ({
        item_id: item.id,
        type: item.type,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      }))

      const { order, error } = await createOnlineOrder({
        items,
        order_type: orderType,
        delivery_address: orderType === 'delivery' ? deliveryAddress : undefined,
        delivery_notes: deliveryNotes || undefined,
        payment_method: paymentMethod,
        scheduled_time: scheduledTime || undefined
      })

      if (error) {
        toast.error(error)
        return
      }

      // Clear cart
      clearCart()

      // Show success and redirect
      toast.success("Order placed successfully!", {
        description: `Order #${order?.order_number}`
      })

      router.push(`/events/orders/${order?.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to place order")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30 dark:from-background dark:via-background dark:to-background pt-24 pb-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 hover:bg-amber-100 dark:hover:bg-amber-900/20"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Menu
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
              <ShoppingBag className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-muted-foreground">Complete your order details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Type */}
              <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-left">
                <CardHeader className="space-y-2 pb-6 px-6 pt-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Truck className="size-5 text-amber-600" />
                    Order Type
                  </CardTitle>
                  <CardDescription>How would you like to receive your order?</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <RadioGroup value={orderType} onValueChange={(v) => setOrderType(v as any)} className="space-y-3">
                    <div 
                      className={`relative flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        orderType === 'delivery' 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-sm' 
                          : 'border-border hover:border-amber-300 hover:bg-accent'
                      }`}
                      onClick={() => setOrderType('delivery')}
                    >
                      <RadioGroupItem value="delivery" id="delivery" className="flex-shrink-0" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer flex items-center gap-3">
                        <div className={`flex items-center justify-center size-12 rounded-full ${
                          orderType === 'delivery' ? 'bg-amber-500' : 'bg-amber-100 dark:bg-amber-900/30'
                        } transition-colors`}>
                          <MapPin className={`size-6 ${orderType === 'delivery' ? 'text-white' : 'text-amber-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-base">Delivery</p>
                          <p className="text-sm text-muted-foreground">Get it delivered to your doorstep • ₱50 fee</p>
                        </div>
                      </Label>
                      {orderType === 'delivery' && (
                        <Check className="size-5 text-amber-600 absolute top-4 right-4" />
                      )}
                    </div>

                    <div 
                      className={`relative flex items-center space-x-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        orderType === 'pickup' 
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-sm' 
                          : 'border-border hover:border-amber-300 hover:bg-accent'
                      }`}
                      onClick={() => setOrderType('pickup')}
                    >
                      <RadioGroupItem value="pickup" id="pickup" className="flex-shrink-0" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer flex items-center gap-3">
                        <div className={`flex items-center justify-center size-12 rounded-full ${
                          orderType === 'pickup' ? 'bg-amber-500' : 'bg-amber-100 dark:bg-amber-900/30'
                        } transition-colors`}>
                          <Store className={`size-6 ${orderType === 'pickup' ? 'text-white' : 'text-amber-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-base">Pickup</p>
                          <p className="text-sm text-muted-foreground">Pick up at our store • No extra fee</p>
                        </div>
                      </Label>
                      {orderType === 'pickup' && (
                        <Check className="size-5 text-amber-600 absolute top-4 right-4" />
                      )}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address (if delivery) */}
              {orderType === 'delivery' && (
                <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-left" style={{animationDelay: '0.1s'}}>
                  <CardHeader className="space-y-2 pb-6 px-6 pt-6">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin className="size-5 text-amber-600" />
                      Delivery Address
                    </CardTitle>
                    <CardDescription>Where should we deliver your order?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1 mb-2">
                        Full Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="House No., Street, Barangay, City, Province"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required={orderType === 'delivery'}
                        rows={3}
                        className="resize-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-1 mb-2">
                        Delivery Notes <span className="text-xs text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Landmark, gate code, special instructions..."
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        rows={2}
                        className="resize-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Scheduled Time */}
              <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-left" style={{animationDelay: '0.2s'}}>
                <CardHeader className="space-y-2 pb-6 px-6 pt-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Clock className="size-5 text-amber-600" />
                    Scheduled Time
                  </CardTitle>
                  <CardDescription>When would you like to receive your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-6 pb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                    <Clock className="size-5 text-amber-600 flex-shrink-0" />
                    <Input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="size-1 rounded-full bg-amber-500"></span>
                    Leave empty for ASAP {orderType === 'delivery' ? 'delivery' : 'pickup'} (45-60 minutes)
                  </p>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-left" style={{animationDelay: '0.3s'}}>
                <CardHeader className="space-y-2 pb-6 px-6 pt-6">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Wallet className="size-5 text-amber-600" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>How would you like to pay for your order?</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { value: 'cash', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                        { value: 'gcash', label: 'GCash', icon: '💳', desc: 'Pay online instantly' },
                        { value: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Secure card payment' },
                        { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Direct bank transfer' },
                      ].map((method) => (
                        <div
                          key={method.value}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            paymentMethod === method.value
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 shadow-sm'
                              : 'border-border hover:border-amber-300 hover:bg-accent'
                          }`}
                          onClick={() => setPaymentMethod(method.value as any)}
                        >
                          <RadioGroupItem value={method.value} id={method.value} className="sr-only" />
                          <Label htmlFor={method.value} className="cursor-pointer block">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{method.icon}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{method.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
                              </div>
                            </div>
                          </Label>
                          {paymentMethod === method.value && (
                            <Check className="size-4 text-amber-600 absolute top-3 right-3" />
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 border-2 shadow-lg animate-slide-right">
                <CardHeader className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-t-xl px-6 py-5">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="size-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Items */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 text-sm p-3 rounded-lg hover:bg-accent transition-colors">
                        <div className="relative size-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden border">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center">
                              <ShoppingBag className="size-6 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-2 text-sm leading-tight mb-1">{item.name}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × ₱{item.price.toLocaleString()}
                            </p>
                            <p className="font-semibold text-amber-600">
                              ₱{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 pt-6 border-t-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                      <span className="font-medium">₱{cartTotal.toLocaleString()}</span>
                    </div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Truck className="size-3" />
                          Delivery Fee
                        </span>
                        <span className="font-medium">₱{deliveryFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg pt-3 border-t-2">
                      <span>Total Amount</span>
                      <span className="text-2xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        ₱{total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-5 mr-2 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="size-5 mr-2" />
                        Place Order • ₱{total.toLocaleString()}
                      </>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center justify-center size-5 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Check className="size-3 text-green-600" />
                    </div>
                    <span>Secure Checkout</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
