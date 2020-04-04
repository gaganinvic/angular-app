import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';

import { Observable } from "rxjs";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild(MatSidenav, null) public sidenav: MatSidenav;

  isLoggedIn : Observable<boolean>;
  constructor(public authService: AuthService) { 
    this.isLoggedIn = authService.isLoggedIn();
    console.log("sidenav this.isLoggedIn : ", this.isLoggedIn)
  }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(isLoggedInStatus => {
      if ( isLoggedInStatus ) {
        this.sidenav.open();
      } else {
        this.sidenav.close();
      }
    });
  }

}
