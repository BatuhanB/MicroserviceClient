import { PaymentModel } from './../Payment/paymentmodel';
import { AdressModel } from "./adressmodel";

export class CheckoutModel {
    adress: AdressModel;
    payment: PaymentModel;
}