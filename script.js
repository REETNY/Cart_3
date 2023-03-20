
// for navbar btn
let hamBtn = document.querySelector(".hamburger");
let hamMenu = document.querySelector(".forHam");
let bodyScroll = document.querySelector("body");
let htmlScroll = document.querySelector("html")

hamBtn.addEventListener("click", () => {

    if(cartCont.classList.contains("openCart")){
        cartCont.classList.remove("openCart");
        bodyScroll.style.overflowY = 'auto';
        htmlScroll.style.overflow = 'auto';
    }

    if(hamMenu.classList.contains("openHam")){
        hamMenu.classList.remove("openHam");
        bodyScroll.style.overflowY = 'auto';
        htmlScroll.style.overflow = 'auto'
        hamBtn.innerHTML = `<i class="fa fa-bars" aria-hidden="true"></i>`
    }else{
        hamMenu.classList.add("openHam");
        bodyScroll.style.overflowY = 'hidden';
        htmlScroll.style.overflow = 'hidden'
        hamBtn.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`
    }
})

// for cart
let cartCont = document.querySelector(".cartCont");
let cartBtn = document.querySelectorAll(".cartLogo");

cartBtn.forEach((btn) => {

    btn.addEventListener("click", () => {

        if(hamMenu.classList.contains("openHam")){
            console.log('yes')
            hamMenu.classList.remove("openHam");
            bodyScroll.style.overflowY = 'auto';
            htmlScroll.style.overflow = 'auto'
            hamBtn.innerHTML = `<i class="fa fa-bars" aria-hidden="true"></i>`
        }

        if(cartCont.classList.contains("openCart")){
            cartCont.classList.remove("openCart");
            bodyScroll.style.overflowY = 'auto';
            htmlScroll.style.overflow = 'auto';
        }else{
            cartCont.classList.add("openCart");
            bodyScroll.style.overflowY = 'hidden';
            htmlScroll.style.overflow = 'hidden';
        }
    })
})

// selecting some dom elements like products dom and the likes
const productDom = document.querySelector(".productDom");
const messageIcon = document.querySelector(".messageIcon");
const msgNumEl = document.querySelectorAll(".msgNum");
const numWishEl = document.querySelectorAll(".numWish");
const userLogo = document.querySelector(".userLogo");
const cartItemEl = document.querySelectorAll(".cartItem");
const cartTotalEL = document.querySelectorAll(".total");

// success msg dom
const successBuyMsg = document.querySelector(".successBuy");
const removeMsg = document.querySelector(".removeMsg");

let myMsgTime;

removeMsg.addEventListener("click", () => {
    successBuyMsg.classList.remove("showMsg");
    clearTimeout(myMsgTime);
})

// button dom to save buy btn
let buyButtonDom = [];
let wishButtonDom = [];

// cart Arr
let inCart = [];

// wish Arr
let wishArr = [];

let boughtItems = [];

// selecting the cart dom
let cartDomEl = document.querySelector(".cartDom");

// create a fetch product class
class FetchProducts{

    async fetchProduct(){
        let serverReply = await fetch("/products.json");
        let reply = await serverReply.json();
        let data = reply.items;
        return(data)
    }
}

// create functionality and ui class
class UI{

    saveProduct(data){
        Storage.saveProduct(data)
    }

    renderProduct(data){
        productDom.innerHTML = ``;

        data.forEach((product, index) => {
            let div = document.createElement("div");
            div.classList.add("eachProduct");
            div.innerHTML = `

            <div class="pro_img">
                <img src="${product.img}" alt="">
            </div>

            <div class="pro_details">
                <div class="pro-name">${product.name}</div>
                <div class="pro-price">$${product.price}</div>
            </div>

            <div class="pro_func">
                <button class="wishAdd" data-id="${product.id}"><i class="fa fa-heart" aria-hidden="true"></i></button>
                <button class="buyBtn" data-id="${product.id}"><i class="fa fa-cart-plus" aria-hidden="true"></i></button>
            </div>

            `
            productDom.appendChild(div);
        })
    }

    buyButton(){
        buyButtonDom = [...document.querySelectorAll(".buyBtn")];
        buyButtonDom.forEach((btn) => {
            btn.addEventListener("click", () => {
                let id = parseFloat(btn.dataset.id);
                this.addToCart(id)
            })
        })
    }

    wishButton(){
        wishButtonDom = [...document.querySelectorAll(".wishAdd")];
        wishButtonDom.forEach((btn) => {
            btn.addEventListener("click", () => {
                let inWish = wishArr.find((item) => {
                    return item == btn.dataset.id;
                })

                if(!inWish){
                    wishArr.push(btn.dataset.id);
                    Storage.saveWish(wishArr);
                    btn.style.color = `pink`;
                    console.log(wishArr);
                }else{
                    wishArr = wishArr.filter((item) => {
                        return item != btn.dataset.id;
                    })
                    Storage.saveWish(wishArr);
                    btn.style.color = `green`;
                    console.log(wishArr);
                }

                if(wishArr.length > 0){
                    numWishEl.forEach((node) => {
                        node.textContent = wishArr.length;
                        node.previousElementSibling.style.color = 'pink';
                    })
                }else{
                    numWishEl.forEach((node) => {
                        node.textContent = wishArr.length;
                        node.previousElementSibling.style.color = 'rgb(27, 26, 26, .4)';
                    })
                }
            })
        })
    }

    colorMyWish(){
        wishArr.forEach((id) => {
            wishButtonDom.forEach((btn) => {
                if(id == btn.dataset.id){
                    btn.style.color = `pink`
                }
            })
        })

        if(wishArr.length > 0){
            numWishEl.forEach((node) => {
                node.textContent = wishArr.length;
                node.previousElementSibling.style.color = 'pink';
            })
        }else{
            numWishEl.forEach((node) => {
                node.textContent = wishArr.length;
                node.previousElementSibling.style.color = 'rgb(27, 26, 26, .4)';
            })
        }
    }


    addToCart(id){

        let isInCart = inCart.find((item) => {
            return item.id == id;
        })

        if(isInCart)return;

        let item = {...Storage.getProduct(id), amount: 1};
        inCart = [...inCart, item];
        this.showInCart(item)
        Storage.saveCart(inCart);
        this.setCartValues(inCart);
    }

    showInCart(item){
        let div = document.createElement("div");
        div.classList.add("eachCart");
        div.innerHTML = `
            <div class="eachImg">
                <img src="${item.img}" alt="" class="pro_img">
            </div>

            <div class="eachDetails">
                <div class="name">${item.name}</div>
                <div class="price">$${item.price}</div>
            </div>

            <div class="cartFunc">
                <span class="addMore" data-id="${item.id}"><i class="fa fa-chevron-up" aria-hidden="true"></i></span>
                <span class="currAMount">${item.amount}</span>
                <span class="subMore" data-id="${item.id}"><i class="fa fa-chevron-down" aria-hidden="true"></i></span>
            </div>

            <div class="deleteItem" data-id="${item.id}">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </div>
        `
        cartDomEl.appendChild(div);
        
        let addMore = div.querySelector(".addMore");
        addMore.addEventListener("click", () => {
            this.addMoreItems(addMore.dataset.id, addMore)
        })

        let subLess = div.querySelector(".subMore");
        subLess.addEventListener("click", () => {
            this.subLessItem(subLess.dataset.id, subLess)
        })

        let deleteItem = div.querySelector(".deleteItem");
        deleteItem.addEventListener("click", () => {
            this.removeItem(deleteItem.dataset.id)
        })
    }

    setCartValues(inCart){
        let numOfItemInCart = 0;
        let totalAmount = 0;

        inCart.map((item) => {
            numOfItemInCart += item.amount;
            totalAmount += item.amount * item.price;
        })

        cartItemEl.forEach((node) => {
            node.textContent = numOfItemInCart;
        })

        cartTotalEL.forEach((node) => {
            node.textContent = `$${parseFloat(totalAmount.toFixed(2))}`
        })
    }

    cartFunctionality(){
        let clearCartBtn = document.querySelector(".clearCart");
        let buyItemsBtn = document.querySelector(".buyItems");
        console.log(clearCartBtn, buyItemsBtn);

        clearCartBtn.addEventListener("click", () => {
            inCart = inCart.filter((item) => {
                return ;
            })
            Storage.saveCart(inCart);
            this.setCartValues(inCart);
            this.populateCart(inCart);
            this.closeCart();
        });

        buyItemsBtn.addEventListener("click", () => {

            if(inCart.length <= 0){
                return
            }

            boughtItems = [inCart, ...boughtItems];
            Storage.saveMessage(boughtItems);
            this.messageAdder(boughtItems.length);

            inCart = inCart.filter((item) => {
                return ;
            })
            Storage.saveCart(inCart);
            this.setCartValues(inCart);
            this.populateCart(inCart);
            this.closeCart();
            successBuyMsg.classList.add("showMsg");
            myMsgTime =  setTimeout(() => {
                successBuyMsg.classList.remove("showMsg");
            }, 5000);
        })
    }

    addMoreItems(id, adder){
        let item = inCart.find((item) => {
            return item.id == id
        })
        item.amount = item.amount + 1;
        Storage.saveCart(inCart);
        this.setCartValues(inCart);
        adder.nextElementSibling.textContent = item.amount;
    }

    subLessItem(id, suber){
        let item = inCart.find((item) => {
            return item.id == id
        })
        if(item.amount <= 1){
            return
        }
        item.amount = item.amount - 1;
        Storage.saveCart(inCart);
        this.setCartValues(inCart);
        suber.previousElementSibling.textContent = item.amount;
    }

    removeItem(id){
        inCart = inCart.filter((item) => {
            return item.id != id;
        })
        Storage.saveCart(inCart);
        this.setCartValues(inCart);
        this.populateCart(inCart)
    }

    populateCart(inCart){
        cartDomEl.innerHTML = ``;
        inCart.forEach((item) => this.showInCart(item))
    }

    onLoadedFunction(){
        inCart = JSON.parse(localStorage.getItem("inCart")) || [];
        wishArr = JSON.parse(localStorage.getItem("wishList")) || [];
        boughtItems = JSON.parse(localStorage.getItem("boughtItems")) || [];

        this.populateCart(inCart);
        this.setCartValues(inCart);
        this.messageAdder(boughtItems.length);
    }

    closeCart(){
        cartCont.classList.remove("openCart");
        bodyScroll.style.overflowY = 'auto';
        htmlScroll.style.overflow = 'auto';
    }

    messageAdder(num){
        msgNumEl.forEach((node) => {
            node.textContent = num;
        })
    }

}

// create storage class

class Storage{

    static saveProduct(data){
        localStorage.setItem("productsCont", JSON.stringify(data));
    }

    static getProduct(id){
        let productsArr = JSON.parse(localStorage.getItem("productsCont")) || [];
        let idItem = productsArr.find((item) => {
            return item.id === id;
        })
        return idItem;
    }

    static saveCart(inCart){
        localStorage.setItem("inCart", JSON.stringify(inCart))
    }

    static getCart(){
        return JSON.parse(localStorage.getItem("inCart")) || [];
    }

    static saveWish(wishArr){
        localStorage.setItem("wishList", JSON.stringify(wishArr))
    }

    static saveMessage(data){
        localStorage.setItem("boughtItems", JSON.stringify(data))
    }
}


window.addEventListener("DOMContentLoaded", () => {
    let fetchData = new FetchProducts();
    let ui = new UI();

    fetchData.fetchProduct().then( (data) => {
        ui.onLoadedFunction();
        ui.saveProduct(data);
        ui.renderProduct(data);
        ui.buyButton();
        ui.wishButton();
        ui.colorMyWish();
    }).then(() => {
        ui.cartFunctionality();
    })
})

