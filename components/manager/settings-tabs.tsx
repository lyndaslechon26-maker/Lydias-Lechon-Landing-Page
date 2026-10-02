'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Settings {
  site_name?: string
  site_email?: string
  site_phone?: string
  site_address?: string
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
}

interface SettingsTabsProps {
  settings?: Settings
}

export function SettingsTabs({ settings }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your site's general settings</CardDescription>
          </CardHeader>
          <CardContent>
            {settings?.site_name ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Site Name</label>
                  <p className="text-muted-foreground">{settings.site_name}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Settings configuration coming soon...</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="contact">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Update your contact details</CardDescription>
          </CardHeader>
          <CardContent>
            {settings?.site_email || settings?.site_phone || settings?.site_address ? (
              <div className="space-y-4">
                {settings.site_email && (
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{settings.site_email}</p>
                  </div>
                )}
                {settings.site_phone && (
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-muted-foreground">{settings.site_phone}</p>
                  </div>
                )}
                {settings.site_address && (
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <p className="text-muted-foreground">{settings.site_address}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Contact settings coming soon...</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Manage your social media links</CardDescription>
          </CardHeader>
          <CardContent>
            {settings?.facebook_url || settings?.instagram_url || settings?.twitter_url ? (
              <div className="space-y-4">
                {settings.facebook_url && (
                  <div>
                    <label className="text-sm font-medium">Facebook</label>
                    <p className="text-muted-foreground">{settings.facebook_url}</p>
                  </div>
                )}
                {settings.instagram_url && (
                  <div>
                    <label className="text-sm font-medium">Instagram</label>
                    <p className="text-muted-foreground">{settings.instagram_url}</p>
                  </div>
                )}
                {settings.twitter_url && (
                  <div>
                    <label className="text-sm font-medium">Twitter</label>
                    <p className="text-muted-foreground">{settings.twitter_url}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Social media settings coming soon...</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
