import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import type { WebhookEvent } from '@clerk/backend';
import { ClerkUserService } from '../services/clerk-user.service';
import { WebhookVerificationGuard } from '../../../common/guards/webhook-verification.guard';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
    constructor(
        private readonly clerkUserService: ClerkUserService,
    ) {}

    @Post('clerk')
    @UseGuards(WebhookVerificationGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Handle Clerk webhook events' })
    @ApiHeader({ name: 'svix-id', description: 'Webhook ID' })
    @ApiHeader({ name: 'svix-timestamp', description: 'Webhook timestamp' })
    @ApiHeader({ name: 'svix-signature', description: 'Webhook signature' })
    @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
    async handleClerkWebhook(
        @Body() payload: WebhookEvent,
        @Headers() headers: Record<string, string>,
    ) {
        console.log('🔔 Clerk webhook received:', payload.type);

        try {
            switch (payload.type) {
                case 'user.created':
                    await this.handleUserCreated(payload.data);
                    break;
                case 'user.updated':
                    await this.handleUserUpdated(payload.data);
                    break;
                case 'user.deleted':
                    await this.handleUserDeleted(payload.data);
                    break;
                default:
                    console.log(`⚠️ Unhandled webhook event: ${payload.type}`);
            }

            return { success: true, message: 'Webhook processed successfully' };
        } catch (error) {
            console.error('❌ Webhook processing failed:', error);
            throw error;
        }
    }

    private async handleUserCreated(userData: any) {
        console.log('👤 Creating user from webhook:', userData.id);

        // Validate email exists
        const email = userData.email_addresses?.[0]?.email_address;
        if (!email) {
            throw new Error('User email is required but not provided in webhook data');
        }

        const user = await this.clerkUserService.findOrCreateUser({
            clerkId: userData.id,
            email,
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            profileImageUrl: userData.profile_image_url,
        });

        console.log('✅ User created:', {
            userId: user.id,
            clerkId: user.clerkId,
        });

        return user;
    }

    private async handleUserUpdated(userData: any) {
        console.log('👤 Updating user from webhook:', userData.id);

        const user = await this.clerkUserService.findByClerkId(userData.id);
        if (!user) {
            console.log('⚠️ User not found for update, creating new user');
            return await this.handleUserCreated(userData);
        }

        const updatedUser = await this.clerkUserService.findOrCreateUser({
            clerkId: userData.id,
            email: userData.email_addresses[0]?.email_address || user.email,
            firstName: userData.first_name || user.firstName,
            lastName: userData.last_name || user.lastName,
            profileImageUrl: userData.profile_image_url || user.profileImageUrl,
        });

        console.log('✅ User updated:', updatedUser.id);
        return updatedUser;
    }

    private async handleUserDeleted(userData: any) {
        console.log('👤 Deleting user from webhook:', userData.id);

        const user = await this.clerkUserService.findByClerkId(userData.id);
        if (user) {
            user.isActive = false;
            await this.clerkUserService.updateUser(user);
            console.log('✅ User deactivated:', user.id);
        }

        return user;
    }
}
