const N8N_WEBHOOK_URL = process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL as string;

export const chatbotService = {
  async sendMessage(message: string) {
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

      return {
        success: true,
        response: responseText,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Chatbot Error:', error);
      return {
        success: false,
        error: 'Không thể kết nối với chatbot. Vui lòng thử lại.',
      };
    }
  },
};