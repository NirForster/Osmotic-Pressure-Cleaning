export interface CartItem {
  productId: string;
  name: string;
  sku?: string;
  quantity: number;
  previewImage?: string;
}

export interface CheckoutDetails {
  customerName: string;
  customerPhone: string;
  notes?: string;
}
