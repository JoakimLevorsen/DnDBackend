import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, CanActivate, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import {
    DashboardComponent,
    DashboardComponentDialog,
} from './dashboard/dashboard.component';
import { MyCampaignsComponent } from './my-campaigns/my-campaigns.component';
import { MyCharactersComponent } from './my-characters/my-characters.component';
import { WebSocketService } from 'src/websocket';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { MatCardModule } from '@angular/material/card';
import { CreateCharacterComponent } from './create-character/create-character.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private socket: WebSocketService, private router: Router) {}

    canActivate(): boolean {
        if (!this.socket.auth$.value) this.router.navigate(['/login']);
        return this.socket.auth$.value;
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
        CreateCharacterComponent,
        NewCampaignComponent,
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        MatCardModule,
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
            {
                path: 'play',
                component: PlayComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'new-character',
                component: CreateCharacterComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'new',
                component: NewCampaignComponent,
                canActivate: [AuthGuardService],
            },
        ]),
    ],
    entryComponents: [DashboardComponentDialog],
    providers: [WebSocketService, AuthGuardService],
    bootstrap: [AppComponent],
})
export class AppModule {}
