import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/timer';

export function cacheWithExpiration<T>(this: Observable<T>, expirationMs: number): Observable<T> {
  const source = this;
  let cachedData: AsyncSubject<T>;
  return Observable.create((observer: Observer<T>) => {
    if (!cachedData) {
      cachedData = new AsyncSubject<T>();

      source.subscribe(cachedData);

      cachedData.subscribe(() => {
        Observable.timer(expirationMs).subscribe(() => cachedData = undefined);
      });
    }

    return cachedData.subscribe(observer);
  });
}

Observable.prototype.cacheWithExpiration = cacheWithExpiration;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    cacheWithExpiration: typeof cacheWithExpiration;
  }
}
