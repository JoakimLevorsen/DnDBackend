import { Campaign } from "../models/campaign.model";
import { Injectable } from "@angular/core";

@Injectable()
export class CampaignService {
    myCampaigns: Campaign[] = [
        new Campaign(
            "Test Campaign",
            ["player 1", "player 2"],
            4,
            "Character X"
        ),
        new Campaign("Test Campaign2", ["player 3", "player 4"], 6, "Tini"),
    ];

    addCampaign(campaign: Campaign) {
        this.myCampaigns.push(campaign);
    }

    getCampaigns() {
        return this.myCampaigns.slice();
    }
}
