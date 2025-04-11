import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://10.20.107.28:4000/reports';
  
  constructor() {}

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

            // Procesar cada línea (asumiendo JSON por línea)
            chunk.split('\n').forEach(line => {
              const trimmed = line.trim();
              if (trimmed) {
                try {
                  observer.next(JSON.parse(trimmed));
                } catch (e) {
                  console.warn('No se pudo parsear el chunk:', trimmed);
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
