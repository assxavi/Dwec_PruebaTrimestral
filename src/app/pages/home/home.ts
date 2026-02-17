import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesService, Series } from '../../services/series';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  series: Series[] = [];
  loading = true;
  error = '';

  constructor(private seriesService: SeriesService) {}

  ngOnInit(): void {
    this.seriesService.getAll().subscribe({
      next: (data) => {
        this.series = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando series';
        this.loading = false;
      },
    });
  }
}
