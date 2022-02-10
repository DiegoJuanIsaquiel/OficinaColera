//#region Imports

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserProxy } from '../../models/proxys/user.proxy';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class UserService {

  //#region Private Properties

  private readonly currentUser$: BehaviorSubject<UserProxy | null> = new BehaviorSubject<UserProxy | null>(this.getCurrentUser());

  //#endregion

  //#region Public Methods

  public getCurrentUser$(): Observable<UserProxy | null> {
    return this.currentUser$.asObservable();
  }

  public getCurrentUser(): UserProxy | null {
    try {
      return JSON.parse(localStorage.getItem(environment.keys.user) || '');
    } catch (e) {
      return null;
    }
  }

  public refreshCurrentUser(): void {
    this.currentUser$.next(this.getCurrentUser());
  }

  //#endregion

}
