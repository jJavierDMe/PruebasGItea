import { Component, OnInit } from '@angular/core';
import { ReportService } from './services/report.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mi-aplicacio-prueba';
  reports: any[] = [];
  
  constructor(private reportService: ReportService){

  }

  ngOnInit() {
    this.reportService.getReportsStream().subscribe({
      next: chunk => this.reports.push(chunk),
      error: err => console.error('Error en stream:', err),
      complete: () => console.log('Stream finalizado')
    });
  }
  
}
