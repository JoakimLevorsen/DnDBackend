import { isLoginInfo } from "./types/LoginInfo";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import requestBuilder from "./requestBuilder";

@Injectable({
    providedIn: "root",
})
export class WebSocketService {
    private socket: WebSocket;
    private _username?: string;
    announcement$: BehaviorSubject<string> = new BehaviorSubject("");
    auth$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    startSocket() {
        this.socket = new WebSocket("wss://localhost:5001/ws");
        this.socket.addEventListener("open", o => {
            console.log("did open", o);
            this.announcement$.next("Opened");
        });
        this.socket.addEventListener("message", r => this.onMessage(r));
        this.socket.addEventListener("error", o => console.log("e", o));
        this.socket.addEventListener("close", o =>
            console.log("server closed", o)
        );
    }

    // Auth
    signOut = () => this.auth$.next(false);
    public get username() {
        return this._username;
    }

    private onMessage(msg: MessageEvent) {
        console.log("Got message", msg);
        try {
            const parsed = JSON.parse(msg.data);
            if (isLoginInfo(parsed)) {
                this._username = parsed.username;
                this.auth$.next(true);
                // Now we try to create a character

                this.requestBuilders.character.create({
                    name: "hey",
                    class: "gey",
                    race: "bey",
                });
                return;
            }
            console.log("Got unknown message", msg);
        } catch (e) {
            console.log("Got error from websocket", msg);
        }
    }

    get requestBuilders() {
        return requestBuilder(this.socket);
    }

    sendSomething() {
        this.socket.send(
            JSON.stringify({
                type: "Login",
                payload: JSON.stringify({
                    username: "s185023",
                    password: "12345678",
                }),
            })
        );
        console.log("did send something");
    }
}
