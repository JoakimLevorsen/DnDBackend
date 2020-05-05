import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, CanActivate, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import {
    DashboardComponent,
    DashboardComponentDialog,
} from './dashboard/dashboard.component';
import { MyCampaignsComponent } from './myCampaigns/myCampaigns.component';
import { MyCharactersComponent } from './myCharacters/myCharacters.component';
import { WebSocketService } from 'src/websocket';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { MatCardModule } from '@angular/material/card';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private socket: WebSocketService, private router: Router) {}

    canActivate(): boolean {
        if (this.socket.auth$.value) {
            return true;
        }
        return true;
        this.router.navigate(['/login']);
        return false;
    }
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        DashboardComponent,
        DashboardComponentDialog,
        MyCampaignsComponent,
        MyCharactersComponent,
        LoginComponent,
        PlayComponent,
        CreateCampaignComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        MatCardModule,
        MatExpansionModule,
        RouterModule.forRoot([
            {
                path: '',
                component: DashboardComponent,
                pathMatch: 'full',
                canActivate: [AuthGuardService],
            },
            {
                path: 'my-campaigns',
                component: MyCampaignsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'my-characters',
                component: MyCharactersComponent,
                canActivate: [AuthGuardService],
            },
            { path: 'login', component: LoginComponent },
            { path: 'play', component: PlayComponent },
            { path: 'new', component: CreateCampaignComponent },
        ]),
    ],
    entryComponents: [DashboardComponentDialog],
    providers: [WebSocketService, AuthGuardService],
    bootstrap: [AppComponent],
})
export class AppModule {}
