import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AppComponent } from './app.component';
import { ChipsModule } from 'primeng/chips';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseService } from './firebase.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputSwitchModule } from 'primeng/inputswitch';


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
    ScrollPanelModule,
    ToggleButtonModule,
    DragDropModule,
    ChipsModule,
    HttpClientModule,
    ButtonModule,
    ToggleButtonModule,
    MenuModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    InputSwitchModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
