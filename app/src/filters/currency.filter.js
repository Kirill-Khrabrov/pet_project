export default function currencyFilter(value, format = 'RUB') {
    if (typeof value === 'number') { 
        return new Intl.NumberFormat('ru', {
            style: 'currency',
            currency: 'RUB'
        }).format(value);
    } else {
        return value;
    }    
}