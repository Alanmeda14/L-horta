interface Product {
    caName: string;
    esName: string;
    enName: string;
    frName: string;
  }
  
  export const getProductName = (product: Product, lang: string): string => {
    switch (lang) {
      case 'es':
        return product.esName;
      case 'en':
        return product.enName;
      case 'fr':
        return product.frName;
      case 'ca':
      default:
        return product.caName;
    }
  };
  