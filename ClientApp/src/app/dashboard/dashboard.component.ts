import { Component, Inject } from '@angular/core';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogConfig,
    MatDialogRef,
} from '@angular/material/dialog';
import { WebSocketService } from 'src/websocket';
import { Router } from '@angular/router';

export interface DialogData {
    campaignToJoinID: number;
    campaignPassword: string;
    joiningCharacterID: number;
}
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
    campaignToJoinID: number;
    campaignPassword: string;
    joiningCharacterID: number;

    constructor(
        private socket: WebSocketService,
        private router: Router,
        public dialog: MatDialog
    ) {}

    //TODO GET THAT CHARACTERID SOMEHOW

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
            this.campaignToJoinID = result[0];
            this.campaignPassword = result[1];
            if (result != undefined) {
                //TODO Call function to join a campaign
            }
        });
    }
    //TODO Make function that uses campaignID ,Password and CharacterID or something, to join a campaign.
    joinCampaign(
        campaignToJoinID: number,
        campaignPassword: string,
        joiningCharacterID: number
    ) {
        // this.socket.requestBuilders.campaign.join({
        // })
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
