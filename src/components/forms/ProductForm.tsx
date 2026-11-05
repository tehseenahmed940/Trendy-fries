import { useState, type FormEvent } from 'react';
import FormActions from '@/components/forms/FormActions';
import { inputClass, labelClass } from '@/lib/styles';
import type { ProductInput } from '@/hooks/useRestaurantData';
import type { Product } from '@/types';

interface ProductFormProps {
  initial: Product | null;
  onSave: (input: ProductInput) => void;
  onCancel: () => void;
}

export default function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const priceValue = Number(price);

    if (!trimmedName) {
      setError('Please enter a product name.');
      return;
    }
    if (price === '' || Number.isNaN(priceValue) || priceValue < 0) {
      setError('Please enter a valid price.');
      return;
    }
    onSave({ name: trimmedName, price: priceValue });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="product-name">
          Product name
        </label>
        <input
          id="product-name"
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Cheese Fries"
          autoFocus
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="product-price">
          Price (Rs.)
        </label>
        <input
          id="product-price"
          type="number"
          min="0"
          step="1"
          inputMode="decimal"
          className={inputClass}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="e.g. 250"
        />
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <FormActions submitLabel={initial ? 'Save changes' : 'Add product'} onCancel={onCancel} />
    </form>
  );
}
