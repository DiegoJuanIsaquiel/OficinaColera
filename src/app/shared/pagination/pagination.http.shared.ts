//#region Imports

import { AfterViewInit, Component, Directive, ElementRef, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbToastrService } from '@nebular/theme';
import { QueryJoin, QueryJoinArr, QuerySort, RequestQueryBuilder, SCondition } from '@nestjsx/crud-request';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import { BaseCrudProxy } from '../../models/proxys/base/base-crud.proxy';
import { CrudRequestResponseProxy } from '../../models/proxys/base/crud-request-response.proxy';
import { AsyncResult } from '../../modules/http-async/models/async-result';
import { HttpAsyncService } from '../../modules/http-async/services/http-async.service';
import { getCrudErrors, getCurrentUser } from '../utils/functions';

//#endregion

/**
 * A classe que representa o conteúdo básico para uma página que irá conter páginação
 */
@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class PaginationHttpShared<TProxy extends BaseCrudProxy> implements OnInit, AfterViewInit, OnDestroy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    protected toast: NbToastrService,
    protected http: HttpAsyncService,
    @Optional()
    protected route?: string,
    @Optional()
    public displayedColumns?: string[],
    @Optional()
    protected entityColumns?: string[],
    @Optional()
    protected searchConditions?: (search: string) => Promise<SCondition | [SCondition, SCondition]>,
    @Optional()
    protected sortBy: QuerySort = {
      field: 'createdAt',
      order: 'ASC',
    },
    @Optional()
    protected joins: QueryJoin | QueryJoinArr | Array<QueryJoin | QueryJoinArr> = [],
  ) { }

  //#endregion

  //#region View Childs

  /**
   * O elemento responsável pela paginação
   */
  @ViewChild(MatPaginator, { static: true })
  public paginator: MatPaginator;

  /**
   * O element responsável pelo sorting
   */
  @ViewChild(MatSort, { static: true })
  public sort: MatSort;

  /**
   * O elemento responsável pela pesquisa
   */
  @ViewChild('input', { static: true })
  public searchInput: ElementRef;

  //#endregion

  //#region Public Properties

  /**
   * Diz se está carregando resultados
   */
  public isLoadingResults = true;

  /**
   * A lista de informações que serão paginadas
   */
  public dataSource: MatTableDataSource<TProxy>;

  /**
   * As informações de paginação
   */
  public pageEvent: Partial<PageEvent> = {
    pageIndex: 0,
    pageSize: 15,
  };

  /**
   * O numero padrão de itens por página
   */
  public pageSizeDefault: number = 15;

  //#endregion

  //#region Private Properties

  /**
   * A inscrição do evento para filtrar
   */
  private searchInputSubscription: Subscription;

  //#endregion

  //#region LifeCycle Events

  /**
   * Método que é executado ao iniciar o componente
   */
  public async ngOnInit(): Promise<void> {
    this.dataSource = new MatTableDataSource<TProxy>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const { error, success } = await this.getValues<TProxy>(this.route, 0, this.pageSizeDefault);

    if (success) {
      this.dataSource.connect().next(success);
    } else {
      this.toast.danger(getCrudErrors(error)[0], 'Oops...');
    }

    this.isLoadingResults = false;
  }

  /**
   * Método que é executado após iniciar a view
   */
  public ngAfterViewInit(): void {
    if (!this.searchInput || !this.searchInput.nativeElement)
      return;

    this.searchInputSubscription = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.pageEvent.pageIndex = 0;

          this.onPageChange(this.pageEvent);
        }),
      )
      .subscribe();

  }

  /**
   * Método chamado quando o componente é destruido
   */
  public ngOnDestroy(): void {
    this.searchInputSubscription && this.searchInputSubscription.unsubscribe();
  }

  //#endregion

  //#region Public Methods

  /**
   * Método executado ao trocar de página
   *
   * @param event O evento lançado
   */
  public async onPageChange(event: Partial<PageEvent>): Promise<void> {
    this.isLoadingResults = true;

    this.pageEvent = event;

    const value = this.searchInput && this.searchInput.nativeElement && this.searchInput.nativeElement.value || '';
    const searchValue = this.isString(value) && value.trim().toLocaleLowerCase() || '';

    const { error, success } = await this.getValues<TProxy>(this.route, this.pageEvent.pageIndex || 0, this.pageEvent.pageSize || this.pageSizeDefault, searchValue);

    this.isLoadingResults = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.dataSource.connect().next(success);
  }

  /**
   * Método que alterna a visibilidade de uma entidade
   *
   * @param entity A entidade a ser alternada
   */
  public async onClickToToggleIsActive(entity: BaseCrudProxy): Promise<void> {
    const user = getCurrentUser();

    if (this.route === '/users' && entity.id === user.id)
      return void this.toast.danger('Você não pode desativar o seu próprio usuário!', 'Oops...');

    this.isLoadingResults = true;

    const url = `${ this.route }/${ entity.id }/${ (entity.isActive ? 'disable' : 'enable') }`;
    const { error } = await this.http.put<unknown>(url, {});

    this.isLoadingResults = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('A operação foi executada com sucesso!', 'Sucesso');

    this.onPageChange(this.pageEvent);
  }

  //#endregion

  //#region Protected Methods

  /**
   * Método que retorna os parametros para uma busca mais complexa
   *
   * @param url O url a ser usado como referência
   * @param page O indice da página
   * @param limit O limite de itens por página
   * @param search O termo a ser buscado
   */
  protected async getValues<T>(url: string, page: number, limit: number, search?: string): Promise<AsyncResult<T[]>> {
    let query = new RequestQueryBuilder()
      .select(this.entityColumns)
      .setPage(page + 1)
      .setLimit(limit)
      .setJoin(this.joins)
      .setOffset(0)
      .sortBy(this.sortBy)
      .search({});

    const searchQuery = this.searchConditions && await this.searchConditions(search);

    if (searchQuery) {
      if (Array.isArray(searchQuery)) {
        if (!search)
          query = query.search(searchQuery[0]);
        else
          query = query.search(searchQuery[1]);
      } else {
        query = query.search(searchQuery);
      }
    }

    const queryParams = query.query(true);

    const { success, error } = await this.http.get<CrudRequestResponseProxy<T>>(`${ url }${ url.includes('?') ? '&' : '?' }${ queryParams }`);

    if (error)
      return { error };

    this.dataSource.paginator.pageIndex = success.page - 1;
    this.dataSource.paginator.length = success.total;
    this.dataSource.paginator.pageSize = success.count < this.pageSizeDefault ? this.pageSizeDefault : success.count;

    this.pageEvent = {
      length: success.total,
      pageSize: success.count < this.pageSizeDefault ? this.pageSizeDefault : success.count,
      pageIndex: success.page - 1,
    };

    return { success: success.data };
  }

  /**
   * Diz se o valor da variável é uma string
   *
   * @param value O valor a ser verificado
   */
  protected isString(value: any): boolean {
    return Object.prototype.toString.call(value) === '[object String]';
  }

  //#endregion

}
