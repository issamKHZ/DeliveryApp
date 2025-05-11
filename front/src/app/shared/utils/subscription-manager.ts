import {Subscription} from 'rxjs';

export class SubscriptionManager {
  private subscriptions: Subscription[] = [];

  register(...s: Subscription[]) {
    s.forEach(ss => this.subscriptions.push(ss));
  }

  clean() {
    this.subscriptions.forEach(s => s?.unsubscribe());
    this.subscriptions = [];
  }
}
