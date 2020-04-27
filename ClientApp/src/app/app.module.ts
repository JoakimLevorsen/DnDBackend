import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Injectable } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule, CanActivate, Router } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MyCampaignsComponent } from "./myCampaigns/myCampaigns.component";
import { MyCharactersComponent } from "./myCharacters/myCharacters.component";
import { WebSocketService } from "src/websocket";
import { LoginComponent } from "./login/login.component";
import { PlayComponent } from "./play/play.component";

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private socket: WebSocketService, private router: Router) {}

    canActivate(): boolean {
        if (this.socket.auth$.value) {
            return true;
        }
        this.router.navigate(["login"]);
        return false;
    }
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        DashboardComponent,
        MyCampaignsComponent,
        MyCharactersComponent,
        LoginComponent,
        PlayComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot([
            {
                path: "",
                component: DashboardComponent,
                pathMatch: "full",
                canActivate: [AuthGuardService],
            },
            {
                path: "my-campaigns",
                component: MyCampaignsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: "my-characters",
                component: MyCharactersComponent,
                canActivate: [AuthGuardService],
            },
            { path: "login", component: LoginComponent },
            { path: "play", component: PlayComponent },
        ]),
    ],
    providers: [WebSocketService],
    bootstrap: [AppComponent],
})
export class AppModule {}
