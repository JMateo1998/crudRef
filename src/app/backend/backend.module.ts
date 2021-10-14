import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetReferenceComponent } from './set-reference/set-reference.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [SetReferenceComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class BackendModule { }
