import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'NewCampaign',
    templateUrl: './new-campaign.component.html',
    styleUrls: ['./new-campaign.component.css'],
})
export class NewCampaignComponent implements OnInit {
    campaignName = new FormControl('', Validators.required);
    joinable = new FormControl();
    maxPlayers = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {
        this.joinable = new FormControl('true');
    }

    onSubmit() {
        this.socket.requestBuilders.campaign.create({
            name: this.campaignName.value,
            joinable: this.joinable.value,
            maxPlayers: this.maxPlayers.value,
            password: this.password.value,
        });
        this.router.navigate(['my-campaigns']);
    }
    onCancel() {
        this.router.navigate(['my-campaigns']);
    }
}
