# Google Maps Integration Setup

This guide will help you set up Google Maps integration for dynamic location functionality in your Sayonara application.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project
3. Google Maps JavaScript API enabled

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for API usage)

## Step 2: Enable Google Maps APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Maps JavaScript API** - For interactive maps
   - **Geocoding API** - For converting coordinates to addresses
   - **Places API** - For location search functionality

## Step 3: Create API Keys

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Configure API Key Restrictions (Recommended)

1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s):
   - For development: `http://localhost:3000/*`
   - For production: `https://yourdomain.com/*`
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled in Step 2

## Step 5: Add API Key to Environment Variables

1. In your `frontend` directory, create a `.env.local` file (if it doesn't exist)
2. Add your API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the dashboard
3. Click on "📍 Location" in the sidebar
4. The map should load and show your current location

## Features Included

### LocationMap Component
- Interactive Google Maps integration
- Current location detection
- Draggable marker for location selection
- Address reverse geocoding
- Responsive design

### LocationDisplay Component
- Simple location display with IP-based geolocation
- Location caching in localStorage
- Manual location refresh option

### Dashboard Integration
- New "📍 Location" section in dashboard sidebar
- Location settings with map interface
- Location tips and privacy information
- Save location functionality

## Usage Examples

### Basic Map Component
```tsx
import LocationMap from '@/components/LocationMap';

<LocationMap 
  onLocationSelect={(location) => console.log(location)}
  height="400px"
/>
```

### Location Display
```tsx
import LocationDisplay from '@/components/LocationDisplay';

<LocationDisplay 
  onLocationUpdate={(location) => console.log(location)}
  showUpdateButton={true}
/>
```

## API Usage Limits

- Google Maps JavaScript API: $7 per 1,000 map loads
- Geocoding API: $5 per 1,000 requests
- Places API: $17 per 1,000 requests

For development, you get $200 free credit per month.

## Troubleshooting

### Map Not Loading
1. Check if API key is correctly set in environment variables
2. Verify API key restrictions allow your domain
3. Check browser console for error messages
4. Ensure all required APIs are enabled

### Location Not Detecting
1. Check if HTTPS is enabled (required for geolocation)
2. Verify browser permissions for location access
3. Check if IP geolocation service is accessible

### TypeScript Errors
1. Ensure the `@googlemaps/js-api-loader` package is installed
2. Check that the types file is properly referenced
3. Restart your TypeScript server if needed

## Security Considerations

1. **Never expose API keys in client-side code** - Use environment variables
2. **Restrict API keys** to specific domains and APIs
3. **Monitor API usage** to prevent unexpected charges
4. **Use HTTPS** in production for geolocation features

## Production Deployment

1. Update environment variables in your hosting platform
2. Add production domain to API key restrictions
3. Monitor API usage and costs
4. Consider implementing usage limits and caching

## Support

For Google Maps API issues:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Maps Platform Support](https://developers.google.com/maps/support) 