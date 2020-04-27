import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  navLinks = [
    {path: "/", label: "Dashboard", index: 0},
    {path: "/my-campaigns", label: "My Campaigns", index: 1},
    {path: "/my-characters", label: "My Characters", index: 2}
  ]
  activeLinkIndex = -1

  constructor(private router: Router) {}

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.path === '.' + this.router.url));
    });
  }
}
