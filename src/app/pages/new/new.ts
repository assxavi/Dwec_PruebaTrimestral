import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeriesService } from '../../services/series';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new.html',
})
export class NewComponent {
  loading = false;
  createdId: number | null = null;
  error = '';
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    channel: ['', [Validators.required]],
    rating: [null as any, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  constructor(private service: SeriesService, private router: Router) {}

  submit(): void {
    this.error = '';
    this.createdId = null;

    if (this.form.invalid) return;

    this.loading = true;

    const payload = {
      title: this.form.value.title!,
      channel: this.form.value.channel!,
      rating: Number(this.form.value.rating),
    };

    this.service.create(payload).subscribe({
      next: (res) => {
        this.createdId = res?.id ?? res?.data?.id ?? null;
        this.loading = false;

        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: () => {
        this.error = 'Error realizando el POST';
        this.loading = false;
      },
    });
  }
}
