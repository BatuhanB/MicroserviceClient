import { PaymentModel, PaymentModelAsync } from './../Payment/paymentmodel';
import { AddressModel } from "./addressmodel";

export class CheckoutModel {
    address: AddressModel = new AddressModel();
    payment: PaymentModel = new PaymentModel();
}

export class CheckoutModelAsync {
    address: AddressModel = new AddressModel();
    payment: PaymentModelAsync = new PaymentModelAsync();
}