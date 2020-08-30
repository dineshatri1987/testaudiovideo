import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { VideoService } from './video.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy, AfterViewInit {

  isRecording = false;
  recordedTime;
  blobUrl = null;
  blobUrlExist = false;
  @ViewChild('videoPlayer', { static: false }) videoplayer: any;
  constructor(private audioRecordingService: VideoService, private sanitizer: DomSanitizer) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.blobUrlExist = true;
      this.blobUrl = URL.createObjectURL(data.blob);
      this.saveFile(data.title);
      //this.videoplayer.nativeElement.setAttribute('src', this.blobUrl.changingThisBreaksApplicationSecurity);
    });
  }

  saveFile(name) {
    const aTag = document.createElement('a');
    aTag.href = this.blobUrl;
    aTag.download = name;
    aTag.style.display = 'none';
    document.body.appendChild(aTag);
    aTag.click();
    window.URL.revokeObjectURL(this.blobUrl);
    aTag.remove();
  }

  ngAfterViewInit(): void {
    this.audioRecordingService.videoElement = this.videoplayer;
  }

  ngOnInit() {
    this.audioRecordingService.startRecording(false);
  }

  startRecording() {
    if (!this.isRecording) {
      this.audioRecordingService.startRecording(true);
      this.isRecording = true;
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.resetVideo();
      this.audioRecordingService.abortRecording();
    }
  }

  resetVideo() {
    // this.videoplayer.nativeElement.removeAttribute('src');
    // this.videoplayer.nativeElement.removeAttribute('srcObject');
    // this.videoplayer.nativeElement.load();
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
    this.blobUrlExist = false;
    this.resetVideo();
  }

  ngOnDestroy(): void {
    this.abortRecording();
    this.resetVideo();
  }
}
