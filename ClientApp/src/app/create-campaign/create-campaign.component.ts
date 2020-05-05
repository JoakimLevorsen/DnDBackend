import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'CreateCampaign',
    templateUrl: './create-campaign.component.html',
})
export class CreateCampaignComponent implements OnInit {
    campaignName = new FormControl();
    joinable: boolean = true;
    maxPlayers = new FormControl();
    password = new FormControl();

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {}

    onSubmit() {
        this.socket.requestBuilders.campaign.create({
            name: this.campaignName.value,
            joinable: this.joinable,
            maxPlayers: this.maxPlayers.value,
            password: this.password.value,
        });
        // this.socket.requestBuilders.update;

        this.router.navigate(['my-campaigns']);
        console.log(
            this.campaignName.value,
            this.joinable,
            this.password.value,
            this.maxPlayers.value
        );
    }
}
