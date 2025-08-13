import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
      <h1 class="m-2 text-4xl">
          Hello world!
      </h1>
      <router-outlet />
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('splitit');
}
