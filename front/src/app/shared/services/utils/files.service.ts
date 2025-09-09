import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  public convertStringToFile(fileStr: string, name: string): File {
    const blob = this.dataURLtoBlob(fileStr);

    const file = new File([blob], name, {
      type: this.extractMimeType(fileStr)
    });

    return file;
  }  

  public extractMimeType(dataUri: string): string | null {
    if (!dataUri.startsWith('data:')) {
      return null;
    }

    const mimeTypeMatch = dataUri.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);/);

    return mimeTypeMatch ? mimeTypeMatch[1] : null;
  }

  extractFilenameFromUrl(fileUrl: string | ArrayBuffer): string {
    if (typeof fileUrl === 'string') {
      const match = fileUrl.match(/\/([^\/?#]+)(?:\?|#|$)/);
      return match ? match[1] : null;
    }

    return null;
  }

  public dataURLtoBlob(dataURL: string): Blob {
    if (!dataURL) return null;

    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }


  createImageUrl(base64Data: string, contentType: string): string {
    if (!this.isValidImageType(contentType)) {
      return 'assets/images/default.png';
    }

    const dataUrl = `data:${contentType};base64,${base64Data}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    return this.sanitizer.sanitize(SecurityContext.URL, safeUrl) || '';
  }

  private isValidImageType(contentType: string): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    return allowedTypes.includes(contentType);
  }

  createFileUrl(fileContents: string, contentType: string): string {
    if (!fileContents || !this.isValidFile(contentType)) return null;

    const dataUrl = `data:${contentType};base64,${fileContents}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    return this.sanitizer.sanitize(SecurityContext.URL, safeUrl) || '';
  }

  isValidFile(contentType: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/octet-stream',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    return allowedTypes.includes(contentType);
  }
}
