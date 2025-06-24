import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { ExternalLink, Key, MapPin, Shield } from 'lucide-react';

export default function GoogleApiSetup() {
  const steps = [
    {
      title: "Create Google Cloud Project",
      description: "Set up a new project in Google Cloud Console",
      link: "https://console.cloud.google.com/",
      icon: <ExternalLink className="w-4 h-4" />
    },
    {
      title: "Enable Google My Business API",
      description: "Enable the API in your Google Cloud project",
      link: "https://console.cloud.google.com/apis/library/mybusiness.googleapis.com",
      icon: <Key className="w-4 h-4" />
    },
    {
      title: "Set up OAuth 2.0",
      description: "Configure OAuth consent screen and credentials",
      link: "https://console.cloud.google.com/apis/credentials",
      icon: <Shield className="w-4 h-4" />
    },
    {
      title: "Get Location ID",
      description: "Find your business location ID from Google My Business",
      link: "https://business.google.com/",
      icon: <MapPin className="w-4 h-4" />
    }
  ];

  const envVariables = [
    'VITE_GOOGLE_MY_BUSINESS_API_KEY',
    'VITE_GOOGLE_ACCOUNT_ID', 
    'VITE_GOOGLE_LOCATION_ID',
    'VITE_GOOGLE_CLIENT_ID',
    'VITE_GOOGLE_CLIENT_SECRET'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Google My Business API Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {steps.map((step, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    <a 
                      href={step.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Open {step.icon}
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-3">Required Environment Variables</h3>
            <div className="grid grid-cols-1 gap-2">
              {envVariables.map((envVar) => (
                <Badge key={envVar} variant="outline" className="justify-start font-mono text-xs">
                  {envVar}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Add these to your environment configuration. The API will fall back to static reviews until configured.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Notes:</h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Your business must be verified on Google My Business</li>
              <li>• API access requires OAuth 2.0 authentication</li>
              <li>• Review data may take time to sync from Google</li>
              <li>• Consider implementing rate limiting for production use</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}