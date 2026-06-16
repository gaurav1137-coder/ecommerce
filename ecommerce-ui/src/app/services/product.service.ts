import { Injectable } from '@angular/core';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  pay(amount: number, onSuccess: Function) {

    const options = {
      key: 'rzp_test_T1zQ4OzyqChGd9', // 🔴 replace with your test key
      amount: amount * 100,
      currency: 'INR',
      name: 'NEXORA STORE',
      description: 'Order Payment',
      theme: { color: '#6366f1' },

      handler: (response: any) => {
        onSuccess(response);
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }
}
