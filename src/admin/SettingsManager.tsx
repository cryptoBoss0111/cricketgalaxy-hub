
import { useState, useEffect } from 'react';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteTagline: z.string().optional(),
  contactEmail: z.string().email('Must be a valid email address'),
  articlesPerPage: z.number().min(1, 'Must show at least 1 article per page').max(50, 'Cannot show more than 50 articles per page'),
  enableComments: z.boolean().default(true),
  enableSocialSharing: z.boolean().default(true)
});

const securitySettingsSchema = z.object({
  enforceStrongPasswords: z.boolean().default(true),
  sessionTimeoutMinutes: z.number().min(5, 'Timeout must be at least 5 minutes').max(1440, 'Timeout cannot exceed 24 hours'),
  maxLoginAttempts: z.number().min(3, 'Must allow at least 3 attempts').max(10, 'Cannot allow more than 10 attempts')
});

const socialMediaSettingsSchema = z.object({
  facebookUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  twitterUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  instagramUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  youtubeUrl: z.string().url('Must be a valid URL').or(z.literal(''))
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
type SocialMediaSettingsValues = z.infer<typeof socialMediaSettingsSchema>;

const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Forms for different settings tabs
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: 'Cricket Express',
      siteTagline: 'Your Source for Cricket News and Analysis',
      contactEmail: 'admin@cricketexpress.com',
      articlesPerPage: 10,
      enableComments: true,
      enableSocialSharing: true
    }
  });
  
  const securityForm = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      enforceStrongPasswords: true,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5
    }
  });
  
  const socialMediaForm = useForm<SocialMediaSettingsValues>({
    resolver: zodResolver(socialMediaSettingsSchema),
    defaultValues: {
      facebookUrl: 'https://facebook.com/cricketexpress',
      twitterUrl: 'https://twitter.com/cricketexpress',
      instagramUrl: 'https://instagram.com/cricketexpress',
      youtubeUrl: 'https://youtube.com/cricketexpress'
    }
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Load general settings
        const savedGeneralSettings = localStorage.getItem('cricketexpress_general_settings');
        if (savedGeneralSettings) {
          const parsedSettings = JSON.parse(savedGeneralSettings);
          generalForm.reset(parsedSettings);
        }
        
        // Load security settings
        const savedSecuritySettings = localStorage.getItem('cricketexpress_security_settings');
        if (savedSecuritySettings) {
          const parsedSettings = JSON.parse(savedSecuritySettings);
          securityForm.reset(parsedSettings);
        }
        
        // Load social media settings
        const savedSocialSettings = localStorage.getItem('cricketexpress_social_settings');
        if (savedSocialSettings) {
          const parsedSettings = JSON.parse(savedSocialSettings);
          socialMediaForm.reset(parsedSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load saved settings',
          variant: 'destructive'
        });
      }
    };
    
    loadSettings();
  }, []);
  
  const saveGeneralSettings = async (values: GeneralSettingsValues) => {
    setIsLoading(true);
    try {
      // In a real app, this would save to the database
      // For now, we'll just save to localStorage
      localStorage.setItem('cricketexpress_general_settings', JSON.stringify(values));
      
      toast({
        title: 'Success',
        description: 'General settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSecuritySettings = async (values: SecuritySettingsValues) => {
    setIsLoading(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('cricketexpress_security_settings', JSON.stringify(values));
      
      toast({
        title: 'Success',
        description: 'Security settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSocialMediaSettings = async (values: SocialMediaSettingsValues) => {
    setIsLoading(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('cricketexpress_social_settings', JSON.stringify(values));
      
      toast({
        title: 'Success',
        description: 'Social media settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Settings</h1>
            <p className="text-gray-500 mt-1">Configure website settings and preferences</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic website settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(saveGeneralSettings)} className="space-y-6">
                    <FormField
                      control={generalForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of your website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="siteTagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            A short description of your website
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormDescription>
                            Email address displayed on the contact page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="articlesPerPage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Articles Per Page</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of articles to display per page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="enableComments"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable Comments</FormLabel>
                              <FormDescription>
                                Allow users to comment on articles
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="enableSocialSharing"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable Social Sharing</FormLabel>
                              <FormDescription>
                                Show social media sharing buttons
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security settings for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(saveSecuritySettings)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="enforceStrongPasswords"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Enforce Strong Passwords</FormLabel>
                            <FormDescription>
                              Require complex passwords for admin accounts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeoutMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="5" 
                              max="1440"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                            />
                          </FormControl>
                          <FormDescription>
                            Time before an inactive admin session expires
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Login Attempts</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="3" 
                              max="10"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of failed login attempts before temporary lockout
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="p-4 border rounded-lg bg-amber-50">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800">Admin Security Notice</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            These security settings are simulated for demonstration purposes. 
                            In a production environment, additional configuration would be required 
                            via Supabase Auth settings and server-side validation.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media Settings Tab */}
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>
                  Configure your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...socialMediaForm}>
                  <form onSubmit={socialMediaForm.handleSubmit(saveSocialMediaSettings)} className="space-y-6">
                    <FormField
                      control={socialMediaForm.control}
                      name="facebookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Page URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/yourpage" />
                          </FormControl>
                          <FormDescription>
                            Link to your Facebook page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialMediaForm.control}
                      name="twitterUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter Profile URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://twitter.com/yourhandle" />
                          </FormControl>
                          <FormDescription>
                            Link to your Twitter profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialMediaForm.control}
                      name="instagramUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Profile URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://instagram.com/yourhandle" />
                          </FormControl>
                          <FormDescription>
                            Link to your Instagram profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={socialMediaForm.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Channel URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://youtube.com/yourchannel" />
                          </FormControl>
                          <FormDescription>
                            Link to your YouTube channel
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsManager;
