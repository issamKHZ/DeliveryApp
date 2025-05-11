import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RegisterOptionsComponent } from "../../../shared/components/register/register-options/register-options.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    CommonModule,
    RouterOutlet
],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  entrepriseForm: UntypedFormGroup;
  livreurForm: UntypedFormGroup;
}
