import { useState } from 'react';
import { HiX, HiUpload } from 'react-icons/hi';

// Handles both existing (already-uploaded, has url+publicId) and new (File objects) images
const ImageUploader = ({ existingImages = [], onExistingRemove, newFiles, onNewFilesChange, multiple = true }) => {
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        onNewFilesChange(multiple ? [...newFiles, ...files] : files.slice(0, 1));
    };

    const removeNewFile = (index) => {
        onNewFilesChange(newFiles.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3 mb-3">
                {existingImages.map((img) => (
                    <div key={img.publicId} className="relative w-20 h-20 rounded-lg overflow-hidden border border-light-400">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onExistingRemove(img.publicId)}
                            className="absolute top-0.5 right-0.5 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                            <HiX />
                        </button>
                    </div>
                ))}
                {newFiles.map((file, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-primary-400">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeNewFile(i)}
                            className="absolute top-0.5 right-0.5 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                            <HiX />
                        </button>
                    </div>
                ))}
                <label className="w-20 h-20 border-2 border-dashed border-light-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 text-dark-300">
                    <HiUpload className="text-xl" />
                    <span className="text-xs mt-1">Upload</span>
                    <input type="file" accept="image/*" multiple={multiple} onChange={handleFileSelect} className="hidden" />
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;