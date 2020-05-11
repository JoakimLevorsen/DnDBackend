import { Component } from '@angular/core';
import { WebSocketService } from 'src/websocket';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'app';

    constructor(private socketService: WebSocketService) {
        this.socketService.auth$.subscribe(s => {
            if (s) {
                console.log("We're signed in as", this.socketService.username);
            } else console.log('Not signed in');
        });
    }

    ngOnInit() {
        this.socketService.startSocket();
    }
}
