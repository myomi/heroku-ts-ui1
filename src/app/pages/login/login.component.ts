import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    email: [""],
    password: [""]
  });

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {}

  login() {
    this.authService.login(
      this.form.controls.email.value,
      this.form.controls.password.value
    );
  }
}
