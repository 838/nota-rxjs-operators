import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

export function pausableBuffered<T>(this: Observable<T>, pauser: Observable<boolean>, bufferCount?: number): Observable<T> {
  const buffer = new Subject();

  let tmp = this.buffer(pauser);

  if (bufferCount !== void 0) {
    tmp = tmp.take(bufferCount);
  }

  tmp.subscribe(buffer);

  return <Observable<T>>pauser.switchMap((paused) => paused ? buffer : this);
}

declare module 'rxjs/Observable' {
  interface Observable<T> {
    pausableBuffered: typeof pausableBuffered;
  }
}
