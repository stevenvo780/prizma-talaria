import crypto from 'crypto';
import axios from 'axios';

export class WebhookService {
  /**
   * Validar firma HMAC SHA256 del webhook
   */
  validateSignature(payload: string, signature: string, secret: string): boolean {
    try {
      if (!signature || !signature.startsWith('sha256=')) {
        return false;
      }

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const receivedSignature = signature.replace('sha256=', '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
      );
    } catch (error) {
      console.error('❌ [Talaria] Error validando firma:', error);
      return false;
    }
  }

  /**
   * Enviar confirmación asíncrona al Hub Central
   */
  async sendAsyncConfirmation(
    orderId: string, 
    status: 'success' | 'error', 
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      const confirmationUrl = process.env.PRIZMA_NOUS_URL || 'http://localhost:3007';
      
      const confirmationPayload = {
        orderId,
        service: 'talaria',
        status,
        timestamp: new Date().toISOString(),
        data
      };

      await axios.post(
        `${confirmationUrl}/webhooks/confirmation`,
        confirmationPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Talaria-Webhook-Client'
          },
          timeout: 5000
        }
      );

      console.log(`✅ [Talaria] Confirmación enviada - Pedido: ${orderId}, Status: ${status}`);
      
    } catch (error) {
      console.error('❌ [Talaria] Error enviando confirmación:', error);
      // No lanzar error para evitar que falle el webhook principal
    }
  }
}

export const webhookService = new WebhookService();
