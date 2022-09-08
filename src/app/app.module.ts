import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { ESVGComponent } from './esvg/esvg.component';
import { SSVGComponent } from './ssvg/ssvg.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, HelloComponent, ESVGComponent, SSVGComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
