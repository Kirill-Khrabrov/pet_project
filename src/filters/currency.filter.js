export default function currencyFilter(value, format = 'RUB') {
    return new Intl.NumberFormat('ru', {
        style: 'currency',
        currency: 'RUB'
    }).format(value);
}