class Cart {

    constructor(cartContent) {
        this.cartContent = cartContent;
    }

    getProductContent() {
        return this.cartContent;
    }

    addOne(product) {
        let productCount = this.getProductCount(product);
        this.changeProductCount(product, ++productCount);
    }

    removeOne(product) {
        let productCount = this.getProductCount(product);
        this.changeProductCount(product, --productCount);
    }

    getProductCount(product) {
        const productIndex = this.getProductIndex(product);
        if (productIndex != -1) {
            return this.cartContent[productIndex].count;
        }
        return 0;
    }

    getTotalCount() {
        let totalCount = 0;
        this.cartContent.forEach(item => {
            totalCount += item.count;  
        });
        return totalCount;
    }

    getTotalCartPrice() {
        let totalPrice = 0;
        this.cartContent.forEach(item => {
            totalPrice += item.product.price * item.count;
        });
        return totalPrice;
    }

    changeProductCount(product, count) {
        const productIndex = this.getProductIndex(product);
        if (count > 0) {
            if (productIndex != -1) {
                this.cartContent[productIndex].count = count;
            } else {
                this.cartContent.push({'product': product, 'count': count});
            }
        } else {
            this.delete(product);
        }
    }

    delete(product) {
        const productIndex = this.getProductIndex(product);
        if (productIndex != -1) {
            this.cartContent.splice(productIndex, 1);
        }
    }

    getProductIndex(product) {
        for (let index = 0; index < this.cartContent.length; index++) {
            if (this.cartContent[index].product._id == product._id) {
                return index;
            }
        }
        return -1;
    }

    clear() {
        this.cartContent = [];
    }

}

module.exports.Cart = Cart;