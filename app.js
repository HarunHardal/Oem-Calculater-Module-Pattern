// Product Controller////////////////////////////////////////////////////////////////////////////////////////////////////

const ProductController = (function () {

    //Privite
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        product: [],
        selectedProduct: null,
        totalPrice: 0
    }

    return {
        getProducts: function () {
            return data.product;
        },
        getData: function () {
            return data;
        },
        getProductById: function (id) {
            let product = null;

            data.product.forEach(function (prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: function () {
            return data.selectedProduct;
        },
        addProduct: function (name, price) {
            let id;

            if (data.product.length > 0) {
                id = data.product[data.product.length - 1].id + 1
            } else {
                id = 1;
            }
            const newProduct = new Product(id, name, parseFloat(price));
            data.product.push(newProduct);
            return newProduct
        },
        updateProduct: function (name, price) {
            let product = null;

            data.product.forEach(function (prd) {
                if (prd.id == data.selectedProduct.id) {
                    prd.name = name;
                    prd.price = parseFloat(price),
                        product = prd;
                }
            })

            return product;
        },
        deleteProduct: function (product) {
            data.product.forEach(function (prd, index) {
                if (prd.id = product.id) {
                    data.product.splice(index, 1)
                }
            })
        },
        getTotal: function () {
            let total = 0;

            data.product.forEach(function (item) {
                total += item.price
            });
            data.totalPrice = total;
            return data.totalPrice;
        },

    }
})();

// UI Controller///////////////////////////////////////////////////////////////////////////////////////////////////////

const UIController = (function () {

    const Selectors = {
        productList: '#itemList',
        productListItems: '#itemList tr',
        addBtn: '.addBtn',
        updateBtn: '.updateBtn',
        deleteBtn: '.deleteBtn',
        cancelBtn: '.cancelBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTl: '#total-tl',
        totalDolar: '#total-dolar',
    }

    return {
        createProductList: function(products){
            let html = '';
            products.forEach(element => {
                html += `
                <tr>
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.price}</td>
                <td class="text-right">
                    <i class="fas fa-edit edit-product"></i>
                </td>
                </tr>`
            });
            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSeletors: function () {
            return Selectors;
        },
        addProduct: function (prd) {
            document.querySelector(Selectors.productCard).style.display = "block";
            var item = `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                    <i class="fas fa-edit edit-product"></i>
                </td>
                </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearDanger: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-danger')) {
                    item.classList.remove('bg-danger')
                }
            })
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).innerHTML = total + '$';
            document.querySelector(Selectors.totalTl).innerHTML = total * 7.42 + 'TL';
        },
        addProductToForm: function () {
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        updateProduct: function (prd) {
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-danger')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item
                }
            });

            return updatedItem;
        },
        addingState: function () {
            UIController.clearDanger();
            UIController.clearInputs();
            document.querySelector(Selectors.addBtn).style.display = 'inline';
            document.querySelector(Selectors.updateBtn).style.display = 'none';
            document.querySelector(Selectors.deleteBtn).style.display = 'none';
            document.querySelector(Selectors.cancelBtn).style.display = 'none';
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-danger')) {
                    item.remove();
                }
            })
        },
        editState: function (tr) {
            const parent = tr.parentNode;
            for (let i = 0; i < parent.children.length; i++) {
                parent.children[i].classList.remove('bg-danger')
            }
            tr.classList.add('bg-danger');
            document.querySelector(Selectors.addBtn).style.display = 'none';
            document.querySelector(Selectors.updateBtn).style.display = 'inline';
            document.querySelector(Selectors.deleteBtn).style.display = 'inline';
            document.querySelector(Selectors.cancelBtn).style.display = 'inline';
        },
    }
})();



// App Controller/////////////////////////////////////////////////////////////////////////////////////////////////////
const App = (function (ProductCtrl, UICtrl) {

    const UISelectors = UIController.getSeletors();

    //Load EvebtListeners
    const loadEventListeners = function () {

        //addProduct event
        document.querySelector(UISelectors.addBtn).addEventListener('click', productAddSubmit);

        //Edit Product
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        //Edit Product Submit
        document.querySelector(UISelectors.updateBtn).addEventListener('click', editProductSubmit);

        //Cancel Button Click
        document.querySelector(UISelectors.cancelBtn).addEventListener('click', cancelUpdate)

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteProductSubmit);
    };

    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            //add  product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);
            // add item to list
            UIController.addProduct(newProduct);

            //Get Total

            const total = ProductCtrl.getTotal();


            // Show Total
            UICtrl.showTotal(total);

            // Clear items
            UIController.clearInputs();
        }

        

        e.preventDefault();
    }

    const productEditClick = function (e) {
        if (e.target.classList.contains('edit-product')) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent

            //Get selected product
            const product = ProductCtrl.getProductById(id);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            //add product to UI
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }

        //Get Selected Product


        e.preventDefault();
    }


    const editProductSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // Update Producct
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            //Update UI
            let item = UICtrl.updateProduct(updatedProduct);

            //Get Total

            const total = ProductCtrl.getTotal();


            // Show Total
            UICtrl.showTotal(total);

            //Adding state
            UIController.addingState(item);
        }

        e.preventDefault();
    }
    const cancelUpdate = function (e) {
        UICtrl.addingState();
        UICtrl.clearDanger();
        e.preventDefault();
    }

    const deleteProductSubmit = function (e) {
        // Get Selected Item

        const selectedProduct = ProductCtrl.getCurrentProduct();
        //delete Product
        ProductCtrl.deleteProduct(selectedProduct);

        //delete UI
        UICtrl.deleteProduct(selectedProduct);

        const total = ProductCtrl.getTotal();


        // Show Total
        UICtrl.showTotal(total);

        UICtrl.addingState();

        if(total == 0){
            UICtrl.hideCard();
        }


        e.preventDefault();
    }
    return {
        init: function () {

            UICtrl.addingState()

            const products = ProductController.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }


            //Load EvebtListeners
            loadEventListeners();
        },
    }
})(ProductController, UIController);

App.init();