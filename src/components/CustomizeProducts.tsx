import React, { useState } from "react";

interface CustomizeProductsProps {
  onCustomizationChange?: (customization: CustomizationType) => void;
}

interface CustomizationType {
  color: string;
  size: string;
}

const COLORS = [
  { id: "red", value: "bg-red-500", available: true },
  { id: "blue", value: "bg-blue-500", available: true },
  { id: "green", value: "bg-green-500", available: false },
];

const SIZES = [
  { id: "small", label: "Small", available: true },
  { id: "medium", label: "Medium", available: true },
  { id: "large", label: "Large", available: false },
];

const CustomizeProducts: React.FC<CustomizeProductsProps> = ({
  onCustomizationChange,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
    onCustomizationChange?.({ color: colorId, size: selectedSize });
  };

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    onCustomizationChange?.({ color: selectedColor, size: sizeId });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h4 className="font-medium mb-3">Choose a color</h4>
        <ul className="flex items-center gap-3">
          {COLORS.map(({ id, value, available }) => (
            <li key={id}>
              <button
                className={`w-8 h-8 rounded-full ${value} ${
                  !available
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                } ${
                  selectedColor === id
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : "ring-1 ring-gray-300"
                }`}
                onClick={() => available && handleColorSelect(id)}
                disabled={!available}
                aria-label={`Select ${id} color`}
              >
                {!available && (
                  <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-medium mb-3">Choose a size</h4>
        <ul className="flex items-center gap-3">
          {SIZES.map(({ id, label, available }) => (
            <li key={id}>
              <button
                className={`px-4 py-1 rounded-md transition-colors ${
                  !available
                    ? "cursor-not-allowed opacity-60 ring-1 ring-gray-300 text-gray-400"
                    : selectedSize === id
                    ? "bg-blue-500 text-white"
                    : "ring-1 ring-blue-500 text-blue-500 hover:bg-blue-50"
                }`}
                onClick={() => available && handleSizeSelect(id)}
                disabled={!available}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomizeProducts;
