import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrls: ['./ng-multiselect-dropdown.theme.scss', './filter-product.component.css']
})
export class FilterProductComponent implements OnInit {

  // fromDate: string = new Date().toISOString().split('T')[0];
  // toDate: string = new Date().toISOString().split('T')[0];

  products: any[] = [];
  page = 1;
  pageSizes = [5, 10, 20];
  pageSize = this.pageSizes[0];
  totalRecords = 0;

  title = "Product-List"
  searchText = '';
  fromDate = '';
  toDate = '';
  priceMinValue = 0;
  priceMaxValue = 0;
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  isFilterApplied = false;
  noRecordsFound = false;
  dateError = '';
  noFilterError = '';
  priceError = '';

  apiBaseUrl = 'https://localhost:7068';
  imagePath = '';

  featureDropdownList: any[] = [];
  selectedFeatures: any[] = [];
  featureDropdownSettings!: IDropdownSettings;

  priceOptions: Options = {
    floor: 0,
    ceil: 0,
    step: 1000,
    translate: (value: number): string => {
      return '₹' + value;
    }
  };

  featureDropdownRender(): void {
    this.featureDropdownList = [
      { id: 1, name: 'Calling' },
      { id: 2, name: 'Messaging' },
      { id: 3, name: 'Internet' },
      { id: 4, name: 'Camera' },
      { id: 5, name: 'Connectivity' },
      { id: 6, name: 'Microphone' },
      { id: 7, name: 'Processor' },
      { id: 8, name: 'Keyboard' },
      { id: 9, name: 'Material' },
      { id: 10, name: 'Size' }
    ];

    this.featureDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      maxHeight: 5000
    };
  }
  
  constructor(private service: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.featureDropdownRender();
    this.loadPriceRange();
  }

  load(): void {
    const featureNames = this.selectedFeatures
      .map(f => f.name)
      .join(', ');
    
    const query = {
      page: this.page, pageSize: this.pageSize, search: this.searchText || '', fromDate: this.fromDate || null,
      toDate: this.toDate || null, minPrice: this.priceMinValue, maxPrice: this.priceMaxValue, features: featureNames || '',
      sortBy: this.sortBy || 'name', sortOrder: this.sortOrder || 'asc'
    };

    this.service.get(query).subscribe(res => {
      this.products = res.data.map((p: any, index: number) => ({
        ...p,
        rowNo: (this.page - 1) * this.pageSize + index + 1,
        imagePath: p.imagePath ? this.apiBaseUrl + p.imagePath : ''
      }));
      this.totalRecords = res.totalRecords;
      this.noRecordsFound = this.products.length === 0;
    });
  }

  loadPriceRange(): void {
    this.service.getPriceRange().subscribe(res => {

      this.priceMinValue = res.min;
      this.priceMaxValue = res.max;

      this.priceOptions = {
        ...this.priceOptions,
        floor: res.min,
        ceil: res.max
      };
      this.load();
    });
  }

  sort(column: string): void {

    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    Promise.resolve().then(() => {
      this.page = 1;
      this.load();
    });
    
  }

  addProduct(): void {
    this.router.navigate(['/crafted/pages/product/add-update-product/add']);
  }

  editProduct(product: any): void {
    this.router.navigate(['/crafted/pages/product/add-update-product/edit', product.productId]);
  }

  deleteProduct(id: number): void {
    this.service.delete(id).subscribe(() => this.load());
  }

  onPageChange(page: number): void {

    if(page < 1 || page > this.pageSize)
    {
      return;
    }
    
    this.page = page;
    this.load();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 1;
    this.load();
  }

  onFilterChange(): void {
    this.page = 1;
    this.load();
  }

  validateDates(): boolean {
    this.dateError = '';

    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
      const todayDate = new Date();

      if (from > to) {
        this.dateError = '*To Date should be greater then From Date';
        return false;
      }
      if (to > todayDate) {
        this.dateError = '*To Date should not be greater then Current Date';
        return false;
      }
      if(to && to < from){
        this.toDate = '';
      }
    }

    return true;
  }

  validatePrice(): boolean {

    if (this.priceMinValue > this.priceMaxValue) {
      this.priceError = 'Min price cannot be greater than max price';
      return false;
    }

    this.priceError = '';
    return true;
  }

  applyFilter(): void {

    if (!this.validateDates() || !this.validatePrice()) {
      return;
    }

    this.page = 1;
    this.isFilterApplied = true;
    this.load();
  }
  
  clearFilters(): void {
    this.searchText = '';
    this.fromDate = '';
    this.toDate = '';
    this.selectedFeatures = [];
    this.dateError = '';
    this.isFilterApplied = false;
    this.noRecordsFound = false;
    this.page = 1;
    this.priceMinValue = 0;
    this.priceMaxValue = 100000;
    this.load();
  }

}
