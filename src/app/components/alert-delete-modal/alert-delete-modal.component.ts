//#region Imports

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

//#endregion

@Component({
  selector: 'ngx-alert-delete-modal',
  template: `
    <nb-card class="m-0 border-0">
      <nb-card-header>Atenção</nb-card-header>
      <nb-card-body>{{ message }}</nb-card-body>
      <nb-card-footer class="d-flex justify-content-between">
        <button nbButton outline status="danger" (click)="onDelete.emit()">Sim, remover</button>
        <button *ngIf="onClose.observers.length" nbButton outline status="basic" autofocus (click)="onClose.emit()">Cancelar</button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class AlertDeleteModalComponent {

  @Input()
  public message: string;

  @Output()
  public onDelete: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public onClose: EventEmitter<void> = new EventEmitter<void>();

}

@NgModule({
  imports: [
    NbCardModule,
    NbButtonModule,
    CommonModule,
  ],
  exports: [
    AlertDeleteModalComponent,
  ],
  declarations: [
    AlertDeleteModalComponent,
  ],
})
export class AlertDeleteModalModule {}
