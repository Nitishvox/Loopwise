import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import { XIcon } from './icons';

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string | null;
    onCropComplete: (croppedImageUrl: string) => void;
}

function getCroppedImg(image: HTMLImageElement, pixelCrop: PixelCrop, fileName: string): Promise<string> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
        return Promise.reject(new Error('Failed to get canvas context'));
    }

    ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob(blob => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
    });
}


const ImageCropModal: React.FC<ImageCropModalProps> = ({ isOpen, onClose, imageSrc, onCropComplete }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1,
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
    }

    async function handleSaveCrop() {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
            const croppedImageUrl = await getCroppedImg(
                imgRef.current,
                completedCrop,
                'newFile.jpeg'
            );
            onCropComplete(croppedImageUrl);
        }
    }
    
    useEffect(() => {
        if (!isOpen) {
            setCrop(undefined);
            setCompletedCrop(undefined);
        }
    }, [isOpen]);

    if (!isOpen || !imageSrc) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-slate-900 border border-slate-800 w-full max-w-lg m-4 rounded-xl shadow-2xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 id="modal-title" className="text-xl font-bold text-white">Crop your picture</h2>
                            <p className="text-slate-400 text-sm mt-1">Adjust the image to fit the circle.</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1 rounded-full text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-6 flex justify-center bg-slate-950 p-4 rounded-lg">
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imageSrc}
                                onLoad={onImageLoad}
                                style={{ maxHeight: '70vh' }}
                            />
                        </ReactCrop>
                    </div>
                </div>

                <div className="p-6 bg-slate-950/50 rounded-b-xl flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveCrop}
                        className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-primary-800 transition-colors"
                        disabled={!completedCrop?.width || !completedCrop?.height}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;