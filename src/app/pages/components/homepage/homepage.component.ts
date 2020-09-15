import { Component, OnInit, OnDestroy } from "@angular/core";
import { TextsPortuguese } from "../../../shared/texts/texts-portuguese";

@Component({
  selector: "app-homepage",
  templateUrl: "homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  constructor(public texts: TextsPortuguese) {}

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page");
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page");
  }

  sendLogin() {}
}
