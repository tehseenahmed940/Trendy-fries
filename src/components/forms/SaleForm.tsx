import { useState, type FormEvent } from 'react';
import FormActions from '@/components/forms/FormActions';
import type { SaleInput } from '@/hooks/useRestaurantData';
import { inputClass, labelClass } from '@/lib/styles';
import { formatPKR } from '@/lib/utils';
import type { Product, Sale } from '@/types';

interface SaleFormProps {
  initial: Sale | null;
  products: Product[];
  defaultDate: string;
  onSave: (input: SaleInput) => void;
  onCancel: () => void;
}

export default function SaleForm({ initial, products, defaultDate, onSave, onCancel }: SaleFormProps) {
  const [date, setDate] = useState(initial?.date ?? defaultDate);
  const [productId, setProductId] = useState(
    initial && products.some((product) => product.id === initial.productId) ? initial.productId : '',
  );
  const [quantity, setQuantity] = useState(initial ? String(initial.quantity) : '1');
  const [error, setError] = useState('');

  const selectedProduct = products.find((product) => product.id === productId);
  const quantityValue = Number(quantity);
  const previewTotal = selectedProduct && quantityValue > 0 ? selectedProduct.price * quantityValue : 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date) {
      setError('Please choose a date.');
      return;
    }
    if (!selectedProduct) {
      setError('Please choose a product.');
      return;
    }
    if (!Number.isInteger(quantityValue) || quantityValue < 1) {
      setError('Quantity must be a whole number of 1 or more.');
      return;
    }
    onSave({ date, product: selectedProduct, quantity: quantityValue });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="sale-date">
          Date
        </label>
        <input
          id="sale-date"
          type="date"
          className={inputClass}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="sale-product">
          Product
        </label>
        <select
          id="sale-product"
          className={inputClass}
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} ({formatPKR(product.price)})
            </option>
          ))}
        </select>
        {products.length === 0 && (
          <p className="mt-1.5 text-xs text-zinc-500">Add a product first from the Products page.</p>
        )}
      </div>
      <div>
        <label className={labelClass} htmlFor="sale-quantity">
          Quantity
        </label>
        <input
          id="sale-quantity"
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          className={inputClass}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </div>
      <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3">
        <span className="text-sm font-medium text-zinc-700">Total amount</span>
        <span className="text-lg font-bold text-orange-600">{formatPKR(previewTotal)}</span>
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <FormActions submitLabel={initial ? 'Save changes' : 'Record sale'} onCancel={onCancel} />
    </form>
  );
}
