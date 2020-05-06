import { Component, Inject } from '@angular/core';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogConfig,
    MatDialogRef,
} from '@angular/material/dialog';
import { WebSocketService } from 'src/websocket';
import { Router } from '@angular/router';
import { GameState } from 'src/websocket/responses/GameState';
import { Campaign } from 'src/websocket/responses/Campaigns';

export interface DialogData {
    campaignToJoinID: number;
    password: string;
    charactersOwnedByMe: GameState['characters'];
    joiningCharacterID: number;
}
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
    joinableCampaigns: Campaign[];

    constructor(
        private socket: WebSocketService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    ngOnInit() {
        this.socket.requestBuilders.campaign.getJoinable();
        this.socket.joinableCampaigns$.subscribe(c => {
            this.joinableCampaigns = c;
            console.log('joinableCampaigns:', this.joinableCampaigns); //FIX: Length 0
        });
    }

    openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '250px';

        const dialogRef = this.dialog.open(
            DashboardComponentDialog,
            dialogConfig
        );

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);

            const campaignToJoinID = result[0];
            const password = result[1];
            const joiningCharacterID = result[2]; //FIX: Undefined

            if (result.length === 3 && result.every(r => r != null)) {
                this.joinCampaign(
                    campaignToJoinID,
                    password,
                    joiningCharacterID
                );
            }
        });
    }

    joinCampaign(
        campaignToJoinID: number,
        password: string,
        joiningCharacterID: number
    ) {
        this.socket.requestBuilders.campaign.join({
            campaignToJoinID,
            joiningCharacterID,
            password: password,
        });
    }
}

@Component({
    selector: 'dashboard-dialog',
    templateUrl: './dashboard.component.dialog.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponentDialog {
    constructor(
        public dialogRef: MatDialogRef<DashboardComponentDialog>,
        private socket: WebSocketService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    charactersOwnedByMe: GameState['characters'];

    ngOnInit() {
        this.socket.gameState$.subscribe(s => {
            this.charactersOwnedByMe =
                s?.characters?.filter(
                    c => c.owner === s.me && c.campaign === -1
                ) ?? [];
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
