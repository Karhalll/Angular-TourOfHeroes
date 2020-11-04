import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
	private heroesUrl = 'api/heroes';

  constructor(
		private messageService: MessageService,
		private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('fetched heroes')),
				catchError(this.handleError<Hero[]>('getHeroes', []))
			);
  }

  getHeroe(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}
	
	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}

	/**
		* Handle Http operation that failed.
		* Let the app continue.
		* @param operation - name of the operation that failed
		* @param result - optional value to return as the observable result
	*/
	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed: ${error.message}`);
			return of(result as T);
		}
	}
}
