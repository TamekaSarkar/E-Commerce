import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems:CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartservice:CartService) { }

  ngOnInit(): void {

    this.listCartDetails();
  } 
  listCartDetails() {
    
    //get a handle to the cart items

    this.cartItems = this.cartservice.cartItems;

    //subscribe to the cart totalPrice

    this.cartservice.totalPrice.subscribe(
      data=>this.totalPrice = data
    );

    //subscribe to the cart totalQuantity

    this.cartservice.totalQuantity.subscribe(
      data=>this.totalQuantity = data
    );

    //compute cart totalprice and quantity

    this.cartservice.computeCartTotals();
  }

  incrementQuantity(thecartItem:CartItem){
    this.cartservice.addToCart(thecartItem);

  }
  decrementQuantity(thecartItem:CartItem){
    this.cartservice.decrementquantity(thecartItem);

  }
  remove(thecartItem:CartItem){
    this.cartservice.remove(thecartItem);
  }

}
