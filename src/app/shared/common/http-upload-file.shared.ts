//#region Imports

import { HttpEventType, HttpHeaders } from '@angular/common/http';
import { Directive, OnDestroy } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, delay, filter, mergeMap, tap } from 'rxjs/operators';
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
    protected readonly defaultMediaType?: 'videos' | 'images' | 'avatars',
  ) { }

  //#endregion

  //#region Private Properties

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

  //#region Public Properties

  public async uploadFile(file: File, mediaType?: 'videos' | 'images' | 'avatars'): Promise<Observable<string | null>> {
    this.isUploadingFile = true;

    const filename = file.name;
    const { error, success: credentials } = await this.http.post<PresignedPost>(`/media/presigned/${ mediaType || this.defaultMediaType }`, { filename });

    if (error || !credentials) {
      this.isUploadingFile = false;

      this.toast.danger(getCrudErrors(error)[0], 'Oops...');

      return of(null);
    }

    const s3Url = `${ credentials.url }/${ credentials.fields.key }`;
    const formData = new FormData();

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
      filter(event => event.type === HttpEventType.Response),
      mergeMap(() => {
        this.isUploadingFile = false;

        return of(s3Url);
      }),
      catchError(() => {
        this.isUploadingFile = false;

        return of(null);
      }),
      delay(500),
    );
  }

  //#endregion

}
