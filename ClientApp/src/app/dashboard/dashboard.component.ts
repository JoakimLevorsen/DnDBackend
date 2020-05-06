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
    constructor(
        private socket: WebSocketService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    charactersOwnedByMe: GameState['characters'];
    ngOnInit() {
        this.socket.gameState$.subscribe(s => {
            this.charactersOwnedByMe =
                s?.characters?.filter(c => c.owner === s.me) ?? [];
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
            const joiningCharacterID = result[2];

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
})
export class DashboardComponentDialog {
    constructor(
        public dialogRef: MatDialogRef<DashboardComponentDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
