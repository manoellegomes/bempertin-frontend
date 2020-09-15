import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { ProfileComponent } from "./pages/components/profile/profile.component";
import { PlacesComponent } from "./pages/components/places/places.component";
import { HomepageComponent } from "./pages/components/homepage/homepage.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "homepage", component: HomepageComponent },
  { path: "places", component: PlacesComponent },
  { path: "myprofile", component: ProfileComponent }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [],
})
export class AppRoutingModule {}
