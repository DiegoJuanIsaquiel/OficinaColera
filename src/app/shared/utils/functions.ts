import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { UploadProxy } from '../../models/proxys/upload.proxy';
import { UserProxy } from '../../models/proxys/user.proxy';

import { HttpAsyncService } from '../../modules/http-async/services/http-async.service';

/**
 * Método que pausa a execução por uma certa quantidade de tempo
 *
 * @param ms A quantidade de tempo em millisegundos
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Método que retorna uma lista de erros
 *
 * @param error
 */
export function getCrudErrors({ status, error }: any): string[] {
  if (status >= 500 && status <= 599)
    return ['Ocorreu um erro interno, por favor, tente novamente.'];

  if (!Array.isArray(error.message)) {
    if (typeof error.message === 'string' && error.message.includes('Cannot'))
      return ['A rota especificada não foi encontrada, por favor, contate os administradores se o erro persistir.'];

    return [error.message || 'Ocorreu um erro inesperado, por favor, contate os administradores se o erro persistir.'];
  }

  if (error.message.every(message => typeof message === 'string'))
    return error.message;

  // @ts-ignore
  return error.message.map(({ constraints }) => constraints && Object.values(constraints) || [])
    .reduce((acc, actual) => [...acc, ...actual] as string[]);
}

/**
 * Método que carrega uma imagem base64
 *
 * @param file A referencia da imagem
 * @param onLoad O callback ao carregar a imagem
 */
export function processBase64Image(file: any, onLoad: (base64: string) => void): void {
  if (!file)
    return;

  const reader = new FileReader();

  reader.onloadend = () => {
    if (typeof reader.result !== 'string')
      return;

    onLoad(reader.result);
  };

  reader.readAsDataURL(file);
}

/**
 * Método que carrega uma imagem base64
 *
 * @param file A referencia da imagem
 */
export async function processBase64ImageAsync(file: any): Promise<string> {
  return new Promise(resolve => {
    processBase64Image(file, resolve);
  });
}

/**
 * Método que realiza o upload de uma imagem
 *
 * @param http O serviço usado para realizar requisições http
 * @param base64WithData O base64 da imagem
 */
export async function uploadImage(http: HttpAsyncService, base64WithData: string): Promise<[boolean, string]> {
  const base64 = base64WithData.split(',')[1];
  const mimeType = base64WithData.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

  const { error, success } = await http.post<UploadProxy>('/media/upload/image', { base64, mimeType });

  if (error)
    return [false, getCrudErrors(error)[0]];

  return [true, success.url];
}

/**
 * Método que verifica se o usuário tem permissão de administrador
 *
 * @param token As informações do token de autenticação
 */
export function isAdmin(token: string): boolean {
  const jwt = new JwtHelperService();

  if (!token || jwt.isTokenExpired(token))
    return false;

  const tokenPayload = decode(token);

  if (typeof tokenPayload.roles !== 'string')
    return false;

  return hasRole(tokenPayload.roles, 'admin');
}

/**
 * Método que diz se o usuário possui uma permissão em específico
 *
 * @param roles As permissões do usuário
 * @param targetRole A permissão que ele está verificando
 */
export function hasRole(roles: string, targetRole: string): boolean {
  const rolesArray = typeof roles === 'string' && roles.split('|') || '';

  return rolesArray.includes(targetRole);
}

/**
 * Método que retorna as informações do usuário atualmente logado
 */
export function getCurrentUser(): UserProxy | null {
  try {
    return JSON.parse(localStorage.getItem(environment.keys.user));
  } catch (e) {
    return null;
  }
}
