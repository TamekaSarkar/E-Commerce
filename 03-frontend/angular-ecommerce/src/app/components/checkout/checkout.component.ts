import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {



  checkoutFormGroup:FormGroup;
  totalPrice:number =0;
  totalQuantity:number =0;

  countries:Country[] = [];

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formbuilder:FormBuilder, private luv2ShopFormService:ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formbuilder.group({
      customer: this.formbuilder.group({
        firstName:new FormControl('',[Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        email: new FormControl('',
                                 [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress:this.formbuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
         city: new FormControl('', [Validators.required, Validators.minLength(2)]),
         state: new FormControl('', [Validators.required]),
         country: new FormControl('', [Validators.required]),
         zipCode: new FormControl('', [Validators.required, Validators.minLength(2)])
      }),
      billingAddress:this.formbuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
           city: new FormControl('', [Validators.required, Validators.minLength(2)]),
            state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
       zipCode: new FormControl('', [Validators.required, Validators.minLength(2)])
      }),
      creditCard:this.formbuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2)]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
      }),

    });
    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    //populate the countries

    this.luv2ShopFormService.getCountries().subscribe(
      data=>{
        console.log("Retreived countries"+ JSON.stringify(data));
        this.countries = data;
      }
    )
  
  }
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  //it will take the shipping address and copy to billing address
  copyShippingAddressToBillingAddress(event){
     if(event.target.checked){
       this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
       //bug fix for staes

       this.billingAddressStates = this.shippingAddressStates;
     }
     else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates= [];
     }
  }

 
   onSubmit(){
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
     console.log(this.checkoutFormGroup.get('customer').value);
   }
   handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

 
    getStates(formGroupName: string) {

      const formGroup = this.checkoutFormGroup.get(formGroupName);
  
      const countryCode = formGroup.value.country.code;
      const countryName = formGroup.value.country.name;
  
      console.log(`${formGroupName} country code: ${countryCode}`);
      console.log(`${formGroupName} country name: ${countryName}`);
  
      this.luv2ShopFormService.getStates(countryCode).subscribe(
        data => {
  
          if (formGroupName === 'shippingAddress') {
            this.shippingAddressStates = data; 
          }
          else {
            this.billingAddressStates = data;
          }
  
          // select first item by default
          formGroup.get('state').setValue(data[0]);
        }
      );

  }

   

}
