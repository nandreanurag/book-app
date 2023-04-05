import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../model/Book';
import { ResponseModel } from '../model/ResponseModel';
import { GetBookResponseModel } from '../model/GetBookResponseModel';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // private baseUrl1 = 'http://localhost:8081/v1/books';
  private baseUrl1='http://dev.anuragnandre.me:8081/v1/books'
  private baseUrl2 = 'http://localhost:8082/v1/books'
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getBooks(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(this.baseUrl1)
    //   .pipe(
    //     catchError(this.handleError<ResponseModel>('getBooks', []))
    //   );
  }

  searchBooks(term: string): Observable<Book[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Book[]>(`${this.baseUrl1}?title=${term}`)
      .pipe(
        catchError(this.handleError<Book[]>('searchBooks', []))
      );
  }

  getBook(id: number): Observable<GetBookResponseModel> {
    const url = `${this.baseUrl2}/${id}`;
    return this.http.get<GetBookResponseModel>(url)
    //   .pipe(
    //     catchError(this.handleError<Book>(`getBook id=${id}`))
    //   );
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.baseUrl1, book, this.httpOptions)
      .pipe(
        catchError(this.handleError<Book>('addBook'))
      );
  }

  updateBook(book: Book): Observable<any> {
    const url = `${this.baseUrl1}/${book.id}`;
    return this.http.put(url, book, this.httpOptions)
      .pipe(
        catchError(this.handleError<any>('updateBook'))
      );
  }

  deleteBook(id: number): Observable<Book> {
    const url = `${this.baseUrl1}/${id}`;
    return this.http.delete<Book>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError<Book>('deleteBook'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
