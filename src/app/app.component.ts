import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public running = false;
  public loaded = false;
  public count = 0;
  public time = 0;

  constructor(private afd: AngularFireDatabase) {

  }

  getSimple() {
    const tick = this.startRun();
    this.afd.list('items').valueChanges().subscribe(c => this.collectionLoaded(c, tick));
  }
  getDetailed() {
    const tick = this.startRun();
    this.afd.list('items-detailed').valueChanges().subscribe(c => this.collectionLoaded(c, tick));
  }

  startRun() {
    this.running = true;
    console.log('Starting Test Run');
    return new Date().getTime();
  }

  collectionLoaded(collection, tick) {
    const tock = (new Date().getTime() - tick) / 1000;
    console.log(`Loaded Collection in ${tock}s`);
    this.count = collection.length;
    this.time = tock;
    this.running = false;
    this.loaded = true;
  }
}
