import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register font for better look (optional, using standard Helvetica here)
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 12,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E11D48', // Primary Red
        textTransform: 'uppercase',
    },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    tableHeader: {
        backgroundColor: '#f3f4f6',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 8,
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        padding: 8,
    },
    colName: { width: '50%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '35%', textAlign: 'right' },

    totalSection: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'flex-end',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        marginBottom: 5,
    },
    grandTotal: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#E11D48',
    },
    footer: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 10,
        color: '#999',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    }
});

interface InvoicePDFProps {
    order: any;
}

export const InvoicePDF = ({ order }: InvoicePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.brand}>SHOESHOP</Text>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invoiceTitle}>INVOICE</Text>
                    <Text style={{ fontSize: 10, color: '#777' }}>INV-{order.customId || order.id.slice(0, 8).toUpperCase()}</Text>
                    <Text style={{ fontSize: 10, color: '#777' }}>Date: {new Date(order.date).toLocaleDateString()}</Text>
                </View>
            </View>

            {/* Customer Details */}
            <View style={styles.section}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Bill To:</Text>
                <Text>{order.email}</Text>
                <Text>Payment Method: {order.paymentMethod}</Text>
            </View>

            {/* Order Table */}
            <View style={{ marginTop: 20 }}>
                <View style={styles.tableHeader}>
                    <Text style={styles.colName}>Item</Text>
                    <Text style={styles.colQty}>Qty</Text>
                    <Text style={styles.colPrice}>Price</Text>
                </View>

                {order.orderDetails.map((item: any, index: number) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.colName}>{item.name}</Text>
                        <Text style={styles.colQty}>{item.quantity}</Text>
                        <Text style={styles.colPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                    </View>
                ))}
            </View>

            {/* Totals */}
            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text>Subtotal:</Text>
                    <Text>₹{(order.originalTotal || order.total).toLocaleString('en-IN')}</Text>
                </View>

                {order.discountAmount > 0 && (
                    <View style={styles.totalRow}>
                        <Text style={{ color: 'green' }}>Discount ({order.couponCode}):</Text>
                        <Text style={{ color: 'green' }}>- ₹{order.discountAmount.toLocaleString('en-IN')}</Text>
                    </View>
                )}

                <View style={styles.totalRow}>
                    <Text style={styles.grandTotal}>Total Paid:</Text>
                    <Text style={styles.grandTotal}>₹{order.total.toLocaleString('en-IN')}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for shopping with ShoeShop!</Text>
                <Text>For support, contact support@shoeshop.com</Text>
            </View>

        </Page>
    </Document>
);
