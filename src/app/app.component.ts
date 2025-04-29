import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { MenuBarComponent } from "./components/menu-bar/menu-bar.component";
import { UserService } from './services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  title = 'baseconhecimento';
  unsubscribe$ = new Subject();
  canShowMenuBar: boolean = false;
  userService = inject(UserService);

  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);

    this.userService.user
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(value => {
      if(value)
        this.canShowMenuBar = true;
      else
        this.canShowMenuBar = false;
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }
}
