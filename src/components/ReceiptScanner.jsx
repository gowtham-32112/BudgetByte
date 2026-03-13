import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Upload, X, Loader2, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptScanner = ({ onScanComplete, onCancel }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const extractInformation = (text) => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let maxAmount = 0;
        let date = '';
        let merchant = '';

        // 1. Amount Extraction
        const totalRegex = /(?:total|amount|sum|due|paid)[\s:]*[$€£¥]*\s*([\d,]+[.]\d{2})/i;
        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(totalRegex);
            if (match && match[1]) {
                const val = parseFloat(match[1].replace(',', ''));
                if (val > maxAmount) maxAmount = val;
            }
        }
        if (maxAmount === 0) {
            const amountRegex = /[$€£¥]?\s*(\d+[,.]\d{2})\b/g;
            let match;
            while ((match = amountRegex.exec(text)) !== null) {
                const val = parseFloat(match[1].replace(',', ''));
                if (val > maxAmount) maxAmount = val;
            }
        }

        // 2. Date Extraction (Standard 09/03/2026 format)
        const dateRegex = /(?:date)[\s:]*(\d{2}[-/]\d{2}[-/]\d{4}|\d{4}[-/]\d{2}[-/]\d{2})/i;
        const fallbackDateRegex = /(\d{2}[-/]\d{2}[-/]\d{4}|\d{4}[-/]\d{2}[-/]\d{2})/;
        for (let i = 0; i < lines.length; i++) {
            const match = lines[i].match(dateRegex);
            if (match && match[1]) {
                date = match[1];
                break;
            }
        }
        if (!date) {
            const match = text.match(fallbackDateRegex);
            if (match && match[1]) {
                date = match[1];
            }
        }
        
        // Normalize date slashes
        if (date) {
            date = date.replace(/-/g, '/');
        }

        // 3. Merchant Name (Usually the first readable line)
        const validLines = lines.filter(l => l.length > 3 && !l.match(/^[\d\s€$£¥.:]+$/));
        if (validLines.length > 0) {
            merchant = validLines[0].substring(0, 40);
        }

        return {
            amount: maxAmount > 0 ? maxAmount.toString() : '',
            description: merchant,
            date: date
        };
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setError('');
            setIsScanning(true);
            setProgress(0);

            const result = await Tesseract.recognize(file, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                }
            });

            const text = result.data.text;
            const extracted = extractInformation(text);

            if (extracted.amount || extracted.description || extracted.date) {
                onScanComplete(extracted);
            } else {
                setError('Unable to read receipt.\nPlease enter details manually.');
            }
        } catch (err) {
            console.error(err);
            setError('Unable to read receipt.\nPlease enter details manually.');
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full bg-[#1A1A1A] border border-white/10 rounded-2xl p-5 mb-6 relative overflow-hidden custom-shadow">
            {!isScanning ? (
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Camera size={28} className="text-indigo-400 mb-2" />
                    <h3 className="font-semibold text-white/90">Scan Receipt</h3>
                    <p className="text-xs text-white/50 text-center mt-1">Upload an image of your receipt to auto-fill the amount.</p>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                    />
                    {error && <p className="text-xs text-red-400 mt-2 text-center">{error}</p>}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-16 h-16 mb-4">
                        <ScanLine size={32} className="text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                            <circle
                                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                                strokeDasharray="175.93"
                                strokeDashoffset={175.93 - (175.93 * progress) / 100}
                                className="text-indigo-500 transition-all duration-300"
                            />
                        </svg>
                    </div>
                    <h3 className="font-bold text-white/90">Scanning...</h3>
                    <p className="text-xs text-indigo-400 mt-1 font-mono">{progress}% Complete</p>
                </div>
            )}
        </div>
    );
};

export default ReceiptScanner;
