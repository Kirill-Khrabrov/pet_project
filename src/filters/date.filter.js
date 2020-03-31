export default function dateFilter(value, format) {
    return new Intl.DateTimeFormat('ru-RU').format(new Date (value));
}