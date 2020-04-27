import { Component } from "@angular/core";

@Component({
    selector: "MyCampaigns",
    templateUrl: "./myCampaigns.component.html",
})
export class MyCampaignsComponent {
    public currentCount = 0;

    public incrementCounter() {
        this.currentCount++;
    }
}
