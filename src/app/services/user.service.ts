import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new BehaviorSubject<User | null>(null); 
  currentUser = this.user.asObservable();

  constructor() { }

  updateUser(newUser: User | null) {
    this.user.next(newUser);
  }

  getUser(): User | null {
    return this.user.getValue();
  }
}
