import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AddUpdateProductComponent } from './add-update-product/add-update-product.component';
import { ProductRoutingModule } from './product-routing.module';
import {
  CardsModule,
  DropdownMenusModule,
  WidgetsModule,
} from '../../_metronic/partials';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FilterProductComponent } from './filter-product/filter-product.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgbModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    AddUpdateProductComponent,
    FilterProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductRoutingModule,
    InlineSVGModule,
    DropdownMenusModule,
    WidgetsModule,
    CardsModule,
    FlatpickrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxSliderModule,
    NgbModule
  ]
})
export class ProductModule { }
