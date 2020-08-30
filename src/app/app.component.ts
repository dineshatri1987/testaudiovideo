import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'audioVideo';
  private testType = 1;

  init(type) {
    this.testType = type;
  }
}
