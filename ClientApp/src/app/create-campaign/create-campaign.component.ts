import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { WebSocketService } from "src/websocket";
import { FormGroup, FormControl } from "@angular/forms";

@Component({
    selector: "CreateCampaign",
    templateUrl: "./create-campaign.component.html",
})
export class CreateCampaignComponent implements OnInit {
    campaignName = new FormControl();
    joinable = new FormControl();
    maxPlayers = new FormControl();
    password = new FormControl();

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {}

    onSubmit() {
        this.socket.requestBuilders.campaign.create({
            name: this.campaignName.value,
            joinable: this.joinable.value,
            maxPlayers: this.maxPlayers.value,
            password: this.password.value,
        });

        this.router.navigate(["my-campaigns"]);
        console.log(
            this.campaignName.value,
            this.password.value,
            this.joinable.value,
            this.maxPlayers.value
        );
    }
}
