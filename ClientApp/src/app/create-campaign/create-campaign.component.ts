import { CampaignService } from "./campaign.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormControlName } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "CreateCampaign",
    templateUrl: "./create-campaign.component.html",
})
export class CreateCampaignComponent implements OnInit {
    campaignForm: FormGroup;

    constructor(
        private campaignService: CampaignService,
        private router: Router
    ) {}

    ngOnInit() {
        this.campaignForm = new FormGroup({
            campaignName: new FormControl(),
            players: new FormControl(),
            maxPlayers: new FormControl(),
        });
    }

    onSubmit() {
        this.campaignService.addCampaign(this.campaignForm.value);
        this.router.navigate(["my-campaigns"]);
    }
}
