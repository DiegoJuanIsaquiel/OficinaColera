//#region Imports

import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { Directive, OnDestroy } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { fileTypeFromBuffer } from 'file-type/core';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, filter, mergeMap, tap } from 'rxjs/operators';
import { PresignedPost } from '../../models/proxys/presigned-post.proxy';
import { BaseUrlInterceptor } from '../../modules/http-async/interceptors/base-url.interceptor';
import { BearerTokenInterceptor } from '../../modules/http-async/interceptors/bearer-token.interceptor';
import { HttpAsyncHeadersInterceptor } from '../../modules/http-async/interceptors/http-async-headers.interceptor';
import { HttpAsyncService } from '../../modules/http-async/services/http-async.service';
import { getCrudErrors } from '../utils/functions';

//#endregion

@Directive()
export class HttpUploadFileShared implements OnDestroy {

  //#region Constructor

  constructor(
    protected readonly toast: NbToastrService,
    protected readonly http: HttpAsyncService,
    protected readonly defaultMediaType?: 'videos' | 'images' | 'lessons',
  ) { }

  //#endregion

  //#region Protected Properties

  protected progressReportSubscription?: Subscription;

  //#endregion

  //#region Public Properties

  public isUploadingFile: boolean = false;

  public uploadingProgress: number = 0;

  //#endregion

  //#region LifeCycle Events

  public async ngOnDestroy(): Promise<void> {
    this.progressReportSubscription?.unsubscribe();
  }

  //#endregion

  //#region Public Methods

  public async uploadFile(file: File, mediaType?: 'videos' | 'images' | 'avatars'): Promise<Observable<string | null>> {
    this.isUploadingFile = true;

    const mimeType = await fileTypeFromBuffer(await file.arrayBuffer()).then(info => info?.mime || file.type).catch(() => file.type);

    const { error, success: credentials } = await this.http.post<PresignedPost>(
      `/medias/presigned/${ mediaType || this.defaultMediaType }`,
      { mimeType },
    );

    if (error || !credentials) {
      this.isUploadingFile = false;

      this.toast.danger(getCrudErrors(error)[0], 'Oops...');

      return of(null);
    }

    const filename = `${ credentials.url }/${ credentials.fields.key }`;
    const formData = new FormData();

    formData.append('Content-Type', mimeType);

    Object.entries(credentials.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('file', file);

    const http = this.http.getNativeClient();

    return http.post<void>(credentials.url, formData, {
      headers: new HttpHeaders({
        [BaseUrlInterceptor.DISABLE_HEADER]: 'true',
        [BearerTokenInterceptor.DISABLE_HEADER]: 'true',
        [HttpAsyncHeadersInterceptor.DISABLE_HEADER]: 'true',
      }),
      reportProgress: true,
      observe: 'events',
      responseType: 'json',
    }).pipe(
      tap(event => {
        if (event.type !== HttpEventType.UploadProgress)
          return;

        this.uploadingProgress = Math.ceil((event.loaded / (event?.total || 0)) * 100);
      }),
      filter(event => {
        if (event.type !== HttpEventType.UploadProgress)
          return false;

        return event.loaded === event.total;
      }),
      mergeMap(() => {
        this.isUploadingFile = false;

        return of(filename);
      }),
      catchError(() => {
        this.isUploadingFile = false;

        return of(null);
      }),
    );
  }

  //#endregion

}
