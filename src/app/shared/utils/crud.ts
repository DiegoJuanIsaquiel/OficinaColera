/**
 * Representa os parâmetros de uma requisição GetMany
 */
export interface CrudRequestParams<T> {

  /**
   * As colunas para retornar
   */
  fields?: CrudRequestField<T>[];

  /**
   * As colunas de join
   */
  join?: CrudRequestField<T>[];

  /**
   * O filtro da requisição
   */
  search?: CrudRequestCondition<T>;

  /**
   * A quantidade de dados a serem retornados
   */
  limit?: number;

  /**
   * A página a ser retornada
   */
  page?: number;

  /**
   * A ordenação dos resultados
   */
  sort?: { field: CrudRequestField<T>, order: 'ASC' | 'DESC' }[];

}

export type CrudRequestField<T> = Extract<keyof T, string> | string;

/**
 * Representa um valor primitivo aceito em um filtro
 */
export type CrudRequestPrimitiveValue = string | number | boolean;

/**
 * Representa os operadores lógicos de um filtro
 */
export interface CrudRequestSearchOperator {
  /**
   * (=, equal)
   */
  $eq?: CrudRequestPrimitiveValue;

  /**
   * (!=, not equal)
   */
  $ne?: CrudRequestPrimitiveValue;

  /**
   * (>, greater than)
   */
  $gt?: CrudRequestPrimitiveValue;

  /**
   * (<, lower that)
   */
  $lt?: CrudRequestPrimitiveValue;

  /**
   * (>=, greater than or equal)
   */
  $gte?: CrudRequestPrimitiveValue;

  /**
   * (<=, lower than or equal)
   */
  $lte?: CrudRequestPrimitiveValue;

  /**
   * (LIKE val%, starts with)
   */
  $starts?: CrudRequestPrimitiveValue;

  /**
   * (LIKE %val, ends with)
   */
  $ends?: CrudRequestPrimitiveValue;

  /**
   * (LIKE %val%, contains)
   */
  $cont?: CrudRequestPrimitiveValue;

  /**
   * (NOT LIKE %val%, not contains)
   */
  $excl?: CrudRequestPrimitiveValue;

  /**
   * (IN, in range, accepts multiple values)
   */
  $in?: CrudRequestPrimitiveValue[];

  /**
   * (NOT IN, not in range, accepts multiple values)
   */
  $notin?: CrudRequestPrimitiveValue[];

  /**
   * (IS NULL, is NULL, doesn't accept value)
   */
  $isnull?: boolean;

  /**
   * (IS NOT NULL, not NULL, doesn't accept value)
   */
  $notnull?: boolean;

  /**
   * (BETWEEN, between, accepts two values)
   */
  $between?: [CrudRequestPrimitiveValue, CrudRequestPrimitiveValue];

  /**
   * (LOWER(field) =, equal)
   */
  $eqL?: CrudRequestPrimitiveValue;

  /**
   * (LOWER(field) !=, not equal)
   */
  $neL?: CrudRequestPrimitiveValue;

  /**
   * (LIKE|ILIKE val%)
   */
  $startsL?: CrudRequestPrimitiveValue;

  /**
   * (LIKE|ILIKE %val, ends with)
   */
  $endsL?: CrudRequestPrimitiveValue;

  /**
   * (LIKE|ILIKE %val%, contains)
   */
  $contL?: CrudRequestPrimitiveValue;

  /**
   * (NOT LIKE|ILIKE %val%, not contains)
   */
  $exclL?: CrudRequestPrimitiveValue;

  /**
   * (LOWER(field) IN, in range, accepts multiple values)
   */
  $inL?: CrudRequestPrimitiveValue[];

  /**
   * (LOWER(field) NOT IN, not in range, accepts multiple values)
   */
  $notinL?: CrudRequestPrimitiveValue[];

  $or?: CrudRequestSearchOperator;
  $and?: never;
}

/**
 * Representa um dicionário de filtros por campo
 */
export type CrudRequestFields<T extends string | number | symbol> =
  Record<T, CrudRequestPrimitiveValue | CrudRequestSearchOperator | CrudRequestCondition<T>[] | undefined>;

/**
 * Representa uma condição OR
 */
export interface CrudRequestFieldsOr<T> {
  $or?: CrudRequestCondition<T>[];
  $and?: never;
}

/**
 * Representa uma condição AND
 */
export interface CrudRequestFieldsAnd<T> {
  $and?: CrudRequestCondition<T>[];
  $or?: never;
}

/**
 * Representa uma condição completa de filtro
 */
export type CrudRequestCondition<T> =
  (Partial<CrudRequestFields<keyof T>> & CrudRequestFields<string> & CrudRequestFieldsOr<T>) | CrudRequestFieldsAnd<T>;

/**
 * Cria uma querystring para um endpoint GetMany
 *
 * @param params Os parâmetros
 */
export function createCrudParams<T>(params: CrudRequestParams<T>): string {
  const qs: string[] = [];

  if (params.fields)
    qs.push(`fields=${encodeURIComponent(params.fields.join(','))}`);

  if (params.search)
    qs.push(`s=${encodeURIComponent(JSON.stringify(params.search))}`);

  if (params.limit)
    qs.push(`limit=${params.limit}`);

  if (params.page)
    qs.push(`page=${params.page}`);

  if (params.join)
    params.join.forEach((j, i) => qs.push(`join[${i}]=${encodeURIComponent(j)}`));

  if (params.sort)
    params.sort.forEach((s, i) => qs.push(`sort[${i}]=${encodeURIComponent(s.field + ',' + s.order)}`));

  return qs.join('&');
}

/**
 * Cria uma URL de requisição para um endpoint GetMany
 *
 * @param endpoint O endpoint
 * @param params Os parâmetros
 */
export function createCrudRequest<T>(endpoint: string, params: CrudRequestParams<T>): string {
  return endpoint + '?' + createCrudParams(params);
}
