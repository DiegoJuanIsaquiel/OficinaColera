//#region Imports

import { AfterViewInit, Directive, ElementRef, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbToastrService } from '@nebular/theme';
import { QueryJoin, QueryJoinArr, QuerySort, RequestQueryBuilder, SCondition } from '@nestjsx/crud-request';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import * as xlsx from 'xlsx';
import { BaseCrudProxy } from '../../models/proxys/base/base-crud.proxy';
import { CrudRequestResponseProxy } from '../../models/proxys/base/crud-request-response.proxy';
import { AsyncResult } from '../../modules/http-async/models/async-result';
import { HttpAsyncService } from '../../modules/http-async/services/http-async.service';
import { UserService } from '../../services/user/user.service';
import { getCrudErrors, isString } from '../utils/functions';

//#endregion

@Directive()
export abstract class PaginationHttpShared<TProxy extends BaseCrudProxy> implements OnInit, AfterViewInit, OnDestroy {

  //#region Constructor

  constructor(
    protected readonly toast: NbToastrService,
    protected readonly http: HttpAsyncService,
    protected readonly user: UserService,
    @Optional()
    protected route: string,
    @Optional()
    public displayedColumns: string[],
    @Optional()
    protected entityColumns: string[],
    @Optional()
    protected searchConditions?: (search: string) => Promise<SCondition | [SCondition, SCondition]>,
    @Optional()
    protected sortBy: QuerySort = {
      field: 'createdAt',
      order: 'DESC',
    },
    @Optional()
    protected joins: QueryJoin | QueryJoinArr | Array<QueryJoin | QueryJoinArr> = [],
  ) {
    this.defaultSortOrder = sortBy;
  }

  //#endregion

  //#region ViewChilds

  @ViewChild(MatPaginator, { static: true })
  public paginator?: MatPaginator;

  @ViewChild(MatSort, { static: true })
  public sort?: MatSort;

  @ViewChild('input', { static: true })
  public searchInput?: ElementRef;

  //#endregion

  //#region Public Properties

  public defaultSortOrder: { field: string; order: 'ASC' | 'DESC' };

  public includeOnlyActives = true;

  public isLoadingResults = true;

  public dataSource!: MatTableDataSource<TProxy>;

  public pageEvent: Partial<PageEvent> = {
    pageIndex: 0,
    pageSize: 15,
  };

  public pageSizeDefault: number = 15;

  //#endregion

  //#region Private Properties

  private searchInputSubscription?: Subscription;

  //#endregion

  //#region LifeCycle Events

  public async ngOnInit(): Promise<void> {
    this.dataSource = new MatTableDataSource<TProxy>([]);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;

    const { error, success } = await this.getPaginatedData<TProxy>(this.route, 0, this.pageSizeDefault);

    if (success)
      this.dataSource.connect().next(success);
    else
      this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.isLoadingResults = false;
  }

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

  public ngOnDestroy(): void {
    this.searchInputSubscription?.unsubscribe();
  }

  //#endregion

  //#region Public Methods

  public async onChangeSort(sortedHeader: Sort): Promise<void> {
    if (sortedHeader.direction !== '') {
      this.sortBy = {
        field: sortedHeader.active,
        order: sortedHeader.direction.toUpperCase() as 'ASC' | 'DESC',
      };
    } else
      this.sortBy = this.defaultSortOrder;

    await this.reloadOnFirstPage();
  }

  public async reloadOnFirstPage(): Promise<void> {
    this.pageEvent.pageIndex = 0;

    await this.onPageChange(this.pageEvent);
  }

  public async onPageChange(event: Partial<PageEvent>): Promise<void> {
    this.isLoadingResults = true;

    this.pageEvent = event;

    const value = this.searchInput && this.searchInput.nativeElement && this.searchInput.nativeElement.value || '';
    const searchValue = isString(value) && value.trim().toLocaleLowerCase() || '';

    const { error, success } = await this.getPaginatedData<TProxy>(
      this.route,
      this.pageEvent.pageIndex || 0,
      this.pageEvent.pageSize || this.pageSizeDefault,
      searchValue,
    );

    this.isLoadingResults = false;

    if (error || !success)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.dataSource?.connect().next(success);
  }

