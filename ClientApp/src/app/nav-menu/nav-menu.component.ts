import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent {
    private isExpanded = false;
    navLinks = [
        { path: '/', label: 'Dashboard', index: 0 },
        { path: '/my-campaigns', label: 'My Campaigns', index: 1 },
        { path: '/my-characters', label: 'My Characters', index: 2 },
    ];
    private activeLinkIndex = -1;
    private signedIn = false;

    constructor(private router: Router, private socket: WebSocketService) {}

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    ngOnInit(): void {
        this.router.events.subscribe(res => {
            this.activeLinkIndex = this.navLinks.indexOf(
                this.navLinks.find(tab => tab.path === '.' + this.router.url)
            );
        });
        this.socket.auth$.subscribe(s => (this.signedIn = s));
    }

    reload = () => window.location.reload();
}
