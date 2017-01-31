import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/switchMap';

export function pausable<T>(this: Observable<T>, pauser: Observable<boolean>): Observable<T> {
  return <Observable<T>>pauser.switchMap((paused) => paused ? Observable.never() : this);
}

Observable.prototype.pausable = pausable;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    pausable: typeof pausable;
  }
}
