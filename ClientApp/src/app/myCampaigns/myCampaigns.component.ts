import { Component } from "@angular/core";
import { Campaign } from "./campaign.model";

@Component({
    selector: "my-campaigns",
    templateUrl: "./myCampaigns.component.html",
    styleUrls: ["./myCampaigns.component.css"],
})
export class MyCampaignsComponent {
    myCampaigns: Campaign[] = [
        new Campaign("Test Campaign", ["player 1", "player 2"], "My Character"),
        new Campaign(
            "Test Campaign2",
            ["player 3", "player 4"],
            "My next Character X"
        ),
    ];
}
