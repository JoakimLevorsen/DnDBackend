import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { WebSocketService } from 'src/websocket';
import { Router } from '@angular/router';

@Component({
    selector: 'Login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    hide = true;

    constructor(private socket: WebSocketService, private router: Router) {}
    usernameControl = new FormControl('', Validators.required);
    passwordControl = new FormControl('', Validators.required);

    ngOnInit() {}

    onSubmit() {
        this.socket.requestBuilders.login({
            username: this.usernameControl.value,
            password: this.passwordControl.value,
        });

        this.socket.auth$.subscribe(s => {
            if (s) {
                this.router.navigate(['/']);
            }
        });
    }
}
