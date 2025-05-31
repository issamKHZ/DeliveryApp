import { Component, Input, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';

export enum TagSeverity {
  SUCCESS,
  DANGER,
  WARN,
  INFO
}

@Component({
  selector: 'app-custom-tag',
  standalone: true,
  imports: [TagModule],
  templateUrl: './custom-tag.component.html',
  styleUrl: './custom-tag.component.scss'
})
export class CustomTagComponent implements OnInit {

  @Input() type: TagSeverity;
  @Input() content: string;

  styleClass: string;

  ngOnInit(): void {
    switch (this.type) {
      case TagSeverity.SUCCESS:
        this.styleClass = 'tag-success';
        break;
      case TagSeverity.DANGER:
        this.styleClass = 'tag-danger';
        break;
      case TagSeverity.INFO:
        this.styleClass = 'tag-info';
        break;
      case TagSeverity.WARN:
        this.styleClass = 'tag-warn';
        break;
      default:
        this.styleClass = 'tag-info';
        break;
    }
  }
}
