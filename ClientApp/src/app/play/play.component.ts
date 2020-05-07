import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import { ActivatedRoute } from '@angular/router';
import {
    GameStateCampaign,
    GameState,
} from 'src/websocket/responses/GameState';

@Component({
    selector: 'play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.css'],
})
export class PlayComponent implements OnInit {
    campaignID: number;
    currentCampaign: GameStateCampaign;
    isDungeonMaster: boolean;
    charactersInCampaign: GameState['encounteredCharacters'];
    yourOwnCharacter: GameState['myCharacters'][number];

    constructor(
        private router: ActivatedRoute,
        private socket: WebSocketService
    ) {}

    ngOnInit() {
        this.campaignID = Number(
            this.router.snapshot.queryParamMap.get('campaignID')
        );
        this.socket.requestBuilders.update();

        this.socket.gameState$.subscribe(s => {
            if (s) {
                console.log('Gamestate:::', s);

                this.currentCampaign =
                    s.ownedCampaigns?.find(c => c.ID === this.campaignID) ??
                    s.joinedCampaigns?.find(c => c.ID === this.campaignID);
                this.isDungeonMaster =
                    this.currentCampaign &&
                    (this.currentCampaign?.dungeonMaster == s.me ?? false);
                this.charactersInCampaign = s.encounteredCharacters?.filter(
                    c => c.campaign === this.campaignID && c.owner != s.me
                );
                this.yourOwnCharacter = s.myCharacters?.find(
                    c => c.owner === s.me && c.campaign === this.campaignID
                );
                console.log('CURRENT CAMPAIGN OBJECT:::', this.currentCampaign);
            }
        });
    }
}
