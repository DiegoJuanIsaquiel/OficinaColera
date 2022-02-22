import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  public transform(roles: string[]): string {
    return roles.map(role => this.roleToName(role)).join(',');
  }

  public roleToName(role: string): string {
    switch (role) {
      case 'user':
        return 'Usuário';

      case 'admin':
        return 'Administrador Global';

      default:
        return 'Desconhecido.';
    }
  }
}

@NgModule({
  declarations: [
    RolePipe,
  ],
  exports: [
    RolePipe,
  ],
})
export class RolePipeModule {}
