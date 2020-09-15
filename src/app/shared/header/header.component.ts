import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  @Input() backgroundDesktop: boolean;

  constructor(private router: Router) {}

  ngOnInit() {}

  logout() {
    sessionStorage.clear();
    
    if (localStorage['token']) {
      localStorage.removeItem('token');
    }

    if (localStorage['idUser']) {
      localStorage.removeItem('idUser');
    }

    this.router.navigate(["/homepage"]);
  }

  hasPermission() {
    return (sessionStorage['token'] || localStorage['token']) ? true : false;
  }
}
