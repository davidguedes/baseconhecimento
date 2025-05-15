import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

interface Setor {
  name: string,
  cod: string
}

@Component({
  selector: 'app-login',
  imports: [InputTextModule, SelectModule, CardModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  protected userService: UserService = inject(UserService);
  protected router = inject(Router);

  formBuilder = inject(FormBuilder);
  formulario!: FormGroup;
  setores: Setor[] = [];

  ngOnInit() {
    this.setores = [
      {name: 'Tecnologia', cod: 'tec_info'},
      {name: 'Recursos Humanos', cod: 'rec_huma'},
      {name: 'Fiscal', cod: 'fisc'},
    ]

    this.formulario = this.formBuilder.group({
      name: ['', [Validators.required]],
      sector: ['', [Validators.required]]
    })
  }

  logar() {
    console.log('this.formulario?.valid', this.formulario?.valid)
    if(this.formulario?.valid) {
      let user: User = {
        name: this.formulario.controls['name'].value,
        sector: this.formulario.controls['sector'].value,
      }
      this.userService.updateUser(user);

      console.log('PAssou aqui')
      this.router.navigate(['/']);
    }
  }

}
