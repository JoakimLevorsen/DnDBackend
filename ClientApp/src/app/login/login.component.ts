import { Component, OnInit } from "@angular/core";
import { Validators, FormControl } from "@angular/forms";
import { WebSocketService } from "src/websocket";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    constructor(private socket: WebSocketService) {}
    usernameControl = new FormControl("", Validators.required);
    passwordControl = new FormControl("", Validators.required);

    ngOnInit() {}

    // TODO Login with Javabog
    onSubmit() {
        this.socket.requestBuilders.login({
            username: this.usernameControl.value,
            password: this.passwordControl.value,
        });

        // this.socket.auth$.subscribe ::: DO SOMETHING WITH THIS!
    }
}
