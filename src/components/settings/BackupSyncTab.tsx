import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Database, Download, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function BackupSyncTab() {
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    cloudSync: false,
    lastSync: "2024-01-15 14:30:00",
  });

  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleLocalBackup = () => {
    setIsBackingUp(true);
    // Simulate backup process
    setTimeout(() => setIsBackingUp(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Database className="h-5 w-5" />
            Backup Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cadet-gray-700">Automatic Daily Backup</Label>
              <p className="text-sm text-cadet-gray-600">Create automatic backups every 24 hours</p>
            </div>
            <Switch
              checked={backupSettings.autoBackup}
              onCheckedChange={(checked) => setBackupSettings({...backupSettings, autoBackup: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cadet-gray-700">Cloud Sync</Label>
              <p className="text-sm text-cadet-gray-600">Sync data with cloud storage</p>
            </div>
            <Switch
              checked={backupSettings.cloudSync}
              onCheckedChange={(checked) => setBackupSettings({...backupSettings, cloudSync: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Download className="h-5 w-5" />
            Local Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cadet-gray-700">Download your data as JSON or CSV files</p>
              <p className="text-sm text-cadet-gray-600">Includes all products, sales, customers, and settings</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleLocalBackup}
                disabled={isBackingUp}
                className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50"
              >
                {isBackingUp ? "Creating..." : "Backup JSON"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLocalBackup}
                disabled={isBackingUp}
                className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50"
              >
                {isBackingUp ? "Creating..." : "Backup CSV"}
              </Button>
            </div>
          </div>

          {isBackingUp && (
            <div className="space-y-2">
              <Progress value={65} className="w-full" />
              <p className="text-sm text-cadet-gray-600">Creating backup file... 65%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-cadet-gray-200">
        <CardHeader className="bg-cadet-gray-50 border-b border-cadet-gray-200">
          <CardTitle className="flex items-center gap-2 text-cadet-gray-900">
            <Upload className="h-5 w-5" />
            Cloud Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-cadet-gray-700">Last successful sync</p>
              <p className="text-sm text-cadet-gray-600 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {backupSettings.lastSync}
              </p>
            </div>
          </div>

          {backupSettings.cloudSync && (
            <Alert className="border-cadet-gray-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-cadet-gray-700">
                Cloud sync is enabled. Your data will be automatically synchronized with Supabase.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3">
            <Button 
              className="bg-cadet-gray-700 hover:bg-cadet-gray-800 text-white"
              disabled={!backupSettings.cloudSync}
            >
              Sync Now
            </Button>
            <Button 
              variant="outline"
              className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-50"
            >
              Export Full Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-cadet-gray-50 border border-cadet-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-cadet-gray-900">Version Info</h4>
            <p className="text-sm text-cadet-gray-600">Paint Shop Management v2.1.0</p>
            <p className="text-sm text-cadet-gray-600">Build: 20240115-143000</p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-cadet-gray-300 text-cadet-gray-700 hover:bg-cadet-gray-100"
          >
            Check Updates
          </Button>
        </div>
      </div>
    </div>
  );
}