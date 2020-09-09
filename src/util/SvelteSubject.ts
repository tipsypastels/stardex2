import { BehaviorSubject } from 'rxjs';

export default class SvelteSubject<T> extends BehaviorSubject<T> {
  set(value: T) {
    super.next(value);
  }
}