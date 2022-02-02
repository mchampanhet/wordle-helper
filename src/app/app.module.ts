import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {DividerModule} from 'primeng/divider';
import {CardModule} from 'primeng/card';
import {ScrollPanelModule} from 'primeng/scrollpanel';



import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InputTextModule,
    FormsModule,
    TableModule,
    DividerModule,
    CardModule,
    ScrollPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
