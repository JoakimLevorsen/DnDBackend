import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import { ActivatedRoute } from '@angular/router';
import {
    GameStateCampaign,
    GameState,
} from 'src/websocket/responses/GameState';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

class Editable {
    public name: string;
    public ID: number;
    public XP: number;
    public health: number;
}

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
    diceType = 20; // Note: Hardcoded Dicetype
    diceRolls: GameState['diceRolls'][number] = [];
    diceRollResult: number;
    log = '';
    characterToEdit: Editable;
    completeCharacterList: GameState['encounteredCharacters'] = [];
    currentPlayer: GameState['encounteredCharacters'][number];

    xpCtrl: FormControl;
    healthCtrl: FormControl;

    constructor(
        private router: ActivatedRoute,
        private socket: WebSocketService,
        private formBuilder: FormBuilder
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
                this.completeCharacterList = this.charactersInCampaign;
                if (this.player != null) {
                    this.completeCharacterList.push(this.player);
                }
                this.currentPlayer = this.completeCharacterList.find(
                    c => c.turnIndex === this.currentCampaign.turnIndex
                );
            }
        });
    }

    incrementTurn() {
        if (this.currentCampaign) {
            this.currentCampaign.turnIndex++;
            if (
                this.currentCampaign.turnIndex ===
                this.charactersInCampaign.length
            ) {
                this.currentCampaign.turnIndex = 0;
            }
            const {
                ID,
                name,
                log,
                turnIndex,
                joinable,
                maxPlayers,
            } = this.currentCampaign;
            this.socket.requestBuilders.campaign.update({
                ID,
                name,
                log,
                turnIndex,
                joinable,
                maxPlayers,
            });
            this.currentPlayer = this.completeCharacterList.find(
                c => c.turnIndex === this.currentCampaign.turnIndex
            );
        }
    }

    editCharacterStats(toEdit) {
        this.characterToEdit = {
            name: toEdit.name,
            ID: toEdit.ID,
            XP: toEdit.xp,
            health: toEdit.health,
        };

        this.xpCtrl = new FormControl(toEdit.xp, Validators.min(0));
        this.healthCtrl = new FormControl(toEdit.health, Validators.min(0));
    }

    saveNewStats() {
        if (this.xpCtrl.value !== null && this.healthCtrl.value !== null) {
            this.socket.requestBuilders.character.updateStats({
                ID: this.characterToEdit.ID,
                xp: this.xpCtrl.value,
                health: this.healthCtrl.value,
            });
        }
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
