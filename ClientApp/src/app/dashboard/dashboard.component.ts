import { Component, Inject } from "@angular/core";
import {
    MatDialog,
    MAT_DIALOG_DATA,
    MatDialogConfig,
    MatDialogRef,
} from "@angular/material/dialog";

export interface DialogData {
    joinByIDNumber: number;
    joinByIDPassword: string;
}
@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
    joinByIDNumber: number;
    joinByIDPassword: string;

    constructor(public dialog: MatDialog) {}

    openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "250px";

        const dialogRef = this.dialog.open(
            DashboardComponentDialog,
            dialogConfig
        );

        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
            console.log(this.joinByIDNumber);
            console.log(this.joinByIDPassword);
        });
    }
}

@Component({
    selector: "dashboard-dialog",
    templateUrl: "./dashboard.component.dialog.html",
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
