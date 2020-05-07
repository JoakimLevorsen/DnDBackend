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
    charactersInCampaign: GameState['characters'];
    yourOwnCharacter: GameState['characters'][number];
    diceType: number = 20; //Hardcoded Dicetype
    diceRollArray: GameState['diceRolls'][number];
    diceRollResult: number;

    constructor(
        private router: ActivatedRoute,
        private socket: WebSocketService
    ) {}
    //TODO Find out who's the DM!
    ngOnInit() {
        this.campaignID = Number(
            this.router.snapshot.queryParamMap.get('campaignID')
        );
        this.socket.requestBuilders.update();

        this.socket.gameState$.subscribe(s => {
            if (s) {
                this.currentCampaign =
                    s.ownedCampaigns?.find(c => c.ID === this.campaignID) ??
                    s.joinedCampaigns?.find(c => c.ID === this.campaignID);
                this.isDungeonMaster =
                    this.currentCampaign &&
                    (this.currentCampaign?.dungeonMaster == s.me ?? false);
                this.charactersInCampaign = s.characters?.filter(
                    c => c.campaign === this.campaignID && c.owner != s.me
                );
                this.yourOwnCharacter = s.characters?.find(
                    c => c.owner === s.me && c.campaign === this.campaignID
                );
                /* FIX
                GameState: Characters assigned to campaigns, no joinableCampaigns
                CurrentCampaign: undefined
                DiceRollResult: Returns same result every time )=
                */
                this.diceRollArray = s.diceRolls[this.campaignID];
                this.diceRollResult = this.diceRollArray[
                    this.diceRollArray.length - 1
                ].roll;
            }
        });
    }

    onRoll() {
        this.socket.requestBuilders.diceRoll({
            diceType: this.diceType,
            campaignID: this.campaignID,
        });
        console.log('DiceRollTest, Result:::', this.diceRollResult);
    }
}
