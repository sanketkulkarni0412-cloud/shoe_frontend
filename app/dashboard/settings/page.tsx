"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    User, MapPin, CreditCard, ShoppingBag, Bell,
    Shield, Globe, Moon, HelpCircle, FileText,
    LogOut, ChevronRight, Camera, Smartphone, Mail, Edit2, Lock, Plus, Trash2, CheckCircle,
    Boxes, Filter, PackageX, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';
import Image from 'next/image';
import Button from "@/components/ui/Button";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import { getUserOrders, cancelOrder, returnOrder } from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import ReturnModal from "@/components/ReturnModal";
import toast, { Toaster } from "react-hot-toast";

// Types
type Section = 'account' | 'addresses' | 'payments' | 'orders' | 'notifications' | 'privacy' | 'appearance' | 'support' | 'legal';

interface Order {
    id: string;
    customId?: string;
    date: string;
    status: string;
    total: number;
    orderDetails: any[];
}

export default function SettingsPage() {
    const { user, logout, updateUserImage } = useAuth();
    const [activeSection, setActiveSection] = useState<Section>('account');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mock Data for Appearance
    const [darkMode, setDarkMode] = useState(true);
    const [currency, setCurrency] = useState('INR');

    // Menu Items
    const menuItems = [
        { id: 'account', label: 'Account Settings', icon: User },
        { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
        { id: 'payments', label: 'Payment Methods', icon: CreditCard },
        { id: 'orders', label: 'Orders & Returns', icon: ShoppingBag },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'appearance', label: 'Language & Region', icon: Globe },
        // { id: 'appearance', label: 'Appearance', icon: Moon }, // Merged into Lang/Region for cleaner UI
        { id: 'support', label: 'Help & Support', icon: HelpCircle },
        { id: 'legal', label: 'Legal & Policies', icon: FileText },
    ];

    // --- Content Components ---

    const AccountSection = () => {
        const { user, updateUserProfile } = useAuth();
        const [formData, setFormData] = useState({
            name: user?.name || '',
            phone: user?.phone || '',
            dob: user?.dob || ''
        });
        const [loading, setLoading] = useState(false);

        // Update local state when user context loads
        useEffect(() => {
            if (user) {
                setFormData({
                    name: user.name || '',
                    phone: user.phone || '', // assuming phone/dob might be in user obj now
                    dob: user.dob || ''
                });
            }
        }, [user]);

        const handleSaveProfile = async () => {
            try {
                setLoading(true);
                await updateUserProfile(formData);
                alert("Profile updated successfully!"); // Using alert for simplicity, could use toast
            } catch (error) {
                console.error(error);
                alert("Failed to update profile.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
                    <p className="text-gray-400">Manage your personal information and login details.</p>
                </div>

                {/* Profile Card */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
                    <ProfileImageUpload
                        currentImage={user?.image}
                        onImageUpdated={(url) => updateUserImage(url)}
                    />
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-xl font-bold">{user?.name}</h3>
                        <p className="text-gray-400 mb-2">{user?.email}</p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-wider">
                            <CheckCircle className="w-3 h-3" /> Verified Account
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 pl-10 focus:border-primary outline-none"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email Address</label>
                        <div className="relative">
                            <input type="email" defaultValue={user?.email || ''} disabled className="w-full bg-[#111] border border-white/5 rounded-lg p-3 pl-10 text-gray-500 cursor-not-allowed" />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-500 font-bold">VERIFIED</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Phone Number</label>
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 pl-10 focus:border-primary outline-none"
                            />
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Date of Birth</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                    <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-primary hover:bg-red-700 text-white min-w-[120px]"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        );
    };


    const AddressesSection = () => {
        const [showAddForm, setShowAddForm] = useState(false);
        const [editingId, setEditingId] = useState<number | null>(null);
        const [addresses, setAddresses] = useState([
            { id: 1, type: 'Home', name: 'Sanket', street: '123, React Lane', city: 'Mumbai', state: 'Maharashtra', pin: '400001', isDefault: true },
            { id: 2, type: 'Office', name: 'Sanket Work', street: 'Tech Plaza, 5th Floor', city: 'Bangalore', state: 'Karnataka', pin: '560001', isDefault: false },
        ]);

        // Form State
        const [newAddress, setNewAddress] = useState({
            type: 'Home', name: '', street: '', city: '', state: '', pin: '', isDefault: false
        });

        const handleSave = () => {
            if (!newAddress.name || !newAddress.street) return;

            if (editingId) {
                // Update existing
                setAddresses(addresses.map(addr => addr.id === editingId ? { ...newAddress, id: editingId } : addr));
                setEditingId(null);
            } else {
                // Create new
                setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
            }

            setShowAddForm(false);
            resetForm();
        };

        const handleEdit = (addr: any) => {
            setNewAddress(addr);
            setEditingId(addr.id);
            setShowAddForm(true);
        };

        const handleDelete = (id: number) => {
            if (window.confirm('Are you sure you want to delete this address?')) {
                setAddresses(addresses.filter(addr => addr.id !== id));
            }
        };

        const resetForm = () => {
            setNewAddress({ type: 'Home', name: '', street: '', city: '', state: '', pin: '', isDefault: false });
            setEditingId(null);
        };

        if (showAddForm) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => { setShowAddForm(false); resetForm(); }} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ChevronRight className="w-6 h-6 rotate-180" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                            <p className="text-gray-400">Enter your delivery details.</p>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Full Name</label>
                                <input
                                    value={newAddress.name}
                                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Address Type</label>
                                <select
                                    value={newAddress.type}
                                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white"
                                >
                                    <option>Home</option>
                                    <option>Office</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Street Address</label>
                            <textarea
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none h-24 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">City</label>
                                <input
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">State</label>
                                <input
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="space-y-2 col-span-2 md:col-span-1">
                                <label className="text-sm text-gray-400">Pincode</label>
                                <input
                                    value={newAddress.pin}
                                    onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                            <input
                                type="checkbox"
                                id="default"
                                checked={newAddress.isDefault}
                                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-transparent"
                            />
                            <label htmlFor="default" className="text-sm text-gray-300">Set as default address</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>Cancel</Button>
                        <Button onClick={handleSave} className="bg-primary hover:bg-red-700 text-white">Save Address</Button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Saved Addresses</h2>
                        <p className="text-gray-400">Manage your billing and delivery addresses.</p>
                    </div>
                    <Button onClick={() => { setShowAddForm(true); resetForm(); }} className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white">
                        <Plus className="w-4 h-4" /> Add New
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="bg-[#111] border border-white/10 rounded-xl p-6 relative group hover:border-white/30 transition-all">
                            {addr.isDefault && (
                                <span className="absolute top-4 right-4 text-xs font-bold bg-primary text-white px-2 py-1 rounded">DEFAULT</span>
                            )}
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="font-bold uppercase tracking-wider text-sm">{addr.type}</span>
                            </div>
                            <h3 className="font-bold text-lg">{addr.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                                {addr.street}<br />
                                {addr.city}, {addr.state} - {addr.pin}
                            </p>
                            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(addr)}
                                    className="text-sm font-medium text-white hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    <Edit2 className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 ml-auto"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const PaymentsSection = () => {
        const [showAddCard, setShowAddCard] = useState(false);
        const [showAddUPI, setShowAddUPI] = useState(false);

        const [cards, setCards] = useState([
            { id: 1, type: 'VISA', number: '**** **** **** 4242', holder: 'SANKET K', expiry: '12/28' }
        ]);

        const [upis, setupis] = useState([
            { id: 1, id_str: 'sanket@oksbi', verified: true }
        ]);

        // New Card Form State
        const [newCard, setNewCard] = useState({ number: '', holder: '', expiry: '', cvv: '' });
        // New UPI Form State
        const [newUPI, setNewUPI] = useState('');

        const handleAddCard = () => {
            if (!newCard.number || !newCard.holder) return;
            const last4 = newCard.number.slice(-4) || '0000';
            setCards([...cards, {
                id: Date.now(),
                type: 'VISA',
                number: `**** **** **** ${last4}`,
                holder: newCard.holder.toUpperCase(),
                expiry: newCard.expiry
            }]);
            setShowAddCard(false);
            setNewCard({ number: '', holder: '', expiry: '', cvv: '' });
        };

        const handleAddUPI = () => {
            if (!newUPI) return;
            setupis([...upis, { id: Date.now(), id_str: newUPI, verified: true }]);
            setShowAddUPI(false);
            setNewUPI('');
        };

        const handleDeleteCard = (id: number) => {
            if (window.confirm('Remove this card?')) {
                setCards(cards.filter(c => c.id !== id));
            }
        };

        const handleDeleteUPI = (id: number) => {
            if (window.confirm('Remove this UPI ID?')) {
                setupis(upis.filter(u => u.id !== id));
            }
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Payment Methods</h2>
                    <p className="text-gray-400">Securely manage your saved cards and UPI IDs.</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" /> Credit/Debit Cards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cards.map(card => (
                            <div key={card.id} className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="font-bold italic text-white/20 text-xl">{card.type}</span>
                                </div>
                                <div className="mt-8 mb-4">
                                    <p className="font-mono text-xl tracking-widest text-gray-300">{card.number}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Card Holder</p>
                                        <p className="font-medium">{card.holder}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase">Expires</p>
                                        <p className="font-medium">{card.expiry}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="absolute top-4 right-14 p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {showAddCard ? (
                            <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-3 animate-in fade-in zoom-in duration-300">
                                <h4 className="font-bold text-sm">Add New Card</h4>
                                <input
                                    placeholder="Card Number"
                                    maxLength={19}
                                    value={newCard.number}
                                    onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm outline-none focus:border-primary"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        value={newCard.expiry}
                                        onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm outline-none focus:border-primary"
                                    />
                                    <input
                                        placeholder="CVV"
                                        maxLength={3}
                                        type="password"
                                        value={newCard.cvv}
                                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm outline-none focus:border-primary"
                                    />
                                </div>
                                <input
                                    placeholder="Card Holder Name"
                                    value={newCard.holder}
                                    onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-sm outline-none focus:border-primary"
                                />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button onClick={() => setShowAddCard(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                                    <button onClick={handleAddCard} className="text-xs bg-primary text-white px-3 py-1.5 rounded hover:bg-red-700">Save</button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => setShowAddCard(true)}
                                className="border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:text-primary hover:border-primary/50 cursor-pointer transition-all min-h-[180px]"
                            >
                                <Plus className="w-8 h-8 mb-2" />
                                <span className="font-medium">Add New Card</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary" /> Saved UPI IDs
                    </h3>
                    <div className="space-y-3">
                        {upis.map(upi => (
                            <div key={upi.id} className="bg-[#111] border border-white/10 rounded-lg p-4 flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-xs">UPI</div>
                                    <div>
                                        <p className="font-medium">{upi.id_str}</p>
                                        {upi.verified && (
                                            <p className="text-xs text-green-500 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Verified
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteUPI(upi.id)}
                                    className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {showAddUPI ? (
                            <div className="bg-[#111] border border-white/10 rounded-lg p-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <input
                                    placeholder="Enter UPI ID (e.g. name@bank)"
                                    value={newUPI}
                                    onChange={(e) => setNewUPI(e.target.value)}
                                    className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-sm outline-none focus:border-primary"
                                />
                                <button onClick={() => setShowAddUPI(false)} className="px-3 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                                <button onClick={handleAddUPI} className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded text-sm">Verify & Save</button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setShowAddUPI(true)}
                                className="w-full border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40"
                            >
                                + Add New UPI ID
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const NotificationsSection = () => {
        const [preferences, setPreferences] = useState([
            { id: 'orders', title: 'Order Updates', desc: 'Get notified about your order status changes.', enabled: true },
            { id: 'promotions', title: 'Promotions & Offers', desc: 'Receive emails about new sales and exclusive offers.', enabled: false },
            { id: 'security', title: 'Security Alerts', desc: 'Get alerts for suspicious activity on your account.', enabled: true }
        ]);

        const togglePreference = (id: string) => {
            setPreferences(preferences.map(p =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
            ));
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                    <p className="text-gray-400">Choose how we communicate with you.</p>
                </div>
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-6">
                    {preferences.map((item) => (
                        <div key={item.id} className="flex items-center justify-between pb-6 border-b border-white/10 last:border-0 last:pb-0">
                            <div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                            <div
                                onClick={() => togglePreference(item.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const PrivacySection = () => {
        const [privacySettings, setPrivacySettings] = useState([
            { id: '2fa', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', enabled: false },
            { id: 'profile', title: 'Public Profile', desc: 'Allow others to see your reviews and wishlist.', enabled: true },
            { id: 'activity', title: 'Activity Status', desc: 'Show when you are last active.', enabled: true },
        ]);

        const togglePrivacy = (id: string) => {
            setPrivacySettings(privacySettings.map(p =>
                p.id === id ? { ...p, enabled: !p.enabled } : p
            ));
        };

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Privacy & Security</h2>
                    <p className="text-gray-400">Manage your password and security settings.</p>
                </div>

                {/* Toggles */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-6">
                    {privacySettings.map((item) => (
                        <div key={item.id} className="flex items-center justify-between pb-6 border-b border-white/10 last:border-0 last:pb-0">
                            <div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                            <div
                                onClick={() => togglePrivacy(item.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${item.enabled ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Password Form */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Change Password</h3>
                            <p className="text-sm text-gray-400">Update your password to keep your account safe.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <input type="password" placeholder="Current Password" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none" />
                        <input type="password" placeholder="New Password" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none" />
                        <input type="password" placeholder="Confirm New Password" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none" />
                        <Button className="bg-white/10 hover:bg-white/20 text-white w-full">Update Password</Button>
                    </div>
                </div>
            </div>
        );
    };

    const LanguageSection = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">Language & Region</h2>
                <p className="text-gray-400">Customize your language and currency preferences.</p>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Display Language</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Currency</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none text-white">
                        <option>INR - Indian Rupee (₹)</option>
                        <option>USD - US Dollar ($)</option>
                        <option>EUR - Euro (€)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const SupportSection = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">Help & Support</h2>
                <p className="text-gray-400">Get help with your orders and account.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { title: 'Customer Service', icon: HelpCircle, desc: 'Chat with our support team' },
                    { title: 'FAQs', icon: FileText, desc: 'Find answers to common questions' },
                    { title: 'Email Support', icon: Mail, desc: 'support@shoeshop.com' },
                    { title: 'Call Us', icon: Smartphone, desc: '+91 1800-123-4567' }
                ].map((item, i) => (
                    <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer group">
                        <item.icon className="w-8 h-8 text-primary mb-4" />
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const OrdersSection = () => {
        const { user } = useAuth();
        const [orders, setOrders] = useState<Order[]>([]);
        const [loading, setLoading] = useState(true);
        const [filter, setFilter] = useState<'all' | 'open' | 'cancelled'>('all');
        const [modalOpen, setModalOpen] = useState(false);
        const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
        const [modalType, setModalType] = useState<'cancel' | 'return'>('cancel');

        const fetchOrders = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await getUserOrders(user.uid);
                setOrders(data);
            } catch (error) {
                console.error("Failed to load orders:", error);
                toast.error("Could not load your orders");
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchOrders();
        }, [user]);

        const handleAction = (orderId: string, type: 'cancel' | 'return') => {
            setSelectedOrder(orderId);
            setModalType(type);
            setModalOpen(true);
        };

        const handleModalSubmit = async (reason: string) => {
            if (!selectedOrder) return;
            try {
                if (modalType === 'cancel') {
                    await cancelOrder(selectedOrder, reason);
                    toast.success('Order cancelled successfully.');
                } else {
                    await returnOrder(selectedOrder, reason);
                    toast.success('Return requested successfully.');
                }
                fetchOrders();
            } catch (error: any) {
                toast.error(error.message || 'Action failed');
            }
        };

        const filteredOrders = orders.filter(order => {
            if (filter === 'all') return true;
            if (filter === 'open') return ['Processing', 'Shipped', 'Out for Delivery'].includes(order.status);
            if (filter === 'cancelled') return ['Cancelled', 'Returned', 'Return Requested'].includes(order.status);
            return true;
        });

        if (loading && orders.length === 0) {
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Orders & Returns</h2>
                        <p className="text-gray-400">Track, return, or buy things again.</p>
                    </div>
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Toaster position="top-right" />
                <div>
                    <h2 className="text-2xl font-bold mb-2">Orders & Returns</h2>
                    <p className="text-gray-400">Track, return, or buy things again based on your recent activity.</p>
                </div>

                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All Orders', icon: Boxes },
                        { id: 'open', label: 'Open Orders', icon: PackageX },
                        { id: 'cancelled', label: 'Cancelled', icon: Filter }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = filter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${active
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onCancel={() => handleAction(order.id, 'cancel')}
                                onReturn={() => handleAction(order.id, 'return')}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                Looks like there are no orders in this category yet.
                            </p>
                        </div>
                    )}
                </div>

                <ReturnModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleModalSubmit}
                    type={modalType}
                    order={orders.find(o => o.id === selectedOrder) || null}
                />
            </div>
        );
    };

    const LegalSection = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold mb-2">Legal & Policies</h2>
                <p className="text-gray-400">Review our terms and policies.</p>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden divide-y divide-white/10">
                {['Terms of Service', 'Privacy Policy', 'Refund Policy', 'Shipping Policy'].map((item, i) => (
                    <div key={i} className="p-4 flex justify-between items-center hover:bg-white/5 cursor-pointer transition-colors">
                        <span className="font-medium">{item}</span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-8">
                Version 1.0.0 • © 2026 ShoeShop Inc.
            </p>
        </div>
    );

    // --- Render Logic ---
    const renderContent = () => {
        switch (activeSection) {
            case 'account': return <AccountSection />;
            case 'addresses': return <AddressesSection />;
            case 'payments': return <PaymentsSection />;
            case 'notifications': return <NotificationsSection />;
            case 'privacy': return <PrivacySection />;
            case 'appearance': return <LanguageSection />;
            case 'support': return <SupportSection />;
            case 'legal': return <LegalSection />;
            case 'orders': return <OrdersSection />;
            default: return <AccountSection />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-12 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start">

                {/* Sidebar Navigation */}
                <aside className="w-full md:w-72 flex-shrink-0 space-y-2 md:sticky md:top-24 self-start">
                    <div className="bg-[#111] border border-white/10 rounded-xl p-4 mb-4 md:hidden flex items-center justify-between" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <div className="flex items-center gap-3">
                            <span className="font-bold">Settings Menu</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`} />
                    </div>

                    <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block bg-[#111] border border-white/10 rounded-xl overflow-hidden`}>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id as Section);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 border-l-4 ${isActive
                                        ? 'border-primary bg-primary/10 text-white'
                                        : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                                    {item.label}
                                </button>
                            );
                        })}

                        <div className="border-t border-white/10 mt-2 pt-2">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors border-l-4 border-transparent"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-black">
                    {renderContent()}
                </main>

            </div>
        </div>
    );
}
