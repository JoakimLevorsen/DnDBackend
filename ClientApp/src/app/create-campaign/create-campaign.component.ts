import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'CreateCampaign',
    templateUrl: './create-campaign.component.html',
})
export class CreateCampaignComponent implements OnInit {
    campaignName: string;
    joinable: boolean = true;
    maxPlayers: number = 5;
    password: string;

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {}

    onSubmit() {
        this.socket.requestBuilders.campaign.create({
            name: this.campaignName,
            joinable: this.joinable,
            maxPlayers: this.maxPlayers,
            password: this.password,
        });
        // this.socket.requestBuilders.update;

        this.router.navigate(['my-campaigns']);
        console.log(
            this.campaignName,
            this.joinable,
            this.password,
            this.maxPlayers
        );
    }
}
