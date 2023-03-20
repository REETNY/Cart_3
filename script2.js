const heartBtn = document.querySelectorAll(".wishList i");
const numWish = document.querySelectorAll(".numWish");
const myWishList = document.querySelector(".wishLists");
const cartDomEl = document.querySelector(".cartDom");
const cartItemEl = document.querySelectorAll(".cartItem");
const cartTotalEL = document.querySelector(".total");

const messageIcon = document.querySelector(".messageIcon");
const msgNumEl = document.querySelectorAll(".msgNum");

let messages = [];

// for navbar btn
let hamBtn = document.querySelector(".hamburger");
let hamMenu = document.querySelector(".forHam");
let bodyScroll = document.querySelector("body");
let htmlScroll = document.querySelector("html")

hamBtn.addEventListener("click", () => {
    if(cartCont.classList.contains("openCart")){
        cartCont.classList.remove("openCart");
        bodyScroll.style.overflowY = 'auto';
        htmlScroll.style.overflowY = 'auto';
    }
    if(hamMenu.classList.contains("openHam")){
        hamMenu.classList.remove("openHam");
        bodyScroll.style.overflowY = 'auto';
        htmlScroll.style.overflowY = 'auto'
        hamBtn.innerHTML = `<i class="fa fa-bars" aria-hidden="true"></i>`
    }else{
        hamMenu.classList.add("openHam");
        bodyScroll.style.overflowY = 'hidden';
        htmlScroll.style.overflowY = 'hidden'
        hamBtn.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i>`
    }
})

// for cart
let cartCont = document.querySelector(".cartCont");
let cartBtn = document.querySelectorAll(".cartLogo");

cartBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        if(hamMenu.classList.contains("openHam")){
            hamMenu.classList.remove("openHam");
            bodyScroll.style.overflowY = 'auto';
            htmlScroll.style.overflowY = 'auto'
            hamBtn.innerHTML = `<i class="fa fa-bars" aria-hidden="true"></i>`
        }
        if(cartCont.classList.contains("openCart")){
            cartCont.classList.remove("openCart");
            bodyScroll.style.overflowY = 'auto';
            htmlScroll.style.overflowY = 'auto';
        }else{
            cartCont.classList.add("openCart");
            bodyScroll.style.overflowY = 'hidden';
            htmlScroll.style.overflowY = 'hidden';
        }
    })
})



let inCart;

let wishId = JSON.parse(localStorage.getItem("wishList")) || [];

let productsArr = JSON.parse(localStorage.getItem("productsCont")) || [];

let wishList = [];


function findWIsh(wishId, productsArr){
    wishId.forEach((id) => {
        productsArr.forEach((product) => {
            if(product.id == id){
                wishList.push(product)
            }
        })
    })
}

function showList(){
    myWishList.innerHTML = ``;
    wishList.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("eachWishList");
        div.innerHTML = `
            <div class="wishImg">
                <img src="${item.img}" alt="">
            </div>
            <div class="itemDetails">
                <div class="itemName">${item.name}</div>
                <div class="itemPrice">$${item.price}</div>
            </div>
            <div class="removeWish" data-id="${item.id}"><i class="fa fa-trash" aria-hidden="true"></i></div>
        `;
        myWishList.appendChild(div);

        const removeId = div.querySelector(".removeWish");

        removeId.addEventListener("click", () => {
            deleteWIsh(removeId.dataset.id)
        })
    })
}

function deleteWIsh(id){
    wishId = wishId.filter((ids) => ids != id);
    localStorage.setItem("wishList", JSON.stringify(wishId));
    wishList = wishList.filter((item) => item.id != id);
    showList(wishList);

    if(wishId.length > 0){
        heartBtn.forEach((node) => {
            node.style.color = 'pink';
        })
        numWish.forEach((node) => {
            node.textContent = wishId.length;
        })
    }else{
        heartBtn.forEach((node) => {
            node.style.color = 'pink';
        })
        numWish.forEach((node) => {
            node.textContent = wishId.length;
        })
    };
}

function populateCart(inCart){
    cartDomEl.innerHTML = ``;
    inCart.forEach((item) => {
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
            addMoreItems(addMore.dataset.id, addMore)
        })

        let subLess = div.querySelector(".subMore");
        subLess.addEventListener("click", () => {
            subLessItem(subLess.dataset.id, subLess)
        })

        let deleteItem = div.querySelector(".deleteItem");
        deleteItem.addEventListener("click", () => {
            removeItem(deleteItem.dataset.id)
        })
    })
}

function setCartValues(inCart){
    let numOfItemInCart = 0;
    let totalAmount = 0;

    inCart.map((item) => {
        numOfItemInCart += item.amount;
        totalAmount += item.amount * item.price;
    })

    cartItemEl.forEach((node) => {
        node.textContent = numOfItemInCart;
    })
    cartTotalEL.textContent = `$${ parseFloat(totalAmount.toFixed(2))}`
}

function addMoreItems(id, adder){
    let item = inCart.find((item) => {
        return item.id == id
    })
    item.amount = item.amount + 1;
    localStorage.setItem("inCart", JSON.stringify(inCart));
    setCartValues(inCart);
    adder.nextElementSibling.textContent = item.amount;
    populateCart(inCart);
}

function subLessItem(id, suber){
    let item = inCart.find((item) => {
        return item.id == id
    })
    if(item.amount <= 1){
        return
    }
    item.amount = item.amount - 1;
    localStorage.setItem("inCart", JSON.stringify(inCart));
    setCartValues(inCart);
    suber.previousElementSibling.textContent = item.amount;
    populateCart(inCart)
}

function  removeItem(id){
    inCart = inCart.filter((item) => {
        return item.id != id;
    })
    localStorage.setItem("inCart", JSON.stringify(inCart));
    setCartValues(inCart);
    populateCart(inCart);
}

function getMsg(num){
    return num;
}


window.onload = () => {
    wishId = JSON.parse(localStorage.getItem("wishList")) || [];
    console.log(wishId.length)
    if(wishId.length > 0){
        heartBtn.forEach((node) => {
            node.style.color = 'pink';
        })
        numWish.forEach((node) => {
            node.textContent = wishId.length;
        })
    }else{
        heartBtn.forEach((node) => {
            node.style.color = 'rgb(27, 26, 26, .4)';
        })
        numWish.forEach((node) => {
            node.textContent = wishId.length;
        })
    };
    productsArr = JSON.parse(localStorage.getItem("productsCont")) || [];
    findWIsh(wishId, productsArr);
    showList();

    inCart = JSON.parse(localStorage.getItem("inCart")) || [];
    populateCart(inCart);
    setCartValues(inCart);

    messages = JSON.parse(localStorage.getItem("boughtItems")) || [];
    msgNumEl.forEach((node) => {
        node.textContent = getMsg(messages.length)
    })

};

