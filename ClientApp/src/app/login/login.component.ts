import { Component, OnInit } from "@angular/core";
import { Validators, FormControl } from "@angular/forms";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    usernameControl = new FormControl("", Validators.required);
    passwordControl = new FormControl("", Validators.required);

    constructor() {}

    ngOnInit() {}

    // TODO check login with Javabog
    onSubmit() {
        if (this.usernameControl.valid && this.passwordControl.valid) {
            console.log("you are logged in!");
        } else console.log("Submitted, but not logged in!");
    }
}
