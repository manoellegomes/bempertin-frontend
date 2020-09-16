import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';

import { TextsPortuguese } from "../../../shared/texts/texts-portuguese";

@Component({
  selector: "app-homepage",
  templateUrl: "homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  constructor(
    public texts: TextsPortuguese,
    private router: Router
  ) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");

    if (localStorage['token'] || sessionStorage['token']) {
      this.router.navigate(["/myprofile"]);
    }

  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }
}
