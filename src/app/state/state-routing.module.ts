import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStatesComponent } from './list-states/list-states.component';

const routes: Routes = [

  {
    path: 'list-state',
    component: ListStatesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule,
  ]
})
export class StateRoutingModule { }
