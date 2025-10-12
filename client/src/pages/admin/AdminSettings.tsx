import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings2, Save, Loader2 } from "lucide-react";
import { useState } from "react";

type Setting = {
  id: number;
  key: string;
  value: string;
  category: string;
  description: string | null;
  updatedAt: Date;
};

type SettingsGroup = {
  [category: string]: Setting[];
};

export default function AdminSettings() {
  const { toast } = useToast();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const { data: settingsData, isLoading } = useQuery<SettingsGroup>({
    queryKey: ['/api/admin/settings'],
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      await apiRequest("PATCH", `/api/admin/settings/${key}`, { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      setEditedValues({});
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = (setting: Setting) => {
    const newValue = editedValues[setting.key] ?? setting.value;
    if (newValue !== setting.value) {
      updateSettingMutation.mutate({ key: setting.key, value: newValue });
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const categories = settingsData ? Object.keys(settingsData) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings2 className="w-8 h-8" />
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No settings configured yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={categories[0]} className="space-y-4">
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                data-testid={`tab-${category}`}
                className="capitalize"
              >
                {category.replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-4">
                {settingsData?.[category]?.map((setting) => {
                  const currentValue = editedValues[setting.key] ?? setting.value;
                  const hasChanges = editedValues[setting.key] !== undefined && 
                    editedValues[setting.key] !== setting.value;

                  return (
                    <Card key={setting.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{setting.key}</CardTitle>
                        {setting.description && (
                          <CardDescription>{setting.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label htmlFor={`setting-${setting.id}`}>Value</Label>
                            <Input
                              id={`setting-${setting.id}`}
                              data-testid={`input-${setting.key}`}
                              value={currentValue}
                              onChange={(e) => handleValueChange(setting.key, e.target.value)}
                              placeholder="Enter value"
                            />
                          </div>
                          <Button
                            data-testid={`button-save-${setting.key}`}
                            onClick={() => handleSave(setting)}
                            disabled={!hasChanges || updateSettingMutation.isPending}
                          >
                            {updateSettingMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date(setting.updatedAt).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
