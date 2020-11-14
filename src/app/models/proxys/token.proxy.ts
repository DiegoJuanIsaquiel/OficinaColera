/**
 * A interface que representa o proxy que lida com o retorno das informações do token de autenticação
 */
export interface TokenProxy {

  /**
   * O Bearer Token gerado pelo JWT
   */
  token: string;

  /**
   * O Bearer Token gerado pelo JWT para atualizar e regerar um novo token
   */
  refreshToken: string;

  /**
   * A data de quando irá expirar
   */
  expiresAt: string;

}
