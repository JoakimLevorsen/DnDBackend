import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from 'src/websocket/responses/Campaigns';
import { WebSocketService } from 'src/websocket';
import { GameState } from 'src/websocket/responses/GameState';

@Component({
    selector: 'my-campaigns',
    templateUrl: './my-campaigns.component.html',
    styleUrls: ['./my-campaigns.component.css'],
})
export class MyCampaignsComponent implements OnInit {
    myCampaigns: Campaign[];
    myDmCampaigns: Campaign[];

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {
        this.socket.gameState$.subscribe(g => {
            if (g) {
                this.myDmCampaigns = g.ownedCampaigns;
                this.myCampaigns = g.joinedCampaigns;

            }
        });
    }

    onCreateNewCampaign() {
        this.router.navigate(['new']);
    }

    onPlay(id: number) {
        this.router.navigate(['play'], {
            queryParams: { campaignID: id },
        });
    }
}
