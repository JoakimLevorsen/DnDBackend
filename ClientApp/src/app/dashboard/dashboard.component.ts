import { Component, Inject } from '@angular/core';
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogConfig,
    MatDialogRef,
} from '@angular/material/dialog';

export interface DialogData {
    joinByIDNumber: string;
    joinByIDPassword: string;
}
@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
    joinByIDNumber: string;
    joinByIDPassword: string;

    constructor(public dialog: MatDialog) {}

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
            this.joinByIDNumber = result[0];
            this.joinByIDPassword = result[1];
            if (result != undefined) {
                //TODO Call function to join a campaign
            } else {
                //Do nothing
            }
        });
    }

    //TODO Make function that actually uses ID and Pass to join a campaign
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
