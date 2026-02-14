"use client";

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWallet } from '@/context/WalletContext';
import { API_URL } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, Wallet, CreditCard, Lock, Smartphone, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const { wallet, refreshWallet, payWithWallet } = useWallet();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Shipping State
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'Razorpay', 'Wallet', 'Card'
    const [useWalletBalance, setUseWalletBalance] = useState(false);

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Validation State
    const [errors, setErrors] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '' });

    // Refs for auto-focus
    const expiryRef = useRef<HTMLInputElement>(null);
    const cvvRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    // UPI State
    const [savedUpiIds, setSavedUpiIds] = useState<{ id: string, vpa: string, app: string }[]>([]);
    const [selectedUpiId, setSelectedUpiId] = useState('');
    const [newUpiId, setNewUpiId] = useState('');
    const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('mockSavedUpiIds');
        if (saved) {
            setSavedUpiIds(JSON.parse(saved));
        }
    }, []);

    const saveUpiToStorage = (upis: any[]) => {
        localStorage.setItem('mockSavedUpiIds', JSON.stringify(upis));
    };

    const getUpiApp = (vpa: string) => {
        if (vpa.includes('@oksbi') || vpa.includes('@okaxis')) return 'GPay';
        if (vpa.includes('@ybl') || vpa.includes('@ibl')) return 'PhonePe';
        if (vpa.includes('@paytm')) return 'Paytm';
        return 'UPI App';
    };

    const handleVerifyUpi = async () => {
        if (!newUpiId.includes('@')) {
            alert("Please enter a valid UPI ID (e.g., user@upi)");
            return;
        }
        setIsVerifyingUpi(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Mock verify
        setIsVerifyingUpi(false);

        const newUpi = {
            id: Date.now().toString(),
            vpa: newUpiId,
            app: getUpiApp(newUpiId)
        };
        const updated = [...savedUpiIds, newUpi];
        setSavedUpiIds(updated);
        saveUpiToStorage(updated);
        setSelectedUpiId(newUpi.vpa);
        setNewUpiId('');
    };

    const handleDeleteUpi = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = savedUpiIds.filter(u => u.id !== id);
        setSavedUpiIds(updated);
        saveUpiToStorage(updated);
        if (selectedUpiId === savedUpiIds.find(u => u.id === id)?.vpa) {
            setSelectedUpiId('');
        }
    };

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/checkout');
        } else if (user) {
            refreshWallet();
        }
    }, [user, authLoading, router]);

    // Card Input Handlers
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length <= 16) {
            setCardNumber(val);
            if (val.length >= 13) setErrors(prev => ({ ...prev, cardNumber: '' }));
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-digits

        // Auto-slash logic
        if (val.length >= 2) {
            const month = parseInt(val.substring(0, 2));
            if (month > 12) val = '12' + val.substring(2); // Clamp month to 12
            if (month === 0) val = '01' + val.substring(2);
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }

        if (val.length <= 5) {
            setExpiry(val);
            if (val.length === 5) setErrors(prev => ({ ...prev, expiry: '' }));
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 3) {
            setCvv(val);
            if (val.length === 3) setErrors(prev => ({ ...prev, cvv: '' }));
        }
    };

    const validateCard = () => {
        const newErrors = { cardNumber: '', expiry: '', cvv: '', cardName: '' };
        let isValid = true;

        if (cardNumber.length < 13 || cardNumber.length > 16) {
            newErrors.cardNumber = 'Card number must be 13-16 digits';
            isValid = false;
        }

        if (expiry.length !== 5) {
            newErrors.expiry = 'Invalid date (MM/YY)';
            isValid = false;
        } else {
            const [mm, yy] = expiry.split('/').map(Number);
            const now = new Date();
            const currentYear = parseInt(now.getFullYear().toString().slice(-2));
            const currentMonth = now.getMonth() + 1;

            if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
                newErrors.expiry = 'Card expired';
                isValid = false;
            }
        }

        if (cvv.length !== 3) {
            newErrors.cvv = 'CVV must be 3 digits';
            isValid = false;
        }

        if (!cardName.trim()) {
            newErrors.cardName = 'Name is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponMessage(null);

        try {
            const res = await fetch(`${API_URL}/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, cartTotal: totalPrice }),
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setDiscount(data.discountAmount);
                setCouponMessage({ type: 'success', text: `Coupon Applied: ₹${data.discountAmount} Off` });
            } else {
                setDiscount(0);
                setCouponMessage({ type: 'error', text: data.message || 'Invalid coupon' });
            }
        } catch (err) {
            setCouponMessage({ type: 'error', text: 'Failed to validate coupon' });
        }
    };

    if (authLoading || !user) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
                <Link href="/products" className="bg-primary hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
                    Return to Shop
                </Link>
            </div>
        );
    }

    // Calculations
    const cartTotalAfterDiscount = totalPrice - discount;
    const walletBalance = wallet?.balance || 0;

    // Amount to be deducted from wallet if selected
    const walletDeduction = useWalletBalance ? Math.min(walletBalance, cartTotalAfterDiscount) : 0;

    // Remaining amount to pay via other methods
    const remainingToPay = Math.max(0, cartTotalAfterDiscount - walletDeduction);

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const isCard = paymentMethod === 'Card';

        // Enhanced Card Validation
        if (remainingToPay > 0 && isCard) {
            if (!validateCard()) {
                setIsLoading(false);
                return;
            }
        }

        // UPI Validation
        if (remainingToPay > 0 && paymentMethod === 'UPI' && !selectedUpiId) {
            alert("Please select or add a verified UPI ID");
            setIsLoading(false);
            return;
        }

        // 1. Payment Processing Simulation
        if (remainingToPay > 0) {
            if (paymentMethod === 'Razorpay') {
                const confirmed = window.confirm(`Redirecting to Razorpay... \n\nAmount: ₹${remainingToPay.toLocaleString('en-IN')}\n\nClick OK to simulate successful payment.`);
                if (!confirmed) { setIsLoading(false); return; }
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else if (isCard) {
                // Mock Card Processing
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate bank delay
            } else if (paymentMethod === 'UPI') {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Mock UPI delay
            }
        }

        // 2. Prepare order details
        const orderDetails = cart.map(item => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            quantity: item.quantity,
            price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price,
            image: item.image,
            size: item.size
        }));

        try {
            // 3. Create Order
            let finalPaymentMethod = remainingToPay === 0 ? 'Wallet' : paymentMethod;
            if (remainingToPay > 0) {
                if (paymentMethod === 'UPI') finalPaymentMethod = `UPI (${selectedUpiId})`;
                if (useWalletBalance) finalPaymentMethod = `Wallet + ${finalPaymentMethod}`;
            } else if (useWalletBalance) {
                finalPaymentMethod = 'Wallet';
            }

            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid, // Start sending userId
                    email,
                    customerName: `${firstName} ${lastName}`,
                    address: `${address}, ${city}, ${state} ${zip}`,
                    orderDetails,
                    paymentMethod: finalPaymentMethod,
                    total: cartTotalAfterDiscount,
                    paidAmount: remainingToPay,
                    walletUsed: walletDeduction,
                    originalTotal: totalPrice,
                    couponCode: discount > 0 ? couponCode : null,
                    discountAmount: discount
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create order");
            }
            const orderData = await res.json();

            // 4. Deduct from Wallet if used (NOW HANDLED BY BACKEND, but keeping frontend sync method if context needs update)
            // Ideally backend handles it transactionally. We just refresh context.
            await refreshWallet();

            // 5. Send Email
            fetch(`${API_URL}/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    orderDetails,
                    total: cartTotalAfterDiscount.toLocaleString('en-IN')
                }),
            }).catch(err => console.error("Email failed", err));

            // Success
            clearCart();
            router.push(`/checkout/success?orderId=${orderData.id}`);

        } catch (error: any) {
            console.error('Order Failed:', error);
            alert(`Failed to place order: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-black text-black dark:text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                </Link>

                <h1 className="text-4xl font-bold uppercase tracking-wider mb-8">Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Shipping Form */}
                    <div className="flex-grow">
                        <form onSubmit={handleSubmit} className="bg-secondary dark:bg-secondary p-8 rounded-lg border border-border dark:border-white/5 space-y-6">
                            <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-500 dark:text-gray-400 mb-2">First Name</label>
                                    <input required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 dark:text-gray-400 mb-2">Last Name</label>
                                    <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-500 dark:text-gray-400 mb-2">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 dark:text-gray-400 mb-2">Address</label>
                                <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-gray-500 dark:text-gray-400 mb-2">City</label>
                                    <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 dark:text-gray-400 mb-2">State</label>
                                    <input required type="text" value={state} onChange={e => setState(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 dark:text-gray-400 mb-2">ZIP Code</label>
                                    <input required type="text" value={zip} onChange={e => setZip(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-3 focus:border-primary focus:outline-none transition-colors text-black dark:text-white" />
                                </div>
                            </div>

                            {/* Wallet Section */}
                            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-primary" /> Wallet
                                </h3>
                                <div className="bg-white dark:bg-black/30 p-4 rounded-lg border border-gray-200 dark:border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-black dark:text-white">Use Wallet Balance</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Available: ₹{walletBalance.toLocaleString('en-IN')}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={useWalletBalance}
                                            onChange={(e) => setUseWalletBalance(e.target.checked)}
                                            disabled={walletBalance <= 0}
                                        />
                                        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                {useWalletBalance && walletDeduction > 0 && (
                                    <p className="text-green-600 dark:text-green-500 text-sm mt-2">
                                        ₹{walletDeduction.toLocaleString('en-IN')} will be deducted from your wallet.
                                    </p>
                                )}
                            </div>

                            {/* Payment Method Section (Only if remaining > 0) */}
                            {remainingToPay > 0 && (
                                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                    <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                                    <div className="space-y-3">
                                        {/* COD Option */}
                                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 hover:bg-gray-50 dark:hover:bg-black/50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="COD"
                                                checked={paymentMethod === 'COD'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-primary focus:ring-primary"
                                            />
                                            <span className="ml-3 font-bold text-black dark:text-white">Cash on Delivery (COD)</span>
                                        </label>

                                        {/* Razorpay Option */}
                                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'Razorpay' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 hover:bg-gray-50 dark:hover:bg-black/50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="Razorpay"
                                                checked={paymentMethod === 'Razorpay'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="ml-3 font-bold text-black dark:text-white">Pay with Razorpay</span>
                                            <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-1 rounded">SECURE</span>
                                        </label>

                                        {/* UPI Option */}
                                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-orange-500 bg-orange-500/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 hover:bg-gray-50 dark:hover:bg-black/50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="UPI"
                                                checked={paymentMethod === 'UPI'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-orange-500 focus:ring-orange-500"
                                            />
                                            <div className="ml-3 flex-1">
                                                <span className="font-bold block text-black dark:text-white">UPI (GPay, PhonePe, Paytm)</span>
                                            </div>
                                            <Smartphone className="w-5 h-5 text-orange-500" />
                                        </label>

                                        {/* UPI Section */}
                                        {paymentMethod === 'UPI' && (
                                            <div className="p-4 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
                                                {savedUpiIds.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Saved UPI IDs</p>
                                                        {savedUpiIds.map((upi) => (
                                                            <div
                                                                key={upi.id}
                                                                onClick={() => setSelectedUpiId(upi.vpa)}
                                                                className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${selectedUpiId === upi.vpa ? 'border-orange-500 bg-orange-500/10' : 'border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                                                                        ${upi.app === 'GPay' ? 'bg-blue-500' :
                                                                            upi.app === 'PhonePe' ? 'bg-purple-600' :
                                                                                upi.app === 'Paytm' ? 'bg-cyan-500' : 'bg-orange-500'}`}>
                                                                        {upi.app[0]}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-mono text-black dark:text-white">{upi.vpa.replace(/(.{2}).+(@.+)/, '$1***$2')}</p>
                                                                        <p className="text-xs text-gray-500">{upi.app}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => handleDeleteUpi(upi.id, e)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="pt-2">
                                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Add New UPI ID</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="example@oksbi"
                                                            value={newUpiId}
                                                            onChange={(e) => setNewUpiId(e.target.value)}
                                                            className="flex-grow bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-sm focus:border-orange-500 focus:outline-none text-black dark:text-white"
                                                        />
                                                        <button
                                                            onClick={handleVerifyUpi}
                                                            disabled={!newUpiId || isVerifyingUpi}
                                                            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded text-sm font-bold transition-colors"
                                                        >
                                                            {isVerifyingUpi ? 'Verifying...' : 'Verify'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Credit/Debit Card Option */}
                                        <label className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-black/30 hover:bg-gray-50 dark:hover:bg-black/50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="Card"
                                                checked={paymentMethod === 'Card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                                            />
                                            <div className="ml-3 flex-1">
                                                <span className="font-bold block text-black dark:text-white">Credit / Debit Card</span>
                                                <div className="flex gap-2 mt-1">
                                                    <div className="w-8 h-5 bg-gray-200 dark:bg-white/20 rounded"></div>
                                                    <div className="w-8 h-5 bg-gray-200 dark:bg-white/20 rounded"></div>
                                                    <div className="w-8 h-5 bg-gray-200 dark:bg-white/20 rounded"></div>
                                                </div>
                                            </div>
                                        </label>

                                        {/* Card Input Form */}
                                        {paymentMethod === 'Card' && (
                                            <div className="p-4 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                                    <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure Payment (Mock)</span>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Card Number (13-16 Digits)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            placeholder="0000 0000 0000 0000"
                                                            maxLength={16}
                                                            value={cardNumber}
                                                            onChange={handleCardNumberChange}
                                                            className={`w-full bg-white dark:bg-black/50 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded p-2 pl-10 focus:border-purple-500 focus:outline-none font-mono transition-colors text-black dark:text-white`}
                                                        />
                                                        <CreditCard className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    </div>
                                                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Expiry Date (MM/YY)</label>
                                                        <input
                                                            ref={expiryRef}
                                                            type="text"
                                                            placeholder="MM/YY"
                                                            maxLength={5}
                                                            value={expiry}
                                                            onChange={handleExpiryChange}
                                                            className={`w-full bg-white dark:bg-black/50 border ${errors.expiry ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded p-2 focus:border-purple-500 focus:outline-none transition-colors text-black dark:text-white`}
                                                        />
                                                        {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">CVV</label>
                                                        <input
                                                            ref={cvvRef}
                                                            type="password"
                                                            placeholder="123"
                                                            maxLength={3}
                                                            value={cvv}
                                                            onChange={handleCvvChange}
                                                            className={`w-full bg-white dark:bg-black/50 border ${errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded p-2 focus:border-purple-500 focus:outline-none transition-colors text-black dark:text-white`}
                                                        />
                                                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Cardholder Name</label>
                                                    <input
                                                        ref={nameRef}
                                                        type="text"
                                                        placeholder="Name on Card"
                                                        value={cardName}
                                                        onChange={(e) => {
                                                            setCardName(e.target.value);
                                                            if (e.target.value.trim()) setErrors(prev => ({ ...prev, cardName: '' }));
                                                        }}
                                                        className={`w-full bg-white dark:bg-black/50 border ${errors.cardName ? 'border-red-500' : 'border-gray-300 dark:border-white/10'} rounded p-2 focus:border-purple-500 focus:outline-none uppercase transition-colors text-black dark:text-white`}
                                                    />
                                                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 rounded font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed ${paymentMethod === 'Razorpay' && remainingToPay > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-primary-hover'
                                    } text-white`}
                            >
                                {isLoading ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        {remainingToPay === 0
                                            ? 'Place Order (Paid via Wallet)'
                                            : paymentMethod === 'Razorpay' ? `Pay ₹${remainingToPay}` : 'Place Order'}
                                        <CheckCircle className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-secondary dark:bg-secondary p-6 rounded-lg border border-border dark:border-white/5 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-black dark:text-white">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-4 text-sm">
                                        <div>
                                            <p className="font-bold text-black dark:text-white">{item.name}</p>
                                            <p className="text-gray-500 dark:text-gray-400">{item.brand} {item.size && `(Size ${item.size})`}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-black dark:text-white">₹{((item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />

                            {/* Coupon Input */}
                            <div className="mb-6">
                                <label className="block text-gray-500 dark:text-gray-400 mb-2 text-sm">Coupon Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter code"
                                        className="flex-grow bg-white dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded p-2 text-sm focus:border-primary focus:outline-none uppercase text-black dark:text-white"
                                        disabled={discount > 0}
                                    />
                                    <Button
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode || discount > 0}
                                        className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-black dark:text-white px-4 py-2 text-sm"
                                    >
                                        {discount > 0 ? 'Applied' : 'Apply'}
                                    </Button>
                                </div>
                                {couponMessage && (
                                    <p className={`text-xs mt-2 ${couponMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {couponMessage.text}
                                    </p>
                                )}
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-black dark:text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-500">
                                        <span>Discount</span>
                                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                {useWalletBalance && walletDeduction > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-500">
                                        <span>Wallet</span>
                                        <span>-₹{walletDeduction.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-black dark:text-white">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold mt-4">
                                    <span className="text-black dark:text-white">Total Payable</span>
                                    <span className="text-primary">₹{remainingToPay.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
