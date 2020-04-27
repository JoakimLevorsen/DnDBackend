import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "MyCharacters",
    templateUrl: "./myCharacters.component.html",
})
export class MyCharactersComponent {
    public forecasts: WeatherForecast[];

    constructor(http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
        http.get<WeatherForecast[]>(baseUrl + "weatherforecast").subscribe(
            result => {
                this.forecasts = result;
            },
            error => console.error(error)
        );
    }
}

interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
