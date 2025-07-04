import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { lastValueFrom } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  constructor(private api: ApiService) {}

  async downloadBooksReport(filename: string) {
    const blob = await lastValueFrom(this.api.getBlob(API_ROUTES.BOOKS_REPORT));
    this.triggerDownload(blob, filename, 'text/html');
  }

  private triggerDownload(blob: Blob, filename: string, mimeType: string) {
    const blobUrl = window.URL.createObjectURL(
      new Blob([blob], { type: mimeType })
    );
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(blobUrl);
  }
}
