import { PaymentModel } from './../Payment/paymentmodel';
import { AddressModel } from "./addressmodel";

export class CheckoutModel {
    address: AddressModel = new AddressModel();
    payment: PaymentModel = new PaymentModel();
}