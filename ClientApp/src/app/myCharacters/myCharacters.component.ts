import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameState } from 'src/websocket/responses/GameState';
import { WebSocketService } from 'src/websocket';

class Character {
    public name: string;
    public ID: number;
    public level: number;
    public health: number;
    public xp: number;
    public cRace: string;
    public cClass: string;
    public campaignName?: string;
    constructor(
        character: GameState['characters'][number],
        campaignName: string
    ) {
        Object.assign(this, character);
        this.campaignName = campaignName;
    }
}

@Component({
    selector: 'my-characters',
    templateUrl: './myCharacters.component.html',
    styleUrls: ['./myCharacters.component.css'],
})
export class MyCharactersComponent implements OnInit {
    panelOpenState = false;
    myCharacters: Character[];

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {
        this.socket.gameState$.subscribe(s => {
            this.myCharacters =
                s?.characters
                    ?.filter(c => c.owner === s.me)
                    .map(
                        character =>
                            new Character(
                                character,
                                s?.joinedCampaigns.find(
                                    c => c.ID === character.campaign
                                )?.name
                            )
                    ) ?? [];
            console.log('myCharacters:', this.myCharacters); // TODO: undefined - gør måske noget med databasen forkert
        });
    }

    editCharacter() {
        // TODO
    }

    createNewCharacter() {
        this.router.navigate(['new']);
    }
}
