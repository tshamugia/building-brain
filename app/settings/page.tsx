'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Bell, User, Lock, Database, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your application preferences and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>General</CardTitle>
                <CardDescription>Basic application settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Building Name
              </label>
              <input
                type="text"
                defaultValue="Demo Business Center"
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Timezone
              </label>
              <select className="mt-1 w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[44px]">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
            <Button className="w-full min-h-[44px]">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage alert preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Critical Alerts
                </p>
                <p className="text-xs text-gray-500">Immediate notifications for critical issues</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 min-w-[20px] min-h-[20px] cursor-pointer flex-shrink-0" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Warning Alerts
                </p>
                <p className="text-xs text-gray-500">Notifications for warning-level events</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5 min-w-[20px] min-h-[20px] cursor-pointer flex-shrink-0" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Digest
                </p>
                <p className="text-xs text-gray-500">Daily summary of system status</p>
              </div>
              <input type="checkbox" className="h-5 w-5 min-w-[20px] min-h-[20px] cursor-pointer flex-shrink-0" />
            </div>
            <Button className="w-full min-h-[44px]">Update Preferences</Button>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your profile</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Facility Manager"
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                defaultValue="manager@example.com"
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[44px]"
              />
            </div>
            <Button className="w-full min-h-[44px]">Update Profile</Button>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Database className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Claude AI integration settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Anthropic API Key
              </label>
              <input
                type="password"
                placeholder="sk-ant-..."
                className="mt-1 w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[44px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add your API key in .env.local file
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analysis Frequency
              </label>
              <select className="mt-1 w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[44px]">
                <option>Manual only</option>
                <option>Every hour</option>
                <option>Every 6 hours</option>
                <option>Daily</option>
              </select>
            </div>
            <Button className="w-full min-h-[44px]">Save Configuration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
