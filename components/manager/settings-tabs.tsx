'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsTabs() {
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
            <p className="text-muted-foreground">Settings configuration coming soon...</p>
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
            <p className="text-muted-foreground">Contact settings coming soon...</p>
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
            <p className="text-muted-foreground">Social media settings coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
