import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Webhook } from 'svix';

@Injectable()
export class WebhookVerificationGuard implements CanActivate {
  private webhook: Webhook;

  constructor() {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('CLERK_WEBHOOK_SECRET is not configured');
    }
    this.webhook = new Webhook(webhookSecret);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const payload = request.body;
    const headers = request.headers;

    try {
      // Verify the webhook signature
      const evt = this.webhook.verify(JSON.stringify(payload), {
        'svix-id': headers['svix-id'],
        'svix-timestamp': headers['svix-timestamp'],
        'svix-signature': headers['svix-signature'],
      });

      // Attach the verified event to the request
      request.clerkEvent = evt;
      return true;
    } catch (error) {
      console.error('Webhook verification failed:', error);
      throw new UnauthorizedException('Invalid webhook signature');
    }
  }
}
