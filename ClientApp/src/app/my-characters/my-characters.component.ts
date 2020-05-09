import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameState } from 'src/websocket/responses/GameState';
import { WebSocketService } from 'src/websocket';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

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
    name = new FormControl();
    myCharacters: Character[];

    constructor(
        private router: Router,
        private socket: WebSocketService,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.socket.gameState$.subscribe(s => {
            if (s) {
                this.myCharacters =
                    s?.myCharacters
                        ?.filter(c => c.owner === s.me) // Maybe delete?
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

    updateName(character: Character) {
        if (this.name.value !== null) {
            this.socket.requestBuilders.character.updateName({
                ID: character.ID,
                name: this.name.value,
            });
        }
        this.name.reset();
    }

    deleteCharacter(ID: string) {
        this.socket.requestBuilders.character.delete(ID);
    }

    createNewCharacter() {
        this.router.navigate(['new-character']);
    }
}
