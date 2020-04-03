import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  returnUrl: string;
  //username: string = "admin";
  //password: string = "123123";
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  errorMessage: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { 

    }

  ngOnInit() {
    this.errorMessage = '';
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    this.registerForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])      
    });
  }

  public hasErrorLogin = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public hasErrorRegister = (controlName: string, errorName: string) =>{
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  submit() {
    if (this.loginForm.valid) {
      this.login();
    }
  }

  public async login() {
    try {
        const url = await this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
        this.router.navigate([url])
    } catch (e) {
        this.errorMessage = 'Wrong Credentials!';
        console.error('Unable to Login!\n', e);
    }
  }

  public async register() {
    try {
        const user = await this.authService.register(this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.email)
        location.reload();
    } catch (e) {
        this.errorMessage = e;
        console.error('Unable to register!\n', e);
    }
  }

}
