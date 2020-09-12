import { Subject, interval, merge } from 'rxjs';
import { withLatestFrom, mapTo, debounceTime } from 'rxjs/operators';

export type Flash = {
  color: string;
  message: string;
}

export const flashMessage = new Subject<Flash>();

const flashExpiry = flashMessage.pipe(
  withLatestFrom(flashMessage),
  debounceTime(3000),
  mapTo(null),
);

export const flash = merge(flashMessage, flashExpiry);