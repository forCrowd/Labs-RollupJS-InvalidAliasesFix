import "breeze.dataService.odata";
import "breeze.modelLibrary.backingStore";
import "datajs";

import { NgModule, Component } from "@angular/core";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BreezeBridgeAngular2Module } from "breeze-bridge-angular2";
import { EntityManager } from "breeze-client";

class CustomEntityManager extends EntityManager {
    constructor() {
        super({
            serviceName: "/odata"
        });
    }
}

@Component({
    selector: "app",
    template: `
    <button type="button" (click)="fetchMetadata()">Fetch</button>
    <p>
        Metadata: {{ metadata | json }}
    </p>
`
})
export class AppComponent {

    metadata: Object = null;

    fetchMetadata(): void {
        new CustomEntityManager().fetchMetadata().then((metadata: any) => {
            this.metadata = metadata;
        }).catch((error: any) => {
            this.metadata = error.message;
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        BreezeBridgeAngular2Module
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
