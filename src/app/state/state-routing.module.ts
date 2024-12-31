import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListStatesComponent } from './list-states/list-states.component';
import { StateComponent } from './state.component';

const routes: Routes = [
  {
    path: '',
    component: StateComponent,
  },
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
