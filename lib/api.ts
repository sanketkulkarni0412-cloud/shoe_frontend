const API_URL = 'http://localhost:5000/api';

export async function getProducts(category?: string, sale?: boolean) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (sale) params.append('sale', 'true');

    const res = await fetch(`${API_URL}/products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function getCategories() {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function getProduct(id: string) {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}
