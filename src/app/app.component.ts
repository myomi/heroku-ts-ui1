import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.renewTokens();
    } else if (this.router.url !== "/login") {
      this.router.navigate(["/login"]);
    }
  }
}
