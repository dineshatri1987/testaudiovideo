import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { AudioService } from './audio/audio.service';
import { VideoService } from './video/video.service';

@NgModule({
  declarations: [
    AppComponent,
    AudioComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [AudioService, VideoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
