import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
[x: string]: any;

  activeSort = 'name';
  direction: 'asc' | 'desc' = 'asc';

  @Input() products: any[] = [];
  @Input() page = 1;
  @Input() pageSize = 5;
  @Input() pageSizes: number[] = [];
  @Input() totalRecords = 0;
  @Input() noRecordsFound = false;

  @Output() editProduct = new EventEmitter<any>();
  @Output() deleteProduct = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() applySorting = new EventEmitter<string>();

  edit(p: any) {
    this.editProduct.emit(p);
  }

  remove(id: number) {
    this.deleteProduct.emit(id);
  }

  sorting(column: string){
    if(this.activeSort === column){
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    }
    else{
      this.activeSort = column;
      this.direction = 'asc';
    }
    if (column === 'no') {
    this.products = [...this.products].sort((a, b) =>
      this.direction === 'asc'
        ? a.rowNo - b.rowNo
        : b.rowNo - a.rowNo
    );
    return;
  }
    this.applySorting.emit(column);
  }
  get totalPages(): number {
    if(!this.totalRecords || !this.pageSize){
      return 0;
    }
    return Math.ceil(this.totalRecords / this.pageSize);
  }
  get startEntry(): number {
    return this.totalRecords === 0 ? 0 : (this.page - 1) * this.pageSize + 1;
  }
  get endEntry(): number {
    return Math.min(this.page * this.pageSize, this.totalRecords);
  }
}
