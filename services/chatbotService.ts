import Constants from 'expo-constants';

function getChatbotUrl(): string {
  // In production or if env is explicitly set to a non-loopback address, use it directly
  const envUrl = process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL as string;

  // If running on a real device or emulator, replace loopback with the dev server's host IP
  if (
    envUrl &&
    (envUrl.includes('127.0.0.1') || envUrl.includes('localhost'))
  ) {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const hostIp = hostUri.split(':')[0];
      // Replace the loopback address with the dev server's IP
      return envUrl.replace(/127\.0\.0\.1|localhost/, hostIp);
    }
  }

  return envUrl;
}

const N8N_WEBHOOK_URL = getChatbotUrl();

export const chatbotService = {
  async sendMessage(message: string) {
    console.log('Chatbot URL:', N8N_WEBHOOK_URL);
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw Response:', responseText);

      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let replyText = responseText;
      try {
        const parsed = JSON.parse(responseText);
        if (parsed.reply) {
          replyText = parsed.reply;
        }
      } catch {
        console.warn('Response is not valid JSON, using raw text');
      }

      return {
        success: true,
        response: replyText,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Chatbot Error:', error);
      return {
        success: false,
        error: 'Unable to connect to chatbot. Please try again.',
      };
    }
  },
};
