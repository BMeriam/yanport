import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VacuumMapComponent} from "./vaccumMap/vacuum-map.component";

const routes: Routes = [
    { path: '', component: VacuumMapComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
