/**
 * A interface que representa o response padrão de uma requisição com filtro
 */
export interface CrudRequestResponseProxy<TProxy> {

  /**
   * A quantidade de items que veio nessa requisição
   */
  count: number;

  /**
   * As informações da requisição
   */
  data: TProxy[];

  /**
   * A página atual
   */
  page: number;

  /**
   * A quantidade de páginas no total
   */
  pageCount: number;

  /**
   * O total de items
   */
  total: number;

}
