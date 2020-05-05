import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'src/websocket/responses/Characters';
import { WebSocketService } from 'src/websocket';

@Component({
    selector: 'my-characters',
    templateUrl: './myCharacters.component.html',
    styleUrls: ['./myCharacters.component.css'],
})
export class MyCharactersComponent implements OnInit {
    panelOpenState = false;
    myCharacters: Character[];

    constructor(private router: Router, private socket: WebSocketService) {}

    ngOnInit() {}

    onCreateNewCampaign() {
        this.router.navigate(['new']);
    }

    editCharacter() {
        // TODO
    }

    createNewCharacter() {
        // TODO
    }
}
