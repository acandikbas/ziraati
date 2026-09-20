import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.NEXT_PUBLIC_IYZICO_API_KEY,
  secretKey: process.env.NEXT_PUBLIC_IYZICO_SECRET_KEY,
  uri: 'https://api.iyzipay.com'
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    const paymentRequest = {
      locale: 'tr',
      conversationId: body.conversationId,
      price: body.price,
      paidPrice: body.price,
      currency: 'TRY',
      installment: '1',
      basketId: body.basketId,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: body.cardName,
        cardNumber: body.cardNumber,
        expireMonth: body.expireMonth,
        expireYear: body.expireYear,
        cvc: body.cvc
      },
      buyer: {
        id: body.buyerId,
        name: body.buyerName,
        surname: body.buyerSurname,
        gsmNumber: body.gsmNumber,
        email: body.email,
        identityNumber: body.identityNumber,
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: body.address,
        ip: '85.34.78.112',
        city: body.city,
        country: 'Turkey',
        zipCode: body.zipCode
      },
      shippingAddress: {
        contactName: body.buyerName,
        city: body.city,
        country: 'Turkey',
        address: body.address,
        zipCode: body.zipCode
      },
      billingAddress: {
        contactName: body.buyerName,
        city: body.city,
        country: 'Turkey',
        address: body.address,
        zipCode: body.zipCode
      },
      basketItems: [
        {
          id: '1',
          name: body.productName,
          category1: 'Tarım',
          itemType: 'PHYSICAL',
          price: body.price
        }
      ]
    };

    return new Promise((resolve, reject) => {
      iyzipay.payment.create(paymentRequest, function (err, result) {
        if (err) {
          resolve(new Response(JSON.stringify({ error: err.message }), { status: 400 }));
        } else {
          resolve(new Response(JSON.stringify(result), { status: 200 }));
        }
      });
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}