  public async onClickToDelete(entity: BaseCrudProxy): Promise<void> {
    const user = this.user.getCurrentUser();

    if (!user)
      return;

    if (this.route === '/users' && entity.id === user.id)
      return void this.toast.danger('Você não pode remover o seu próprio usuário!', 'Oops...');

    this.isLoadingResults = true;

    const url = `${ this.route }/${ entity.id }`;
    const { error } = await this.http.delete<unknown>(url, {});

    this.isLoadingResults = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('A operação foi executada com sucesso!', 'Sucesso');

    await this.onPageChange(this.pageEvent);
  }

  public async onClickExport(exportName: string): Promise<void> {
    this.isLoadingResults = true;

    const { error, success } = await this.getAllData(0, 100);

    this.isLoadingResults = false;

    if (error || !success)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    const formattedDataToExcel = this.getFormattedDataToExcel(success);

    const sheet = xlsx.utils.json_to_sheet(formattedDataToExcel);
    const workbook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workbook, sheet, exportName);

    xlsx.writeFile(workbook, `${ exportName } v${ +new Date() }.xlsx`);
  }

  //#endregion

  //#region Protected Methods

  protected async getPaginatedData<T>(url: string, page: number, limit: number, search?: string): Promise<AsyncResult<T[]>> {
    let query = new RequestQueryBuilder()
      .select(this.entityColumns)
      .setPage(page + 1)
      .setLimit(limit)
      .setJoin(this.joins)
      .setOffset(0)
      .sortBy(this.sortBy)
      .search({});

    query = await this.applySearchParamsToQuery(query, search);

    const queryParams = query.query(true);

    const requestUrl = `${ url }${ url.includes('?') ? '&' : '?' }${ queryParams }`;
    const { success, error } = await this.http.get<CrudRequestResponseProxy<T>>(requestUrl);

    if (error)
      return { error };

    if (!this.dataSource?.paginator)
      throw new Error('É necessário adicionar o componente de paginação para poder usar a busca de dados.');

    this.dataSource.paginator.pageIndex = Array.isArray(success) ? 0 : success!.page - 1;
    this.dataSource.paginator.length = Array.isArray(success) ? success.length : success!.total;
    this.dataSource.paginator.pageSize = Array.isArray(success)
      ? success.length
      : success!.count < this.pageSizeDefault
        ? this.pageSizeDefault
        : success!.count;

    this.pageEvent = {
      length: this.dataSource.paginator.length,
      pageSize: this.dataSource.paginator.pageSize,
      pageIndex: this.dataSource.paginator.pageIndex,
    };

    return { success: Array.isArray(success) ? success : success!.data };
  }

  protected async getAllData(page: number = 0, limit = 200, url = this.route): Promise<AsyncResult<TProxy[]>> {
    let query = new RequestQueryBuilder()
      .select(this.entityColumns.map(key => String(key)))
      .setPage(page + 1)
      .setLimit(limit)
      .setJoin(this.joins)
      .setOffset(0)
      .sortBy(this.sortBy)
      .search({});

    const search = this.searchInput?.nativeElement?.value || '';

    query = await this.applySearchParamsToQuery(query, search);

    const queryParams = query.query(true);

    const { success, error } = await this.http.get<CrudRequestResponseProxy<TProxy>>(`${ url }${ url.includes('?') ? '&' : '?' }${ queryParams }`);

    if (error)
      return { error };

    const sessionQuestions = Array.isArray(success) ? success : success!.data;

    if (sessionQuestions.length !== limit)
      return { success: sessionQuestions };

    const { error: errorOnGetMore, success: moreSessionQuestions } = await this.getAllData(page + 1);

    if (errorOnGetMore)
      return { error: errorOnGetMore };

    return {
      success: [...sessionQuestions, ...(moreSessionQuestions || [])],
    };
  }

  protected getFormattedDataToExcel(success: TProxy[]): any {
    return success;
  }

  protected async applySearchParamsToQuery(query: RequestQueryBuilder, search?: string): Promise<RequestQueryBuilder> {
    const searchQuery = this.searchConditions && await this.searchConditions(search || '');

    if (searchQuery) {
      if (Array.isArray(searchQuery)) {
        if (!search) {
          query = query.search({
            ...this.includeOnlyActives && { isActive: this.includeOnlyActives },
            ...searchQuery[0],
          });
        } else {
          query = query.search({
            ...this.includeOnlyActives && { isActive: this.includeOnlyActives },
            ...searchQuery[1],
          });
        }
      } else {
        query = query.search({
          ...this.includeOnlyActives && { isActive: this.includeOnlyActives },
          ...searchQuery,
        });
      }
    }

    return query;
  }

  //#endregion

}
