import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html'
})
export class AddUpdateProductComponent implements OnInit {

  isEditMode = false;

  featureDropdownList: any[] = [];
  featureSelectedItems: any[] = [];
  featureDropdownSettings!: IDropdownSettings;

  colorList = [
    { id: 1, name: 'Red' },
    { id: 2, name: 'Blue' },
    { id: 3, name: 'Green' },
    { id: 4, name: 'Black' },
    { id: 5, name: 'White' }
  ];

  selectedColorIds: number[] = [];
  
  formData = {
    productId: 0,
    productName: '',
    productPrice: 0,
    features: '',
    purchaseDate: '',
    description: '',
    colorIds: [] as number[],
    size: '',
    selectedFile: null as File | null,
    imagePreview: ''
  };

  constructor(private route: ActivatedRoute,
    private router: Router, private service: ProductService) {}

  ngOnInit(): void {
    this.featureDropdownRender();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.load(+id);
    }
  }

  load(id: number): void {
    this.service.getById(id).subscribe(res => {

    this.formData = {
      ...this.formData,
      ...res,
      selectedFile: null,         
      imagePreview: res.imagePath
      ? 'https://localhost:7068' + res.imagePath
      : ''   
    };

    if (res.purchaseDate) {
      this.formData.purchaseDate =
        res.purchaseDate.split('T')[0];
    }

    this.selectedColorIds = res.colorIds || [];

    const arr = res.features?.split(', ') || [];
    this.featureSelectedItems =
    this.featureDropdownList.filter(f => arr.includes(f.name));
    });
  }

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
      allowSearchFilter: true
    };
  }

  onColorChange(event: any, colorId: number) {
    if (event.target.checked) {
      this.selectedColorIds.push(colorId);
    } else {
      this.selectedColorIds = this.selectedColorIds.filter(id => id !== colorId);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files && event.target.files.length
      ? event.target.files[0]
      : null;

    if (!file) return;

    this.formData.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.formData.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  save(): void {

    const featureNames = this.featureSelectedItems
      .map((f: any) => f.name)
      .join(', ');

    const fd = new FormData();

    fd.append('ProductId', this.formData.productId.toString());
    fd.append('ProductName', this.formData.productName);
    fd.append('ProductPrice', this.formData.productPrice.toString());
    fd.append('Features', featureNames);
    fd.append('PurchaseDate', this.formData.purchaseDate);
    fd.append('Description', this.formData.description);
    fd.append('Size', this.formData.size);

    this.selectedColorIds.forEach(id => {
      fd.append('ColorIds', id.toString());
    });

    if (this.formData.selectedFile) {
      fd.append('Image', this.formData.selectedFile);
    }

    const apiCall = this.isEditMode
      ? this.service.update(this.formData.productId, fd)
      : this.service.create(fd);

    apiCall.subscribe({
      next: () => {
        this.router.navigate(['/crafted/pages/product/product-list']);
        this.reset();
      },
      error: err => console.error(err)
    });
  }

  cancel(): void {
    this.router.navigate(['/crafted/pages/product/product-list']);
  }

  reset(): void {
    this.formData = {
      productId: 0,
      productName: '',
      productPrice: 0,
      features: '',
      purchaseDate: '',
      description: '',
      colorIds: [],
      size: '',
      selectedFile: this.formData.selectedFile,
      imagePreview: ''
    };
    this.featureSelectedItems = [];
    this.selectedColorIds = [];
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }

}
