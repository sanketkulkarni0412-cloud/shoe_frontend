const getApiUrl = () => {
    // In development, fallback to localhost if env var is missing
    if (process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';
    }
    // In production, force env var existence
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
        throw new Error('NEXT_PUBLIC_API_URL is missing in production environment');
    }
    return url;
};

export const API_URL = getApiUrl();

export async function getProducts(category?: string, sale?: boolean, search?: string) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (sale) params.append('sale', 'true');
    if (search) params.append('search', search);

    try {
        const res = await fetch(`${API_URL}/products?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    } catch (error) {
        console.error("API Error in getProducts:", error);
        console.error("Attempted URL:", `${API_URL}/products?${params.toString()}`);
        return [];
    }
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

// --- Admin Functions ---

export async function adminLogin(credentials: Record<string, string>) {
    const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    return data;
}

export async function getAdminStats() {
    const res = await fetch(`${API_URL}/admin/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
}

export async function getAdminOrders() {
    const res = await fetch(`${API_URL}/admin/orders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
}

export async function updateOrderStatus(id: string, status: string) {
    const res = await fetch(`${API_URL}/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order');
    return res.json();
}

export async function getAdminUsers() {
    const res = await fetch(`${API_URL}/admin/users`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export async function addProduct(product: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
}

export async function deleteProduct(id: number) {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
}
// --- Reviews Functions ---

export async function getProductReviews(productId: string) {
    const res = await fetch(`${API_URL}/reviews/product/${productId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
}

export async function addProductReview(review: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('Failed to add review');
    return res.json();
}

export async function getAdminReviews() {
    const res = await fetch(`${API_URL}/reviews/admin/all`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch admin reviews');
    return res.json();
}

export async function updateReviewStatus(id: string, status: string) {
    const res = await fetch(`${API_URL}/reviews/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update review status');
    return res.json();
}
