import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthenticated: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isAuthenticated = localStorage.getItem('isLoggedIn');
    setTimeout(() => {
      $('.cliLi').on('click', function () {
        $('.navbar-collapse').collapse('hide');
      });
    }, 2000);
  }
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['']);
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}
