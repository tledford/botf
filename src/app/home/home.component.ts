import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  boyInput: string = '';
  gilInput: string = '';

  boys: string[] = [];
  gils: string[] = [];

  lineup: string[] = [];

  totalABs: number = 50;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    var boysCookie = this.cookieService.get('boys');
    console.log(boysCookie);
    var gilsCookie = this.cookieService.get('gils');
    console.log(gilsCookie);

    if (boysCookie.length == 0) {
      this.httpClient.get('assets/data/boys.json').subscribe((data) => {
        // console.log(data);
        // this.initialBoys = data;
        this.setupBoys(data);

        this.httpClient.get('assets/data/gils.json').subscribe((data) => {
          // console.log(data);
          // this.initialGils = data;
          this.setupGils(data);
          this.setCookies();
          this.createLineup();
        });
      });
    } else {
      this.boys.push(...JSON.parse(boysCookie));
      this.gils.push(...JSON.parse(gilsCookie));
      this.createLineup();
    }
  }

  setCookies() {
    this.cookieService.set('boys', JSON.stringify(this.boys), 365);
    this.cookieService.set('gils', JSON.stringify(this.gils), 365);
  }

  setupBoys(data: any) {
    this.boys.push(...data);
  }

  setupGils(data: any) {
    this.gils.push(...data);
  }

  createLineup() {
    this.lineup = [];

    var boysPointer = 0;
    var gilsPointer = 0;

    var boysSize = this.boys.length;
    var gilsSize = this.gils.length;

    if (this.boys.length > 0 && this.gils.length > 0) {
      while (this.lineup.length < this.totalABs) {
        //Add a boy
        if (boysPointer == boysSize) boysPointer = 0;
        this.lineup.push(this.boys[boysPointer]);
        boysPointer++;

        //Add a gil
        if (gilsPointer == gilsSize) gilsPointer = 0;
        this.lineup.push(this.gils[gilsPointer]);
        gilsPointer++;
      }
    }
  }

  addBoy() {
    if (this.boyInput !== '') {
      this.boys.push(this.boyInput);
      this.boyInput = '';
      this.setCookies();
    }
  }

  removeBoy() {
    if (this.boyInput !== '') {
      this.boys = this.boys.filter((e) => e !== this.boyInput);
      this.boyInput = '';
      this.setCookies();
    }
  }

  addGil() {
    if (this.gilInput !== '') {
      this.gils.push(this.gilInput);
      this.gilInput = '';
      this.setCookies();
    }
  }

  removeGil() {
    if (this.gilInput !== '') {
      this.gils = this.gils.filter((e) => e !== this.gilInput);
      this.gilInput = '';
      this.setCookies();
    }
  }
}
