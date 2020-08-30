import { Injectable, NgZone } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';

interface RecordedVideoOutput {
  blob: Blob;
  title: string;
}

@Injectable()
export class VideoService {
  private stream;
  private recorder;
  private interval;
  private startTime;
  private recorded = new Subject<RecordedVideoOutput>();
  private recordingTime = new Subject<string>();
  private recordFailed = new Subject<string>();
  public videoElement: any;

  getRecordedBlob(): Observable<RecordedVideoOutput> {
    return this.recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this.recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this.recordFailed.asObservable();
  }


  startRecording(startRecording) {

    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }

    this.recordingTime.next('00:00');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => {
      this.videoElement.nativeElement.srcObject = s;
      if (startRecording) {
        this.stream = s;
        this.record();
      }
    }).catch(error => {
      this.recordFailed.next();
    });

  }

  abortRecording() {
    this.stopMedia();
  }

  private record() {

    this.recorder = new RecordRTC.MediaStreamRecorder(this.stream, {
      type: 'video',
      mimeType: 'video/webm',
    });

    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this.recordingTime.next(time);
      },
      1000
    );
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  stopRecording() {

    if (this.recorder) {
      this.recorder.stop((blob) => {
        if (this.startTime) {
          const mp4Name = encodeURIComponent('video_' + new Date().getTime() + '.mkv');
          this.stopMedia();
          this.recorded.next({ blob, title: mp4Name });
        }
      }, () => {
        this.stopMedia();
        this.recordFailed.next();
      });
    }
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      // if (this.stream) {
      //   this.stream.getVideoTracks().forEach(track => track.stop());
      //   this.stream.getAudioTracks().forEach(track => track.stop());
      //   //this.videoElement.nativeElement.srcObject.getVideoTracks().forEach(track => track.stop());
      //   this.stream = null;
      // }
    }
  }

}
