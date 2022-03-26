import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { RolesEnum } from '../models/enums/roles.enum';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  public transform(roles: string[]): string {
    return roles.map(role => this.roleToName(role)).join(', ');
  }

  public roleToName(role: string): string {
    const roleToString: Record<RolesEnum, string> = {
      [RolesEnum.NONE]: 'Nenhum',
      [RolesEnum.USER]: 'Usuário',
      [RolesEnum.ADMIN]: 'Administrador Global',
    };

    const nonExistentRole = !Object.keys(roleToString).some(possibleRole => possibleRole === role);

    if (nonExistentRole)
      return 'Desconhecido';

    return roleToString[role as RolesEnum];
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
