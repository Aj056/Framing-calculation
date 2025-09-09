import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from "../select/select";
import { materialCost, salesData } from '../../constants/data.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { calculateMaterialCost, calculateSalesData } from '../../utils/utils';
export type MaterialCost = {
  particular: string,
  qty: number,
  price: number,
  amount: number
};
export type materialCostConstant = {
  label: string, price: number
}
export type salesConstantType = {
  label: string, originalCost: number
}
export type salesLineItem = {
  size: string,
  originalCost: number,
  qty: number,
  sellingPrice: number,
  totalOriginalCost: number,
  average: number,
  totalProfit: number
}
@Component({
  selector: 'app-main',
  imports: [ReactiveFormsModule, Select],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  private destroyRef = inject(DestroyRef);
  
  //MaterialCost
  calculatedMaterialCost = signal<MaterialCost | undefined>(undefined);
  materialName = new FormControl<materialCostConstant | undefined>(undefined);
  materialQty = new FormControl<number>(0);
  materialConstant: materialCostConstant[] = materialCost;

  //SalesData
  salesQty = new FormControl<number>(0);
  salesSellingPrice = new FormControl<number>(0);
  salesDropDown = new FormControl<salesConstantType | undefined>(undefined);
  salesConstant: salesConstantType[] = salesData;
  salesUserSelectedLineItem = signal<salesLineItem | undefined>(undefined);


  ngOnInit() {
    this.materialCostSubscriptions();
    this.salesDataSubscriptions();
  }

  //SalesData
  salesDataSubscriptions() {
    [this.salesSellingPrice, this.salesDropDown, this.salesQty].map((item: FormControl) => {
      item.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.calculateSalesData();
        }
      });
    });
  }
  calculateSalesData() {
    if (this.salesSellingPrice.value && this.salesDropDown.value && this.salesQty.value)
      this.salesUserSelectedLineItem.set(calculateSalesData(this.salesDropDown.value, this.salesQty.value, this.salesSellingPrice.value))
  }

  //MaterialCost
  materialCostSubscriptions() {
    [this.materialQty, this.materialName].map((item: FormControl) => {
      item.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.calculateMaterialCost();
        }
      });
    });
  }
  calculateMaterialCost() {
    if (this.materialQty.value && this.materialName.value)
      this.calculatedMaterialCost.set(calculateMaterialCost(this.materialQty.value, this.materialName.value))
  }
}
