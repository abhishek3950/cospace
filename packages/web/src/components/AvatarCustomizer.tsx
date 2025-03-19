import React from 'react';

interface AvatarCustomizerProps {
  onClose: () => void;
  onSave: (style: { color: string; size: number }) => void;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  onClose,
  onSave,
}) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500', 'bg-yellow-500'];
  const sizes = [8, 10, 12, 14, 16];

  const [selectedColor, setSelectedColor] = React.useState(colors[0]);
  const [selectedSize, setSelectedSize] = React.useState(sizes[2]);

  const handleSave = () => {
    onSave({
      color: selectedColor,
      size: selectedSize,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Customize Avatar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Color</h3>
            <div className="flex space-x-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full ${color} ${
                    selectedColor === color ? 'ring-2 ring-blue-500' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Size</h3>
            <div className="flex space-x-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 rounded flex items-center justify-center ${
                    selectedSize === size ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 