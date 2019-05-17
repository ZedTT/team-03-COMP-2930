import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TradeItem } from '../models/TradeItem';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(private http: HttpClient) { }

  /**
   * For getting tradeItem objects that represent the items owned by the user.
   * @param user the userID of the user.
   * @returns an observable that, when subscribed to, returns an array of tradeItems
   */
  getItemsByUser(user: string): Observable<any> { // TODO: please rename 'user' to 'userId'
    if (!user) { return null; }
    return this.http.get<any>(`/api/tradeitems?uid=${user}`);
  }

}
