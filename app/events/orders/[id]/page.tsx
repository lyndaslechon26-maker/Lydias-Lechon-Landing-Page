import { getOnlineOrder } from "@/app/actions/online-orders"
import { requireAuth } from "@/lib/auth/customer-auth"
import { notFound, redirect } from "next/navigation"
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Store, 
  CreditCard,
  Package,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const resolvedParams = await params
  const customer = await requireAuth()
  const { order, error } = await getOnlineOrder(resolvedParams.id)

  if (error || !order) {
    notFound()
  }

  // Format date and time
  const orderDate = new Date(order.created_at)
  const scheduledDate = order.scheduled_time ? new Date(order.scheduled_time) : null

  // Status badge color
  const statusColors = {
    pending: "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
    confirmed: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
    preparing: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
    ready: "bg-green-100 text-green-600 dark:bg-green-900/30",
    out_for_delivery: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30",
    completed: "bg-green-100 text-green-600 dark:bg-green-900/30",
    cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30"
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Order #{order.order_number}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <Card>
              <CardHeader className="px-6 py-5">
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-semibold capitalize">
                      {order.status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ordered on {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="px-6 py-5">
                <CardTitle className="flex items-center gap-2">
                  <Package className="size-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="relative size-16 rounded bg-muted flex-shrink-0">
                        {item.image_url && (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-amber-600">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ₱{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery/Pickup Info */}
            <Card>
              <CardHeader className="px-6 py-5">
                <CardTitle className="flex items-center gap-2">
                  {order.order_type === 'delivery' ? (
                    <><MapPin className="size-5" /> Delivery Information</>
                  ) : (
                    <><Store className="size-5" /> Pickup Information</>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="font-semibold capitalize">{order.order_type}</p>
                </div>
                
                {order.order_type === 'delivery' && order.delivery_address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                    <p className="font-semibold">{order.delivery_address}</p>
                  </div>
                )}

                {order.delivery_notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p>{order.delivery_notes}</p>
                  </div>
                )}

                {scheduledDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Scheduled Time</p>
                    <p className="font-semibold">
                      {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="px-6 py-5">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₱{Number(order.subtotal).toLocaleString()}</span>
                  </div>
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>₱{Number(order.delivery_fee).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-amber-600">₱{Number(order.total_amount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Payment Method</span>
                  </div>
                  <p className="text-sm capitalize">{order.payment_method.replace(/_/g, ' ')}</p>
                  <p className={`text-xs mt-1 ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    Payment Status: {order.payment_status}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Link href="/events/dashboard" className="block">
                    <Button variant="outline" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link href="/events/menu" className="block">
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                      Order More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Information */}
        <Card className="mt-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6 px-6 pb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="size-5 text-amber-600" />
              Important Information
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground ml-7">
              <li>• Your order is being processed and will be prepared shortly</li>
              <li>• We'll contact you at {order.customer_phone} for any updates</li>
              <li>• Please keep your phone accessible for order confirmation</li>
              {order.order_type === 'delivery' && (
                <li>• Estimated delivery time: 45-60 minutes</li>
              )}
              {order.order_type === 'pickup' && (
                <li>• You can pick up your order once it's ready</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
