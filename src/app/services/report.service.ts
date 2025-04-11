import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://10.20.111.183:4000/reports';

  constructor() {}

  // Devuelve Observable que emite cada chunk del stream
  getReportsStream(): Observable<any> {
    return new Observable(observer => {
      fetch(this.baseUrl).then(response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const read = () => {
          if (!reader) {
            observer.complete();
            return;
          }

          reader.read().then(({ done, value }) => {
            if (done) {
              observer.complete();
              return;
            }

            const chunk = decoder.decode(value, { stream: true });

            // Si vienen múltiples líneas por chunk, divídelas
            chunk.split('\n').forEach(line => {
              if (line.trim()) {
                try {
                  const parsed = JSON.parse(line);
                  observer.next(parsed);
                } catch (err) {
                  console.warn('Chunk no válido:', line);
                }
              }
            });

            read(); // sigue leyendo
          }).catch(err => observer.error(err));
        };

        read();
      }).catch(err => observer.error(err));
    });
  }
}
