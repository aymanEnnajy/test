import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Mail, Smartphone, Key, Eye, EyeOff, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getInitials } from '@/lib/utils';

export function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: false, tasks: true, vacation: true, payroll: true });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" />Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="w-4 h-4" />Security</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" />Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle className="text-lg">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">{user ? getInitials(user.first_name, user.last_name) : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>First Name</Label><Input defaultValue={user?.first_name} /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input defaultValue={user?.last_name} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue={user?.email} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="+1 555-0000" /></div>
                <div className="space-y-2 md:col-span-2"><Label>Department</Label><Input defaultValue={user?.department_id || ''} disabled /></div>
                <div className="space-y-2 md:col-span-2"><Label>Position</Label><Input defaultValue={user?.position || ''} disabled /></div>
              </div>
              <div className="flex justify-end"><Button className="gap-2"><Save className="w-4 h-4" />Save Changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-lg">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Mail className="w-4 h-4" />Email Notifications</h4>
                <div className="flex items-center justify-between"><div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground">Receive notifications via email</p></div><Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))} /></div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Smartphone className="w-4 h-4" />Push Notifications</h4>
                <div className="flex items-center justify-between"><div><p className="font-medium">Push Notifications</p><p className="text-sm text-muted-foreground">Receive push notifications</p></div><Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))} /></div>
              </div>
              <div className="flex justify-end"><Button className="gap-2"><Save className="w-4 h-4" />Save Preferences</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle className="text-lg">Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Key className="w-4 h-4" />Change Password</h4>
                <div className="space-y-3">
                  <div className="space-y-2"><Label>Current Password</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
                  <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" /></div>
                </div>
              </div>
              <div className="flex justify-end"><Button className="gap-2"><Save className="w-4 h-4" />Update Password</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle className="text-lg">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Theme</h4>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div><p className="font-medium">Dark Mode</p><p className="text-sm text-muted-foreground">Toggle between light and dark theme</p></div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2"><Globe className="w-4 h-4" />Language</h4>
                <select className="flex-1 p-2 rounded-md border border-border bg-background w-full">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
