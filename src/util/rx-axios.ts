import { Observable, Subscriber } from 'rxjs'
import axios, { AxiosResponse, AxiosRequestConfig, CancelTokenSource } from 'axios'


class AxiosSubscriber extends Subscriber<any> {
  cancelSource: CancelTokenSource;
  aborted: boolean;

  constructor(observer: any, request: (options: AxiosRequestConfig) => Promise<AxiosResponse<any>>, options?: AxiosRequestConfig) {
    super(observer)

    const CancelToken = axios.CancelToken;
    this.cancelSource = CancelToken.source();

    // XHR abort pointer
    this.aborted = false;

    // make axios request on subscription
    request({...options, cancelToken: this.cancelSource.token })
      .then((response :any) => {
        observer.next(response.data);
        observer.complete();
      })
      .catch((error :any) => {
        if (axios.isCancel(error))
        {
          return
        }
        observer.error(error)
      });
  }

  unsubscribe() {
    super.unsubscribe();

    // cancel XHR
    if (this.aborted === false) {
      this.cancelSource.cancel()
      this.aborted = true;
    }
  }
}

const _request = (request: (options: AxiosRequestConfig) => Promise<AxiosResponse<any>>, options?: AxiosRequestConfig) :Observable<AxiosResponse<any>>  =>
  new Observable<AxiosResponse<any>>(observer => new AxiosSubscriber(observer, request, options))

const RxAxios = {
  get: (url: string, options?: AxiosRequestConfig) :Observable<AxiosResponse<any>> => _request(o => axios.get(url, o), options)
}

export default RxAxios