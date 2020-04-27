import { isLoginInfo } from "./responses/LoginInfo";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import requestBuilder from "./requestBuilder";
import { Campaign, isCampaign, isCampaignArray } from "./responses/Campaigns";
import { GameState } from "./responses/GameState";

@Injectable({
    providedIn: "root",
})
export class WebSocketService {
    private socket: WebSocket;
    private _username?: string;
    announcement$: BehaviorSubject<string> = new BehaviorSubject("");
    auth$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    joinableCampaigns$: BehaviorSubject<Campaign[]> = new BehaviorSubject([]);
    fetchedCampaigns$: BehaviorSubject<
        Map<number, Campaign>
    > = new BehaviorSubject(new Map());
    gameState$: BehaviorSubject<GameState | null> = new BehaviorSubject(null);

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
            if (isCampaign(parsed)) {
                const fetchedNow = this.fetchedCampaigns$.value;
                fetchedNow.set(parsed.ID, parsed);
                this.fetchedCampaigns$.next(fetchedNow);
                return;
            }
            if (isCampaignArray(parsed)) {
                this.joinableCampaigns$.next(parsed);
                return;
            }
            // Since we've parsed some JSON, and the response was not the other types, this must be a gameState
            this.gameState$.next(parsed as GameState);
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
