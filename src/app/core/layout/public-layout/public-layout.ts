import { Component } from '@angular/core';
import { PHeader } from '../../../features/portail/components/p-header/p-header';
import { PFooter } from '../../../features/portail/components/p-footer/p-footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [PHeader, PFooter, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {

}
