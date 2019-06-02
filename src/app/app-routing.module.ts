import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then(m => m.LoginModule)
  },
  {
    path: "callback",
    loadChildren: () =>
      import("./pages/callback/callback.module").then(
        m => m.CallbackModule
      )
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then(m => m.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
