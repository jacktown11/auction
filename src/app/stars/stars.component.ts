import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit, OnChanges {
  @Input()
  rating: number;

  @Output()
  ratingChange: EventEmitter<number> = new EventEmitter();

  @Input()
  isClickable: boolean = false;

  stars: boolean[] = [];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(): void {
    this.stars = [];
    for (let i = 1; i <= 5; i++) {
      this.stars.push(i <= this.rating);
    }
  }

  setRating(rating: number): void {
    if (this.isClickable) {
      this.rating = rating;
      this.ratingChange.emit(this.rating);
    }
  }
}
