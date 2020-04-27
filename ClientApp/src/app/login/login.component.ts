import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "Login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    private formSubmitAttempt: boolean;

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.form = this.fb.group({
            userName: ["", Validators.required],
            password: ["", Validators.required],
        });
    }
    isFieldInvalid(field: string) {
        return (
            (!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt)
        );
    }

    onSubmit() {
        if (this.form.valid) {
        }
        this.formSubmitAttempt = true;
    }
}
