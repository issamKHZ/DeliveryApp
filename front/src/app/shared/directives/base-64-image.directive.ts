import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appBase64Image]',
  standalone: true
})
export class Base64ImageDirective implements OnChanges {

  @Input('appBase64Image') base64Data: string;
  @Input() contentType = 'image/png';
  @Input() fallbackImage = 'assets/images/default.png';

  constructor(private el: ElementRef, private sanitizer: DomSanitizer) { }

  ngOnChanges(): void {
    if (this.base64Data) {
      const dataUrl = `data:${this.contentType};base64,${this.base64Data}`;
      this.el.nativeElement.src = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
    } else {
      this.el.nativeElement.src = this.fallbackImage;
    }
  }

}
