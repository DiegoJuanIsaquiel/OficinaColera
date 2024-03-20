import { BaseCrudProxy } from './base/base-crud.proxy';

export interface UserProxy extends BaseCrudProxy {
  email: string;
  roles: string[];
}
