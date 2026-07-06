import { computed, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CartItem } from '../domain/model/cart-item.entity';
import { CatalogApi } from '../../catalog/infrastructure/catalog-api';
import { Product } from '../../catalog/domain/model/product.entity';

const STORAGE_KEY = 'routestock_cart';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly itemsSignal = signal<CartItem[]>(this.restoreCart());
  readonly items = this.itemsSignal.asReadonly();

  readonly itemCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));

  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.subtotal, 0));

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  private readonly checkingOutSignal = signal<boolean>(false);
  readonly checkingOut = this.checkingOutSignal.asReadonly();

  constructor(private readonly catalogApi: CatalogApi) {}

  addProduct(product: Product, quantity: number = 1): void {
    this.errorSignal.set(null);

    if (product.stock <= 0) {
      this.errorSignal.set(`"${product.name}" no tiene stock disponible.`);
      return;
    }

    const current = this.itemsSignal();
    const existing = current.find((i) => i.productId === product.id);

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (newQuantity > product.stock) {
        this.errorSignal.set(
          `Solo hay ${product.stock} unidades disponibles de "${product.name}".`,
        );
        return;
      }
      this.updateItems(
        current.map((i) =>
          i.productId === product.id
            ? new CartItem({ ...this.toProps(i), quantity: newQuantity })
            : i,
        ),
      );
    } else {
      if (quantity > product.stock) {
        this.errorSignal.set(
          `Solo hay ${product.stock} unidades disponibles de "${product.name}".`,
        );
        return;
      }
      const newItem = new CartItem({
        productId: product.id,
        commerceId: product.commerceId,
        name: product.name,
        price: product.price,
        quantity,
        maxStock: product.stock,
      });
      this.updateItems([...current, newItem]);
    }
  }

  increaseQuantity(productId: number): void {
    const current = this.itemsSignal();
    const item = current.find((i) => i.productId === productId);
    if (!item) return;

    if (!item.canIncrease()) {
      this.errorSignal.set(`Solo hay ${item.maxStock} unidades disponibles de "${item.name}".`);
      return;
    }
    this.errorSignal.set(null);
    this.updateItems(
      current.map((i) =>
        i.productId === productId
          ? new CartItem({ ...this.toProps(i), quantity: i.quantity + 1 })
          : i,
      ),
    );
  }

  decreaseQuantity(productId: number): void {
    const current = this.itemsSignal();
    const item = current.find((i) => i.productId === productId);
    if (!item) return;

    if (item.quantity <= 1) {
      this.removeItem(productId);
      return;
    }
    this.updateItems(
      current.map((i) =>
        i.productId === productId
          ? new CartItem({ ...this.toProps(i), quantity: i.quantity - 1 })
          : i,
      ),
    );
  }

  removeItem(productId: number): void {
    this.updateItems(this.itemsSignal().filter((i) => i.productId !== productId));
  }

  clearCart(): void {
    this.updateItems([]);
  }

  /**
   * Confirma la compra: valida y descuenta el stock real de cada producto en el
   * backend. El stock se resuelve por id directamente del backend (GET /products/{id})
   * y no del catálogo en memoria, que es un caché volátil compartido entre vistas.
   */
  checkout(onSuccess: () => void): void {
    const items = this.itemsSignal();
    if (items.length === 0) return;

    this.checkingOutSignal.set(true);
    this.errorSignal.set(null);

    forkJoin(items.map((item) => this.catalogApi.getProduct(item.productId))).subscribe({
      next: (products) => {
        // Validar contra el stock actual del backend antes de descontar.
        const overSold = items.find((item, i) => item.quantity > products[i].stock);
        if (overSold) {
          this.errorSignal.set(
            `El stock de "${overSold.name}" cambió. Por favor revisa tu carrito.`,
          );
          this.checkingOutSignal.set(false);
          return;
        }

        const updates = items.map((item, i) => {
          const p = products[i];
          const updated = new Product({
            id: p.id,
            commerceId: p.commerceId,
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock - item.quantity,
            imageUrl: p.imageUrl,
          });
          return this.catalogApi.updateProduct(updated);
        });

        forkJoin(updates).subscribe({
          next: () => {
            this.checkingOutSignal.set(false);
            this.clearCart();
            onSuccess();
          },
          error: () => {
            this.errorSignal.set('No se pudo completar la compra. Intenta de nuevo.');
            this.checkingOutSignal.set(false);
          },
        });
      },
      error: () => {
        this.errorSignal.set('No se pudo verificar el stock. Intenta de nuevo.');
        this.checkingOutSignal.set(false);
      },
    });
  }

  private updateItems(items: CartItem[]): void {
    this.itemsSignal.set(items);
    this.persistCart(items);
  }

  private toProps(item: CartItem) {
    return {
      productId: item.productId,
      commerceId: item.commerceId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      maxStock: item.maxStock,
    };
  }

  private restoreCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: ReturnType<CartStore['toProps']>[] = JSON.parse(raw);
      return parsed.map((p) => new CartItem(p));
    } catch {
      return [];
    }
  }

  private persistCart(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map((i) => this.toProps(i))));
    } catch {
      // localStorage no disponible — el carrito no persistirá entre recargas
    }
  }
}
