import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})
export class FooterComponent {

  /**
   * O ano atual
   */
  public currentYear: number = new Date().getFullYear();

}
