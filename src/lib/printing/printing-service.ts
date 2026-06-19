import { prisma } from '@/lib/utils/prisma';

// Printful API integration
class PrintfulService {
  constructor(private apiKey: string, private apiUrl: string = 'https://api.printful.com') {}

  async createOrder(orderData: any) {
    const response = await fetch(`${this.apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }

  async getOrder(orderId: string) {
    const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });
    return response.json();
  }
}

// Gooten API integration
class GootenService {
  constructor(private apiKey: string, private apiUrl: string = 'https://api.gooten.com') {}

  async createOrder(orderData: any) {
    const response = await fetch(`${this.apiUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }
}

// Printify API integration
class PrintifyService {
  constructor(private apiKey: string, private apiUrl: string = 'https://api.printify.com') {}

  async createOrder(orderData: any) {
    const response = await fetch(`${this.apiUrl}/v1/shops/{shop_id}/orders.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }
}

// Custom printing service (for local or custom API)
class CustomPrintService {
  constructor(private apiUrl: string, private apiKey: string) {}

  async createOrder(orderData: any) {
    const response = await fetch(`${this.apiUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }
}

// Main printing service factory
export class PrintingService {
  static getService(printingSource: any) {
    switch (printingSource.provider) {
      case 'PRINTFUL':
        return new PrintfulService(printingSource.apiKey, printingSource.apiUrl);
      case 'GOOTEN':
        return new GootenService(printingSource.apiKey, printingSource.apiUrl);
      case 'PRINTIFY':
        return new PrintifyService(printingSource.apiKey, printingSource.apiUrl);
      case 'CUSTOM':
      case 'LOCAL':
        return new CustomPrintService(printingSource.apiUrl, printingSource.apiKey);
      default:
        throw new Error(`Unsupported printing provider: ${printingSource.provider}`);
    }
  }

  static async createPrintOrder(orderItem: any, customizationData: any) {
    // Get the printing source from the product
    const product = await prisma.product.findUnique({
      where: { id: orderItem.productId },
      include: { printingSource: true },
    });

    if (!product?.printingSource) {
      throw new Error('No printing source configured for this product');
    }

    const printSource = product.printingSource;

    // Check if printing source is active
    if (printSource.status !== 'ACTIVE') {
      throw new Error(`Printing source is not active: ${printSource.status}`);
    }

    // Get the appropriate service
    const service = this.getService(printSource);

    // Prepare order data for the printing service
    const printOrderData = this.preparePrintOrderData(orderItem, customizationData, printSource);

    // Create the print order
    try {
      const result = await service.createOrder(printOrderData);
      
      // Create print order record
      const printOrder = await prisma.printOrder.create({
        data: {
          orderItemId: orderItem.id,
          printingSourceId: printSource.id,
          status: 'PENDING',
          printFileUrl: result.fileUrl || null,
          printSpecs: printOrderData.printSpecs || null,
        },
      });

      return printOrder;
    } catch (error) {
      console.error('Failed to create print order:', error);
      throw error;
    }
  }

  private static preparePrintOrderData(orderItem: any, customizationData: any, printSource: any) {
    // Basic order data
    const baseOrder = {
      external_id: orderItem.id,
      shipping_address: {
        name: orderItem.order.shippingName,
        address1: orderItem.order.shippingAddress,
        city: orderItem.order.shippingCity,
        state: orderItem.order.shippingState,
        zip: orderItem.order.shippingZip,
        country: orderItem.order.shippingCountry,
        email: orderItem.order.shippingEmail,
        phone: orderItem.order.shippingPhone,
      },
      items: [{
        id: orderItem.product.sku || orderItem.productId,
        quantity: orderItem.quantity,
        files: customizationData.files || [],
        options: customizationData.options || {},
      }],
    };

    // Add print specifications
    const printSpecs = {
      material: customizationData.material || 'standard',
      size: customizationData.size || 'medium',
      colors: customizationData.colors || [],
      printMethod: customizationData.printMethod || 'DTG',
      quality: customizationData.quality || 'standard',
    };

    return {
      ...baseOrder,
      printSpecs,
      customization: customizationData.text || '',
    };
  }

  static async getPrintOrderStatus(printOrderId: string) {
    const printOrder = await prisma.printOrder.findUnique({
      where: { id: printOrderId },
      include: { printingSource: true, orderItem: true },
    });

    if (!printOrder) {
      throw new Error('Print order not found');
    }

    const service = this.getService(printOrder.printingSource);
    
    try {
      // Check if the service has getOrder method
      if ('getOrder' in service) {
        const result = await (service as any).getOrder(printOrder.orderItemId);
        
        // Update print order status
        await prisma.printOrder.update({
          where: { id: printOrderId },
          data: {
            status: this.mapPrintStatus(result.status) as any,
            trackingNumber: result.tracking_number || null,
            estimatedDelivery: result.estimated_delivery ? new Date(result.estimated_delivery) : null,
          },
        });

        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get print order status:', error);
      throw error;
    }
  }

  private static mapPrintStatus(externalStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'printed': 'PRINTED',
      'shipped': 'SHIPPED',
      'failed': 'FAILED',
      'cancelled': 'CANCELLED',
    };
    return statusMap[externalStatus.toLowerCase()] || 'PENDING';
  }
}

// Helper functions for printing operations
export const printingHelpers = {
  async calculateCustomizationPrice(customizationData: any, basePrice: number): Promise<number> {
    let additionalCost = 0;
    
    // Add costs based on customization options
    if (customizationData.customText?.length > 0) {
      additionalCost += 5; // Text customization cost
    }
    
    if (customizationData.customImage?.length > 0) {
      additionalCost += 10 * customizationData.customImage.length; // Image cost per image
    }
    
    if (customizationData.customColors?.length > 0) {
      additionalCost += 3; // Color customization cost
    }
    
    if (customizationData.premiumMaterial) {
      additionalCost += basePrice * 0.2; // 20% markup for premium material
    }
    
    return additionalCost;
  },

  validateCustomizationData(customizationData: any, config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (config.text?.enabled && !customizationData.customText) {
      errors.push('Custom text is required');
    }
    
    if (config.text?.maxChars && customizationData.customText?.length > config.text.maxChars) {
      errors.push(`Text exceeds maximum ${config.text.maxChars} characters`);
    }
    
    if (config.image?.enabled && !customizationData.customImage) {
      errors.push('Custom image is required');
    }
    
    if (config.image?.maxFiles && customizationData.customImage?.length > config.image.maxFiles) {
      errors.push(`Maximum ${config.image.maxFiles} images allowed`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },
};