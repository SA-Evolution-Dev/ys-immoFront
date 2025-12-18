import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';
import { RouterLink } from '@angular/router';

register();

@Component({
  selector: 'app-home',
  // imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Home {
  spaceBetween = 10;

  onProgress(event: CustomEvent<[Swiper, number]>) {
    const [swiper, progress] = event.detail;
  }

  onSlideChange() {}

}
