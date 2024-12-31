import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StateRoutingModule } from './state-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    StateRoutingModule,
    IonicModule,
    // Importa aquí el IonicModule para usar componentes de Ionic

  ],
  exports:[]
})
export class StateModule { }
