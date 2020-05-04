import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Campaign } from "../models/campaign.model";
import { CampaignService } from "../create-campaign/campaign.service";

@Component({
    selector: "my-campaigns",
    templateUrl: "./myCampaigns.component.html",
    styleUrls: ["./myCampaigns.component.css"],
})
export class MyCampaignsComponent implements OnInit {
    myCampaigns: Campaign[];

    constructor(
        private router: Router,
        private campaignService: CampaignService
    ) {}

    ngOnInit() {
        this.myCampaigns = this.campaignService.getCampaigns();
    }

    onCreateNewCampaign() {
        this.router.navigate(["new"]);
    }
}
