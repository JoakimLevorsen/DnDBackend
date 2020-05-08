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
    charactersInCampaign: GameState['encounteredCharacters'] = [];
    player: GameState['myCharacters'][number];
    diceType: number = 20; //Note: Hardcoded Dicetype
    diceRolls: GameState['diceRolls'][number] = [];
    diceRollResult: number;
    log = '';

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
                this.charactersInCampaign = s.encounteredCharacters?.filter(
                    c => c.campaign === this.campaignID && c.owner != s.me
                );
                this.player = s.myCharacters?.find(
                    c => c.owner === s.me && c.campaign === this.campaignID
                );
                this.log = this.currentCampaign.log;
                /* FIX
                DiceRollResult: Returns same result every time )=
                */
                this.diceRolls =
                    s.diceRolls[this.campaignID]?.map(d => ({
                        ...d,
                        stringDate: new Date(d.date).toLocaleTimeString(),
                    })) ?? [];
                this.diceRollResult = this.diceRolls[
                    this.diceRolls.length === 0 ? 0 : this.diceRolls.length - 1
                ].roll;
            }
        });
    }

    logChanged(e: any) {
        if (this.currentCampaign) {
            const newLog = e.target.value as string;
            this.log = newLog;
            console.log('New log is ', newLog);
            const {
                ID,
                name,
                turnIndex,
                joinable,
                maxPlayers,
            } = this.currentCampaign;
            this.socket.requestBuilders.campaign.update({
                ID,
                name,
                turnIndex,
                joinable,
                maxPlayers,
                log: newLog,
            });
        }
    }

    onRoll() {
        this.socket.requestBuilders.diceRoll({
            diceType: this.diceType,
            campaignID: this.campaignID,
        });
        console.log('DiceRollTest, Result:::', this.diceRollResult);
    }
}
