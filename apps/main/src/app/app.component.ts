import { Component } from '@angular/core';
import { distinctUntilSomeChanged, RxState, selectSlice } from '@rx-angular/state';
import { map, filter } from 'rxjs/operators';

export interface MasterListViewModel {
  isItemRendered: boolean;
  list: object[];
}

@Component({
  selector: 'rx-state-playground-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent<State extends MasterListViewModel> {
  title = 'main';

  constructor(protected state: RxState<State>) {

    // Problem with `selectSlice`
    const autoSelectItemNotOk$ = this.state.select().pipe(
      selectSlice(['list', 'isItemRendered']),
      // compile failure: "Property 'isItemRendered' does not exist on type Pick<State..."
      filter(({ isItemRendered, list }) => !isItemRendered && list.length > 0)
    );

    autoSelectItemNotOk$.subscribe(e => console.log(e));


    // using `distinctUntilSomeChanged`+`map` instead of `selectSlice` compiles fine
    const autoSelectItemOk$ = this.state.select().pipe(
      distinctUntilSomeChanged(['list', 'isItemRendered']),
      map(({ list, isItemRendered }) => ({
        list, isItemRendered
      })),
      filter(({ isItemRendered, list }) => !isItemRendered && list.length > 0)
    );
    autoSelectItemOk$.subscribe(e => console.log(e));
  }
}
