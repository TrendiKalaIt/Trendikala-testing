import React from 'react';

const ProductDetails = ({ productData }) => {
  // Fallback to empty object
  const data = productData || {};
  const {
    productName,
    brand,
    description = {},
    sizes,
    sizeShape = [],
    materialWashing = [],
    details = {},
  } = data;

  // Extract details or use empty strings
  const {
    fabric,
    fitType,
    length,
    sleeveNeckType,
    patternPrint,
    occasionType,
    washCare,
    countryOfOrigin,
    deliveryReturns,
  } = details;

  // Helper to render a two-column grid of label-value pairs
  const renderLabelValueGrid = (items, labelWidth = "w-36 min-w-[140px]") => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
      {items.map(([label, value], i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
          <span className={`font-body font-medium text-[#93A87E] ${labelWidth} flex-shrink-0`}>
            {label}:
          </span>
          <span className="text-[#93A87E] flex-1">{value || 'N/A'}</span>
        </div>
      ))}
    </div>
  );

  // Product specs
  const productSpecs = [
    ['Brand', brand],
    // ['Available Sizes', sizes ? sizes.join(', ') : 'N/A'],
    ['Fabric', fabric],
    ['Fit Type', fitType],
    ['Length', length],
    ['Sleeve & Neck Type', sleeveNeckType],
    ['Pattern / Print', patternPrint],
    ['Occasion Type', occasionType],
    ['Wash Care', washCare],
    ['Country of Origin', countryOfOrigin],
    ['Delivery & Returns', deliveryReturns],
  ];

  // Render section with title and grid
  const renderSection = (title, items) => (
    <div className="pt-4 border-t border-gray-200">
      <h4 className="text-xl font-semibold text-[#35894E] mt-4 mb-4">{title}</h4>
      {renderLabelValueGrid(items)}
    </div>
  );

  return (
    <div className="font-sans antialiased text-gray-700 flex flex-col items-center min-h-screen">
      <div className="w-full mx-auto bg-red rounded-xl p-5 sm:p-8 border border-[#35894E]">
        
        <div className="space-y-4">
          <h3 className="font-heading text-2xl font-bold text-[#35894E] mb-2">{productName}</h3>
          {description.paragraph1 && (
            <p className="text-[#93A87E] leading-relaxed">{description.paragraph1}</p>
          )}
          {description.paragraph2 && (
            <p className="text-[#93A87E] leading-relaxed">{description.paragraph2}</p>
          )}
        </div>

        {/* Product Specifications */}
        {renderSection('Product Specifications', productSpecs)}

        {/* Size and Fit Information */}
        {sizeShape.length > 0 &&
          renderSection(
            'Size and Fit Information',
            sizeShape.map(({ label, value }) => [label, value])
          )}

        {/* Material Details */}
        {materialWashing.length > 0 &&
          renderSection(
            'Material Details',
            materialWashing.map(({ label, value }) => [label, value])
          )}
      </div>
    </div>
  );
};

export default ProductDetails;
