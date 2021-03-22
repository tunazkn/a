import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { Car } from 'src/app/models/car';
import { faLiraSign } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../environments/environment';
import { RentalService } from '../../services/rental.service';
import { Rental } from '../../models/rental';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css'],
})
export class CarComponent implements OnInit {
  cars: Car[] = [];
  apiUrl = environment.baseUrl;
  dataLoaded = false;
  faLira = faLiraSign;
  filterText = '';
  rentalDetail: Rental[];

  constructor(
    private carService: CarService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private cartService: CartService,
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['brandId'] && params['colorId'])
        this.getCarByBrandAndColor(params['brandId'], params['colorId']);
      else if (params['brandId']) this.getCarsByBrand(params['brandId']);
      else if (params['colorId']) this.getCarsByColor(params['colorId']);
      else this.getCars();
    })
  }
  getCarByBrandAndColor(brandId: number, colorId: number) {
    this.carService
      .getCarByBrandAndColor(brandId, colorId)
      .subscribe((response) => {
        this.cars = response.data;
        this.dataLoaded = true;
      });
  }

  changeFilterTextSize(filterText:string){
    this.filterText = filterText.toLocaleLowerCase();
  }

  getCars(){
    this.carService.getCars().subscribe((response)=>{
      this.cars = response.data;
      this.dataLoaded = true;
    })
  }

  getCarsByBrand(brandId:number) {
    this.carService.getCarsByBrand(brandId).subscribe(response=>{
      this.cars = response.data
      this.dataLoaded = true;
    })
  }
  getCarsByColor(colorId:number) {
    this.carService.getCarsByColor(colorId).subscribe(response=>{
      this.cars = response.data
      this.dataLoaded = true;
    })
  }

  addToCart(car:Car){
    this.rentalService.getRentalByCarId(car.carId).subscribe(response => {
      this.rentalDetail = response.data;
    });
    if (this.cartService.list().length > 0) {
      this.router.navigate(['/cart'])
    }
    this.cartService.addToCart(car);
    this.router.navigate(['/cart'])
  }
}

/*
  getCarDetails() {
    this.carService.getCarDetails().subscribe((response) => {
      this.carDetails = response.data;
      this.dataLoaded = true;
    });
  }
  getCarsByBrand(brandId: number) {
    this.carService.getCarsByBrand(brandId).subscribe((response) => {
      this.carDetails = response.data;
      this.dataLoaded = true;
    });
  }
  getCarsByColor(colorId: number) {
    this.carService.getCarsByColor(colorId).subscribe((response) => {
      this.carDetails = response.data;
      this.dataLoaded = true;
    });
  }

  addToCart(carDetail: CarDetailDto) {
    this.toastrService.success(
      'Sepete eklendi',
      carDetail.brandName + ' ' + carDetail.carName
    );
    this.cartService.addToCart(carDetail);
  }
}
*/