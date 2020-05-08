import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/websocket';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl,
} from '@angular/forms';

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

    cancel() {
        this.router.navigate(['my-characters']);
    }

    onSubmit() {
        this.socket.requestBuilders.character.create({
            name: this.createCharacterFormGroup.get('name.nameCtrl').value,
            race: this.createCharacterFormGroup.get('race.raceCtrl').value,
            characterClass: this.createCharacterFormGroup.get('class.classCtrl')
                .value,
        });
        this.router.navigate(['my-characters']);
    }
}
