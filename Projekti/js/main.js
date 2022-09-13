(function() {
		
		let field = document.querySelector('.items');
		let li = Array.from(field.children); 

		function FilterProduct() {
			for(let i of li){
				const name = i.querySelector('strong');
				const x = name.textContent;
				i.setAttribute("data-category", x);
			}

			let indicator = document.querySelector('.indicator').children;

			this.run = function() {
				for(let i=0; i<indicator.length; i++)
				{
					indicator[i].onclick = function () {
						for(let x=0; x<indicator.length; x++)
						{
							indicator[x].classList.remove('active');
						}
						this.classList.add('active');
						const displayItems = this.getAttribute('data-filter');

						for(let z=0; z<li.length; z++)
						{
							li[z].style.transform = "scale(0)";
							setTimeout(()=>{
								li[z].style.display = "none";
							}, 500);

							if ((li[z].getAttribute('data-category') == displayItems) || displayItems == "all")
							 {
							 	li[z].style.transform = "scale(1)";
							 	setTimeout(()=>{
									li[z].style.display = "block";
								}, 500);
							 }
						}
					};
				}
			}
		}

		function SortProduct() {
			let select = document.getElementById('select');
			let ar = [];
			for(let i of li){
				const last = i.lastElementChild;
				const x = last.textContent.trim();
				const y = Number(x.substring(1)); 
				i.setAttribute("data-price", y);
				ar.push(i);
			}
			this.run = ()=>{
				addevent();
			}
			function addevent(){
				select.onchange = sortingValue;
			}
			function sortingValue(){
			
				if (this.value === 'Default') {
					while (field.firstChild) {field.removeChild(field.firstChild);}
					field.append(...ar);	
				}
				if (this.value === 'LowToHigh') {
					SortElem(field, li, true)
				}
				if (this.value === 'HighToLow') {
					SortElem(field, li, false)
				}
			}
			function SortElem(field,li, asc){
				let  dm, sortli;
				dm = asc ? 1 : -1;
				sortli = li.sort((a, b)=>{
					const ax = a.getAttribute('data-price');
					const bx = b.getAttribute('data-price');
					return ax > bx ? (1*dm) : (-1*dm);
				});
				 while (field.firstChild) {field.removeChild(field.firstChild);}
				 field.append(...sortli);	
			}
		}

		new FilterProduct().run();
		new SortProduct().run();
	})();



	// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
	// =============================
	// Private methods and propeties
	// =============================
	cart = [];
	
	// Constructor
	function Item(name, price, count) {
	  this.name = name;
	  this.price = price;
	  this.count = count;
	}
	
	// Save cart
	function saveCart() {
	  sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
	}
	
	  // Load cart
	function loadCart() {
	  cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
	}
	if (sessionStorage.getItem("shoppingCart") != null) {
	  loadCart();
	}
	
  
	// =============================
	// Public methods and propeties
	// =============================
	var obj = {};
	
	// Add to cart
	obj.addItemToCart = function(name, price, count) {
	  for(var item in cart) {
		if(cart[item].name === name) {
		  cart[item].count ++;
		  saveCart();
		  return;
		}
	  }
	  var item = new Item(name, price, count);
	  cart.push(item);
	  saveCart();
	}
	// Set count from item
	obj.setCountForItem = function(name, count) {
	  for(var i in cart) {
		if (cart[i].name === name) {
		  cart[i].count = count;
		  break;
		}
	  }
	};
	// Remove item from cart
	obj.removeItemFromCart = function(name) {
		for(var item in cart) {
		  if(cart[item].name === name) {
			cart[item].count --;
			if(cart[item].count === 0) {
			  cart.splice(item, 1);
			}
			break;
		  }
	  }
	  saveCart();
	}
  
	// Remove all items from cart
	obj.removeItemFromCartAll = function(name) {
	  for(var item in cart) {
		if(cart[item].name === name) {
		  cart.splice(item, 1);
		  break;
		}
	  }
	  saveCart();
	}
  
	// Clear cart
	obj.clearCart = function() {
	  cart = [];
	  saveCart();
	}
  
	// Count cart 
	obj.totalCount = function() {
	  var totalCount = 0;
	  for(var item in cart) {
		totalCount += cart[item].count;
	  }
	  return totalCount;
	}
  
	// Total cart
	obj.totalCart = function() {
	  var totalCart = 0;
	  for(var item in cart) {
		totalCart += cart[item].price * cart[item].count;
	  }
	  return Number(totalCart.toFixed(2));
	}
  
	// List cart
	obj.listCart = function() {
	  var cartCopy = [];
	  for(i in cart) {
		item = cart[i];
		itemCopy = {};
		for(p in item) {
		  itemCopy[p] = item[p];
  
		}
		itemCopy.total = Number(item.price * item.count).toFixed(2);
		cartCopy.push(itemCopy)
	  }
	  return cartCopy;
	}
  
	// cart : Array
	// Item : Object/Class
	// addItemToCart : Function
	// removeItemFromCart : Function
	// removeItemFromCartAll : Function
	// clearCart : Function
	// countCart : Function
	// totalCart : Function
	// listCart : Function
	// saveCart : Function
	// loadCart : Function
	return obj;
  })();
  
  
  // *****************************************
  // Triggers / Events
  // ***************************************** 
  // Add item
  $('.add-to-cart').click(function(event) {
	event.preventDefault();
	var name = $(this).data('name');
	var price = Number($(this).data('price'));
	shoppingCart.addItemToCart(name, price, 1);
	displayCart();
  });
  
  // Clear items
  $('.clear-cart').click(function() {
	shoppingCart.clearCart();
	displayCart();
  });
  
  
  function displayCart() {
	var cartArray = shoppingCart.listCart();
	var output = "";
	for(var i in cartArray) {
	  output += "<tr>"
		+ "<td>" + cartArray[i].name + "</td>" 
		+ "<td>(" + cartArray[i].price + ")</td>"
		+ "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
		+ "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
		+ "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
		+ "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
		+ " = " 
		+ "<td>" + cartArray[i].total + "</td>" 
		+  "</tr>";
	}
	$('.show-cart').html(output);
	$('.total-cart').html(shoppingCart.totalCart());
	$('.total-count').html(shoppingCart.totalCount());
  }
  
  // Delete item button
  
  $('.show-cart').on("click", ".delete-item", function(event) {
	var name = $(this).data('name')
	shoppingCart.removeItemFromCartAll(name);
	displayCart();
  })
  
  
  // -1
  $('.show-cart').on("click", ".minus-item", function(event) {
	var name = $(this).data('name')
	shoppingCart.removeItemFromCart(name);
	displayCart();
  })
  // +1
  $('.show-cart').on("click", ".plus-item", function(event) {
	var name = $(this).data('name')
	shoppingCart.addItemToCart(name);
	displayCart();
  })
  
  // Item count input
  $('.show-cart').on("change", ".item-count", function(event) {
	 var name = $(this).data('name');
	 var count = Number($(this).val());
	shoppingCart.setCountForItem(name, count);
	displayCart();
  });
  
  displayCart();