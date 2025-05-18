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
      const transfer = await this.uploader.upload({
        files: data.files,
        title: data.subject,
        description: data.message,
        delivery: {
          type: "Email",
          sender: {
            name: "Cleide Fotos",
            email: "cleidefotos2017@gmail.com",
          },
          receivers: [data.to],
        },
        notification: {
          receiver: {
            enabled: true,
          }
        },
        language: "pt",
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
  async sendEmail(data: EmailData): Promise<void> {
    try {
      const now = new Date();
      const validityEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const formData = new FormData();

      formData.append('langCode', 'pt');
      formData.append('validityStart', now.toISOString());
      formData.append('validityEnd', validityEnd.toISOString());
      formData.append('allowPreview', 'true');
      formData.append('maxDownloads', '7');
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      formData.append('toEmails', JSON.stringify([data.to]));

      for (const file of data.files) {
        formData.append('files', file);
      }

      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        body: formData,
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
