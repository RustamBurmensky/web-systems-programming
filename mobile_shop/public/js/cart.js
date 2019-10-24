$(document).ready(function() {

    $("button[name='addToCart']").on('click', function addToCart(event) {
        let productId = $(event.target).val();
        $.post('/cart/add', {
           'productId': productId 
        }, (result) => {
            $('#cartTotalCount').text(result.totalCount);
        });
    });

});