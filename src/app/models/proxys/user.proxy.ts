import { BaseCrudProxy } from './base/base-crud.proxy';

export interface UserProxy extends BaseCrudProxy {
  name: string;
  email: string;
  roles: string;
}
