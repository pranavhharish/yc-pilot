# Lyzr Studio API Integration Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

\`\`\`env
# Required: Your Lyzr Studio API Key
LYZR_API_KEY=your_actual_lyzr_api_key_here

# Required: Your YC-Pilot Agent ID
LYZR_AGENT_ID=your_yc_pilot_agent_id_here

# Optional: Custom API endpoint (if different from default)
LYZR_API_ENDPOINT=https://api.lyzr.ai/v1/chat/completions

# Optional: Set to development for additional logging
NODE_ENV=development
\`\`\`

## Getting Your Lyzr Studio Credentials

1. **API Key**: 
   - Sign up for a Lyzr Studio account at [https://lyzr.ai](https://lyzr.ai)
   - Navigate to your dashboard or API settings
   - Generate or copy your API key

2. **Agent ID**:
   - In your Lyzr Studio dashboard, find your YC-Pilot agent
   - Copy the Agent ID (usually a string like "agent_123abc...")
   - Add it to your `.env.local` file

## API Request Format

The integration now sends requests in the correct Lyzr Studio format:

\`\`\`json
{
  "agent_id": "your_agent_id",
  "session_id": "unique_session_id",
  "message": "Name: John Doe\nEmail: john@example.com\nStartup Idea: [idea description]"
}
\`\`\`

## Testing the Integration

1. Set both `LYZR_API_KEY` and `LYZR_AGENT_ID` in your `.env.local` file
2. Start your development server: `npm run dev`
3. Visit the application in your browser
4. The API Status card will show connection status
5. Submit a test validation to verify the integration works

## Troubleshooting

### 422 Error - Missing Fields
- Ensure both `LYZR_API_KEY` and `LYZR_AGENT_ID` are set
- Verify the Agent ID is correct and active
- Check that the API endpoint URL is correct

### Agent ID Issues
- Verify your Agent ID is correct in the Lyzr Studio dashboard
- Ensure the agent is active and properly configured
- Check that the agent has the correct permissions

### API Key Issues
- Verify your API key is correct and active
- Check that the key has the necessary permissions
- Ensure there are no extra spaces or characters

## Support

If you encounter issues:

1. Check the API status in development mode
2. Review the browser console and server logs
3. Verify both API key and Agent ID are correct
4. Contact Lyzr Studio support for API-specific issues
