import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-details-annonce',
  imports: [],
  templateUrl: './details-annonce.html',
  styleUrl: './details-annonce.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsAnnonce {
  
}
