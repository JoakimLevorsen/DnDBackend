import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket
  announcement$: BehaviorSubject<string> = new BehaviorSubject("")
  constructor() { }

  startSocket() {
    this.socket = new WebSocket('wss://localhost:5001/ws');
    this.socket.addEventListener("open", o => {
      console.log('did open', o)
      this.announcement$.next("Opened")
    })
    this.socket.addEventListener("message", o => console.log('m', o))
    this.socket.addEventListener("error", o => console.log('e', o))
    this.socket.addEventListener("close", o => console.log('c', o))
  }

  sendSomething() {
    this.socket.send(JSON.stringify({a: 21}))
  }
}
