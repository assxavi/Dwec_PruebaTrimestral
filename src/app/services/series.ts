import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

export interface Series {
  id: number | string;
  title: string;
  channel: string;
  rating: number;
}

@Injectable({ providedIn: 'root' })
export class SeriesService {
  private readonly url = 'https://peticiones.online/api/series';
  private readonly localSeriesKey = 'local_created_series';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Series[]> {
    return this.http.get<Series[]>(this.url).pipe(
      map((apiSeries) => [...this.getLocalSeries(), ...apiSeries]),
    );
  }

  create(payload: { title: string; channel: string; rating: number }): Observable<any> {
    return this.http.post<any>(this.url, payload).pipe(
      tap((res) => {
        const newSeries: Series = {
          id: res?.id ?? Date.now(),
          title: payload.title,
          channel: payload.channel,
          rating: payload.rating,
        };
        this.saveLocalSeries(newSeries);
      }),
    );
  }

  private getLocalSeries(): Series[] {
    try {
      const stored = localStorage.getItem(this.localSeriesKey);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveLocalSeries(newSeries: Series): void {
    const current = this.getLocalSeries();
    localStorage.setItem(this.localSeriesKey, JSON.stringify([newSeries, ...current]));
  }
}
