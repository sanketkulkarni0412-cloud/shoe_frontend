"use client";

import { useState, useEffect } from 'react';
import { Save, Megaphone, Tag } from 'lucide-react';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';

export default function AdminAdsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        marquee: {
            text1: "🚀 FREE SHIPPING ON ORDERS OVER ₹2999",
            text2: "⚡ EXTRA 10% OFF WITH CREDIT CARDS",
            text3: "🎉 FESTIVE SALE IS LIVE - UP TO 50% OFF",
            text4: "🕒 LIMITED TIME DEAL: BUY 2 GET 1 FREE",
            enabled: true
        },
        discountPanel: {
            title: "Get Extra 20% OFF",
            code: "SHOE20",
            percentage: "20",
            timerHours: 12,
            enabled: true
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const docRef = doc(db, "settings", "promotions");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data() as any);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "promotions"), settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Ads & Promotions</h1>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Marquee Section */}
                <div className="bg-secondary p-8 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Megaphone className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Announcement Bar</h2>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i}>
                                <label className="block text-gray-400 mb-2">Announcement {i}</label>
                                <input
                                    value={settings.marquee[`text${i}` as keyof typeof settings.marquee]}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        marquee: { ...settings.marquee, [`text${i}`]: e.target.value }
                                    })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Discount Panel Section */}
                <div className="bg-secondary p-8 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Tag className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Floating Discount Panel</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Title</label>
                            <input
                                value={settings.discountPanel.title}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    discountPanel: { ...settings.discountPanel, title: e.target.value }
                                })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Discount Code</label>
                            <input
                                value={settings.discountPanel.code}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    discountPanel: { ...settings.discountPanel, code: e.target.value }
                                })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Percentage Off</label>
                            <input
                                type="number"
                                value={settings.discountPanel.percentage}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    discountPanel: { ...settings.discountPanel, percentage: e.target.value }
                                })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Timer Duration (Hours)</label>
                            <input
                                type="number"
                                value={settings.discountPanel.timerHours}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    discountPanel: { ...settings.discountPanel, timerHours: Number(e.target.value) }
                                })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 focus:border-primary focus:outline-none text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" isLoading={saving} className="min-w-[200px] h-12 text-lg">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
