"use client";

import { useEffect, useState, useRef } from 'react';
import { useHeroStore } from '@/store/hero-store';
import { Save, Upload, Video, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function HeroEditor() {
    const { heroData, isLoading, fetchHeroData, updateHeroData } = useHeroStore();

    // Local state for form
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [isVideo, setIsVideo] = useState(false);
    const [showBottomGradient, setShowBottomGradient] = useState(true);

    // Upload state
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Feedback state
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    useEffect(() => {
        fetchHeroData();
    }, [fetchHeroData]);

    // Sync store data to local state when loaded
    useEffect(() => {
        setTitle(heroData.title);
        setSubtitle(heroData.subtitle);
        setImageSrc(heroData.imageSrc);
        setIsVideo(heroData.isVideo);
        setShowBottomGradient(heroData.showBottomGradient ?? true);
    }, [heroData]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const isVideoFile = file.type.startsWith('video/');
        const isImageFile = file.type.startsWith('image/');

        if (!isVideoFile && !isImageFile) {
            setStatus({ type: 'error', message: 'Supports only image or video files.' });
            return;
        }

        setIsUploading(true);
        setStatus({ type: null, message: '' });

        try {
            // Upload to Firebase Storage
            const storageRef = ref(storage, `hero/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            setImageSrc(downloadURL);
            setIsVideo(isVideoFile);
            setStatus({ type: 'success', message: 'File uploaded successfully. Don\'t forget to click Save.' });
        } catch (error) {
            console.error('Upload failed:', error);
            setStatus({ type: 'error', message: 'File upload failed.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            await updateHeroData({
                title,
                subtitle,
                imageSrc,
                isVideo,
                showBottomGradient
            });
            setStatus({ type: 'success', message: 'Hero settings saved successfully!' });

            // Clear success message after 3 seconds
            setTimeout(() => setStatus({ type: null, message: '' }), 3000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save settings.' });
        }
    };

    if (isLoading && !title && !imageSrc) return <div className="p-8 text-center text-stone-500">Loading settings...</div>;

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div>
                <h3 className="text-xl font-serif font-bold text-stone-800">Hero Section Settings</h3>
                <p className="text-stone-500 text-sm mt-1">
                    Manage the main image (or video) and text displayed at the top of the landing page.
                </p>
            </div>

            {/* Preview Section */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                <h4 className="font-bold text-stone-700 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-600" />
                    Preview
                </h4>

                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md bg-stone-900 group">
                    {/* Background Media */}
                    {imageSrc ? (
                        isVideo ? (
                            <video
                                src={imageSrc}
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover opacity-90"
                            />
                        ) : (
                            <Image
                                src={imageSrc}
                                alt="Hero Background"
                                fill
                                className="object-cover opacity-90"
                            />
                        )
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-600">
                            No media selected
                        </div>
                    )}

                    {/* Gradient Overlay Preview */}
                    {showBottomGradient && (
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                    )}

                    {/* Overlay Text Preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 drop-shadow-lg">
                            {title || 'Your Title Here'}
                        </h2>
                        <p className="text-lg md:text-xl text-stone-200 drop-shadow-md">
                            {subtitle || 'Your subtitle here'}
                        </p>
                    </div>

                    {/* Upload Overlay (on hover) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            Preview Only
                        </span>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Media Upload */}
                <div className="space-y-4">
                    <h4 className="font-bold text-stone-700">Background Media</h4>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                            ${isUploading ? 'bg-amber-50 border-amber-300' : 'bg-white border-stone-300 hover:bg-stone-50 hover:border-amber-400'}
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />

                        {isUploading ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <span className="text-amber-800 font-medium">Uploading...</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-500">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <span className="text-stone-700 font-medium mb-1">Click to upload</span>
                                <span className="text-xs text-stone-500">
                                    Supports High-Res Images & MP4 Videos
                                </span>
                            </>
                        )}
                    </div>

                    {imageSrc && (
                        <div className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg">
                            {isVideo ? <Video className="w-5 h-5 text-blue-500" /> : <ImageIcon className="w-5 h-5 text-green-500" />}
                            <span className="text-sm text-stone-600 truncate flex-1">{imageSrc.split('/').pop()}</span>
                        </div>
                    )}
                </div>

                {/* Text Settings */}
                <div className="space-y-4">
                    <h4 className="font-bold text-stone-700">Content Settings</h4>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Main Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                placeholder="Enter main title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Subtitle</label>
                            <textarea
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                placeholder="Enter subtitle or message"
                            />
                        </div>

                        {/* Gradient Toggle */}
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                            <input
                                type="checkbox"
                                id="gradientToggle"
                                checked={showBottomGradient}
                                onChange={(e) => setShowBottomGradient(e.target.checked)}
                                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 border-stone-300 cursor-pointer"
                            />
                            <label htmlFor="gradientToggle" className="text-sm font-medium text-stone-700 cursor-pointer select-none">
                                Show Dark Gradient at Bottom
                                <span className="block text-xs text-stone-500 font-normal">Check this to dim the bottom of the image for better text readability.</span>
                            </label>
                        </div>
                    </div>

                    {/* Status Message */}
                    {status.message && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={isUploading || isLoading}
                        className="w-full py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-900 transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
