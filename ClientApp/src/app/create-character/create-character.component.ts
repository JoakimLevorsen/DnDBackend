import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';

export interface Race {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'new-character',
    templateUrl: './create-character.component.html',
    styleUrls: ['./create-character.component.css'],
})
export class CreateCharacterComponent implements OnInit {
    createCharacterFormGroup: FormGroup;

    races: string[] = [
        'Orc',
        'Human',
        'Elf',
        'Dwarf',
        'Dragonborn',
        'A literal pig',
    ];

    classes: string[] = [
        'Accountant',
        'Bard',
        'Druid',
        'Fighter',
        'Rogue',
        'Sorcerer',
    ];

    constructor(
        private router: Router,
        private socket: WebSocketService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.createCharacterFormGroup = this.formBuilder.group({
            name: this.formBuilder.group({
                nameCtrl: ['', Validators.required],
            }),
            race: this.formBuilder.group({
                raceCtrl: ['', Validators.required],
            }),
            class: this.formBuilder.group({
                classCtrl: ['', Validators.required],
            }),
        });
    }

    getCharacterInfo() {
        return `Name: ${
            this.createCharacterFormGroup.get('name.nameCtrl').value
        },
                Race: ${
                    this.createCharacterFormGroup.get('race.raceCtrl').value
                },
                Class: ${
                    this.createCharacterFormGroup.get('class.classCtrl').value
                }`;
    }

    onSelectClass(selectedClass: any) {
        this.createCharacterFormGroup
            .get('class.classCtrl')
            .setValue(selectedClass);
    }

    onSelectRace(selectedRace: any) {
        this.createCharacterFormGroup
            .get('race.raceCtrl')
            .setValue(selectedRace);
    }

    onSubmit() {
        /*this.socket.requestBuilders.campaign.create({
            name: this.campaignName.value,
            joinable: this.joinable.value,
            maxPlayers: this.maxPlayers.value,
            password: this.password.value,
        });*/
        // var test = this.nameFormGroup.value.nameCtrl; FYI
        // this.router.navigate(['my-characters']);
    }
}
