//#region Imports

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

//#endregion

/**
 * A classe que representa o componente que notifica o usuário antes de realizar a ação de deletar algo
 */
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

  /**
   * A mensagem de alerta a ser exibida
   */
  @Input()
  public message: string;

  /**
   * O evento lançado quando o usuário confirma a remoção
   */
  @Output()
  public onDelete: EventEmitter<void> = new EventEmitter<void>();

  /**
   * O evento lançado quando o usuário quer fechar a modal
   */
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
