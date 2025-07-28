// emails/emailHelpers.js
exports.getOrderSummaryTable = (orderItems, totalAmount, shippingCost) => {
  const orderItemsTableHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: left; font-size: 14px;">
        <strong>${item.productName}</strong><br />
        <span style="color: #666; font-size: 13px;">${item.domainName || ''}</span>
      </td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-size: 14px;">
        ${item.quantity} ${item.unit || 'Unit'}
      </td>
      <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-size: 14px;">
        ₹${item.discountPrice.toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd;">
      <thead>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left; background-color: #f8f8f8; font-size: 14px; color: #555;">Product</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: center; background-color: #f8f8f8; font-size: 14px; color: #555;">Quantity</th>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: right; background-color: #f8f8f8; font-size: 14px; color: #555;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${orderItemsTableHtml}
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; border: 1px solid #ddd;">Subtotal:</td>
          <td style="padding: 10px; text-align: right; font-size: 14px; border: 1px solid #ddd;">₹${(totalAmount - shippingCost).toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px; border: 1px solid #ddd;">Shipping:</td>
          <td style="padding: 10px; text-align: right; font-size: 14px; border: 1px solid #ddd;">₹${shippingCost.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; border: 1px solid #ddd;">Total:</td>
          <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; border: 1px solid #ddd;">₹${totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `;
};
