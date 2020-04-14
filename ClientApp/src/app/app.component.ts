import { Component } from '@angular/core';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';

  constructor(private socketService: WebSocketService) {
    this.socketService.announcement$.subscribe(m => {
      console.log("a", m); 
      if (m === "Opened") this.socketService.sendSomething()
    })
  }

  ngOnInit() {
    this.socketService.startSocket()
  }
}
