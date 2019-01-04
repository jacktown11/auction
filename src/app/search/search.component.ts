import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  formModel: FormGroup;
  categories: string[];

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.formModel = fb.group({
      productTitle: ['', [Validators.required, Validators.minLength(3)]],
      productPrice: [null, positiveNumberValidator],
      category: [-1]
    });
  }

  ngOnInit() {
    this.categories = this.productService.getCategories();
  }

  submitForm() {
    console.log(this.formModel.status);
    if (this.formModel.valid) {
      console.log(this.formModel.value);
    } else {
      console.log('表单数据不完全正确，不能提交');
    }
  }
}
export function positiveNumberValidator(numberCtr: AbstractControl): any {
  let value = numberCtr.value;
  if (value == null) return null;
  let num = parseInt(value);
  return num <= 0 ? { positive: { info: '必须是正数' } } : null;
}
