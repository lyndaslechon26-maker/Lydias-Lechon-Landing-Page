"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--border-radius": "var(--radius)",
          "--z-index": "9999",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast border shadow-lg",
          title: "font-semibold",
          description: "text-sm",
          success: "bg-green-600 text-white border-green-700",
          info: "bg-blue-600 text-white border-blue-700",
          error: "bg-red-600 text-white border-red-700",
          warning: "bg-amber-600 text-white border-amber-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
