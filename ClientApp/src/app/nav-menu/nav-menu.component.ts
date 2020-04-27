import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  navLinks = [
    {path: "/", label: "Dashboard"},
    {path: "/my-characters", label: "My Characters"},
    {path: "/", label: "Dashboard"}
  ]

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
