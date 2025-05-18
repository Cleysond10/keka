import { SmashUploader } from "@smash-sdk/uploader";

export interface EmailData {
  to: string;
  subject: string;
  message: string;
  files: File[];
}

export interface EmailServiceAdapter {
  sendEmail: (data: EmailData) => Promise<void>;
}

export class SmashEmailService implements EmailServiceAdapter {
  private uploader: SmashUploader;

  constructor() {
    this.uploader = new SmashUploader({
      region: "eu-west-3",
      token: import.meta.env.VITE_SMASH_API_KEY,
    });
  }

  async sendEmail(data: EmailData): Promise<void> {
    try {
      // Upload files to Smash
      const transfer = await this.uploader.upload({
        files: data.files,
        title: data.subject,
        description: data.message,
        // emails: [data.to]
      });

      if (!transfer || !transfer.transfer) {
        throw new Error('Failed to upload files to Smash');
      }

      console.log('Smash transfer created:', transfer);
    } catch (error) {
      console.error('Smash upload error:', error);
      throw new Error('Failed to send files. Please try again.');
    }
  }
}

export class TnwEmailService implements EmailServiceAdapter {
  private readonly API_KEY = import.meta.env.VITE_TRANSFERNOW_API_KEY;
  private readonly API_URL = 'https://api.transfernow.net/v1/transfers';

  async sendEmail(data: EmailData): Promise<void> {
    try {
      const now = new Date();
      const validityEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      const requestBody = {
        langCode: 'en',
        toEmails: [data.to],
        files: data.files.map(file => ({
          name: file.name,
          size: file.size
        })),
        message: data.message,
        subject: data.subject,
        validityStart: now.toISOString(),
        validityEnd: validityEnd.toISOString(),
        allowPreview: true,
        maxDownloads: 7
      };

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.API_KEY
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send files');
      }

      const result = await response.json();
      console.log('TransferNow transfer created:', result);
    } catch (error) {
      console.error('TransferNow API error:', error);
      throw new Error('Failed to send files. Please try again.');
    }
  }
}
