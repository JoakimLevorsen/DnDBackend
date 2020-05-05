import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from 'src/websocket/responses/Campaigns';
import { WebSocketService } from 'src/websocket';

@Component({
    selector: 'my-campaigns',
    templateUrl: './myCampaigns.component.html',
    styleUrls: ['./myCampaigns.component.css'],
})
export class MyCampaignsComponent implements OnInit {
    myCampaigns: Campaign[];
    myDmCampaigns: Campaign[];

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {
        this.socket.gameState$.subscribe(g => {
            if (g) {
                this.myDmCampaigns = g.ownedCampaigns;
            }
        });
        this.socket.requestBuilders.update;
        this.socket.gameState$.value.joinedCampaigns;
        this.socket.gameState$.value.ownedCampaigns;
        console.log(this.socket.gameState$.value.ownedCampaigns);
    }

    onCreateNewCampaign() {
        this.router.navigate(['new']);
    }
}
