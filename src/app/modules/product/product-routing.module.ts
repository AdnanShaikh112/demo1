import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { AddUpdateProductComponent } from './add-update-product/add-update-product.component';
import { ProductComponent } from './product.component';
import { FilterProductComponent } from './filter-product/filter-product.component';


const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: 'product-list',
        component: FilterProductComponent,
      },
      {
        path: 'add-update-product/add',
        component: AddUpdateProductComponent,
      },
      {
        path: 'add-update-product/edit/:id',
        component: AddUpdateProductComponent,
      },
      { path: '', redirectTo: 'product-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'product-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
