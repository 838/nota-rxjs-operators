import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/defer'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeAll'

export function concurrentMerge<T, T2>(this: Observable<T>, cb: (val: T) => Observable<T2> | Promise<T2>, concurrent?: number): Observable<T2[]> {
  return Observable.create((observer: Observer<T2[]>) => {
    const worker = this.map((val: T, index: number) => {
      return Observable.defer(() => cb(val)).map((res) => ({index, res}));
    })
    .mergeAll(concurrent);

    const output: T2[] = [];

    worker.subscribe(
      ({index, res}) => {
        output[index] = res;
      },
      (err) => Observable.throw(err),
      () => {
        Observable.of(output).subscribe(observer);
      });
  });
}

Observable.prototype.concurrentMerge = concurrentMerge;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    concurrentMerge: typeof concurrentMerge;
  }
}
