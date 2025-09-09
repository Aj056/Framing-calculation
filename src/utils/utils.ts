import { MaterialCost, materialCostConstant, salesConstantType, salesLineItem } from "../components/main/main";

export function calculateMaterialCost(qty: number, material: materialCostConstant): MaterialCost {
  return {
    ...material, 
    particular:material.label,
    qty:qty, 
    amount: qty * material.price, 
  };
}


export function calculateSalesData(lineItem: salesConstantType, qty: number, sellingPrice: number):salesLineItem {
  const totalOriginalCost = lineItem?.originalCost * qty;
  const average = (sellingPrice + lineItem.originalCost) / 2;
  const totalProfit = (sellingPrice - lineItem.originalCost) * qty;
  return { size: lineItem?.label, originalCost: lineItem.originalCost, sellingPrice, qty , totalOriginalCost, average, totalProfit };
}

