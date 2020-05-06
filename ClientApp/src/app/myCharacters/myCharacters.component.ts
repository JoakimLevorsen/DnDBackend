import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameState } from 'src/websocket/responses/GameState';
import { WebSocketService } from 'src/websocket';

class Character {
    constructor(
        public name: string,
        public ID: number,
        public level: number,
        public health: number,
        public xp: number,
        public cRace: string,
        public cClass: string,
        public campaignName?: string
    ) {}
}

@Component({
    selector: 'my-characters',
    templateUrl: './myCharacters.component.html',
    styleUrls: ['./myCharacters.component.css'],
})
export class MyCharactersComponent implements OnInit {
    panelOpenState = false;
    myCharactersFromGameState: GameState['characters'];
    myCharacters: Character[];

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {
        this.socket.gameState$.subscribe(s => {
            this.myCharactersFromGameState =
                s?.characters?.filter(c => c.owner === s.me) ?? [];
            for (let character of this.myCharactersFromGameState) {
                const characterToShow = new Character(
                    character.name,
                    character.ID,
                    character.level,
                    character.health,
                    character.xp,
                    character.cRace,
                    character.cClass,
                    s?.joinedCampaigns.find(
                        c => c.ID === character.campaign
                    )?.name
                );
                this.myCharacters.push(characterToShow);
            }
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
