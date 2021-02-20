const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "sfs9jn8z3nwy4gn4",
  publicKey: "rjq4fr93mnkzx4ft",
  privateKey: "49192fdbc36902b3771d02c7ae3960e6"
});

exports.getToken = (req, res) =>{
    gateway.clientToken.generate({}, (error, response) => {
        // pass clientToken to your front-end
        if (err) {
            res.status(500).send(err);
          } else {
            res.send(response);
          }
    });
}

exports.processPayment = (req, res) => {

    const nonceFromTheClient = req.body.nonceToken;
    const amountFromTheClient = req.body.amount;

    // SENDING PAYMENT REQUEST TO BRAINTREE
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        deviceData: deviceDataFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
        if(err){
            return res.status(500).json(err);
        }else{
            return res.send(result);
        }
    });
}