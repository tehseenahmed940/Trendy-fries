import { useState } from 'react';
import { Package, Pencil, Plus, Trash2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/forms/ProductForm';
import type { ProductInput } from '@/hooks/useRestaurantData';
import { cardClass, iconButtonClass, primaryButtonClass } from '@/lib/styles';
import { formatPKR } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductsPageProps {
  products: Product[];
  onSave: (id: string | null, input: ProductInput) => void;
  onDelete: (id: string) => void;
}

export default function ProductsPage({ products, onSave, onDelete }: ProductsPageProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = (input: ProductInput) => {
    onSave(editing?.id ?? null, input);
    closeForm();
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Delete ${product.name}? Past sales will keep their record.`)) {
      onDelete(product.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Products</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage the items on your menu and their prices.</p>
        </div>
        <button type="button" onClick={openNew} className={primaryButtonClass}>
          <Plus size={18} />
          Add product
        </button>
      </div>

      {products.length === 0 ? (
        <div className={cardClass}>
          <EmptyState
            icon={Package}
            title="No products yet"
            message="Add your menu items so you can record sales quickly."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`${cardClass} group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Package size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-zinc-900">{product.name}</p>
                <p className="text-sm font-medium text-orange-600">{formatPKR(product.price)}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => openEdit(product)} className={iconButtonClass} aria-label={`Edit ${product.name}`}>
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => handleDelete(product)} className={`${iconButtonClass} hover:text-red-600`} aria-label={`Delete ${product.name}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? 'Edit product' : 'Add product'} onClose={closeForm}>
          <ProductForm key={editing?.id ?? 'new'} initial={editing} onSave={handleSave} onCancel={closeForm} />
        </Modal>
      )}
    </div>
  );
}
