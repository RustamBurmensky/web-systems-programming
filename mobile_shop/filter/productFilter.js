/*
    Модуль фільтра для списку товару
*/
class ProductFilter {

    constructor(category) {
        this.category = category;
    }

    generateQuery() {
        const query = {};
        if (this.category) {
            query.categoryId = this.category;
        }
        return query;
    }

}

module.exports.ProductFilter = ProductFilter;