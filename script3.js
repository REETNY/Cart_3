const heartBtn = document.querySelectorAll(".wishList i");
const numWish = document.querySelectorAll(".numWish");
const cartDomEl = document.querySelector(".cartDom");
const cartItemEl = document.querySelectorAll(".cartItem");
const cartTotalEL = document.querySelector(".total");

const messageIcon = document.querySelector(".messageIcon");
const msgNumEl = document.querySelectorAll(".msgNum");

const MsgBodyEl = document.querySelector(".MsgBody");

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

let boughtItems = [];



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

function messageAdder(num){
    msgNumEl.forEach((node) => {
        node.textContent = num;
    })
}

function returnTotal(item){
    let init = 0;
    item.map((item) => {
        init += (item.price * item.amount);
    })
    let result = parseFloat(init.toFixed(2));
    return(result)
}

function addMessage(){
    MsgBodyEl.innerHTML = '';
    boughtItems.forEach((data, index) => {
        const div = document.createElement("div");
        div.classList.add("eachMessage");
        div.innerHTML = `
            <span class="remove"><i class="fa fa-times-circle" aria-hidden="true"></i></span>
            <div class="eachHead">You have successfully bought the following items:</div>
            <div class="dropDown">
                <ul class="list">
                    
                </ul>
                <span class="totalSpent"><span class="totalWord">Your Total:</span> <span class="totalAmount">$${returnTotal(data)}</span></span>
            </div>
        `
        MsgBodyEl.appendChild(div);

        const totalEl = div.querySelector(".totalAmount");

        const listArr = div.querySelector(".list");
        data.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("itemz");
            li.innerHTML = `
                <span class="name">${item.name}</span> <span class="price">$${item.price} x  ${item.amount}</span>
            `
            listArr.appendChild(li)
        })

        const openerHead = div.querySelector(".eachHead");

        const dropDown = div.querySelector(".dropDown")

        openerHead.addEventListener("click", () => {

            let openers = [...document.querySelectorAll(".eachHead")];
            
            let closeUp = openers.filter((openBtn) => {
                return openBtn !== openerHead
            })

            closeUp.forEach((btn) => {
                btn.nextElementSibling.classList.remove('openMsg');
            })

            if(!dropDown.classList.contains("openMsg")){
                dropDown.classList.add('openMsg');
            }else{
                dropDown.classList.remove('openMsg');
            }
        })

        const removeBtn = div.querySelector(".remove");
        removeBtn.addEventListener("click", () => {
            boughtItems = boughtItems.filter((item) => {
                return item !== data;
            })
            localStorage.setItem("boughtItems", JSON.stringify(boughtItems));
            boughtItems = JSON.parse(localStorage.getItem("boughtItems")) || [];
            addMessage();
            messageAdder(boughtItems.length)
        })
    })
}


window.onload = () => {
    wishId = JSON.parse(localStorage.getItem("wishList")) || [];
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


    inCart = JSON.parse(localStorage.getItem("inCart")) || [];
    populateCart(inCart)
    setCartValues(inCart)

    boughtItems = JSON.parse(localStorage.getItem("boughtItems")) || [];
    messageAdder(boughtItems.length);
    addMessage(boughtItems);
};

