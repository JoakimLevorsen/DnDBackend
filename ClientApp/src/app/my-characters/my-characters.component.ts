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
        character: GameState['myCharacters'][number],
        campaignName: string
    ) {
        Object.assign(this, character);
        this.campaignName = campaignName;
    }
}

@Component({
    selector: 'my-characters',
    templateUrl: './my-characters.component.html',
    styleUrls: ['./my-characters.component.css'],
})
export class MyCharactersComponent implements OnInit {
    panelOpenState = false;
    myCharacters: Character[];

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {
        this.socket.gameState$.subscribe(s => {
            if (s) {
                this.myCharacters =
                    s?.myCharacters
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
            }
        });
    }

    editCharacter() {
        // TODO
    }

    createNewCharacter() {
        this.router.navigate(['new-character']);
    }
}
