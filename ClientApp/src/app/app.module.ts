import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MyCampaignsComponent } from "./myCampaigns/myCampaigns.component";
import { MyCharactersComponent } from "./myCharacters/myCharacters.component";
import { WebSocketService } from "src/websocket";

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        DashboardComponent,
        MyCampaignsComponent,
        MyCharactersComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            { path: "", component: DashboardComponent, pathMatch: "full" },
            { path: "my-campaigns", component: MyCampaignsComponent },
            { path: "my-characters", component: MyCharactersComponent },
        ]),
    ],
    providers: [WebSocketService],
    bootstrap: [AppComponent],
})
export class AppModule {}
