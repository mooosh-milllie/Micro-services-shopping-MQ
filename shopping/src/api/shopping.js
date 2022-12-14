const {CUSTOMER_BINDING_KEY} = require("../config");
const ShoppingService = require("../services/shopping-service");
const { PublishMessages, SubscribeMessages } = require("../utils");
const UserAuth = require('./middlewares/auth');

module.exports = (app, channel) => {
    
    const service = new ShoppingService();
    SubscribeMessages(channel, service);

    app.post('/order',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;

        console.log('Shopping id txnnumber::', _id, txnNumber)
        try {
            const { data } = await service.PlaceOrder({_id, txnNumber});
            console.log('Shopping Data::', data)

            const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");
            console.log('Shopping Payload:::', payload);
            // PublishCustomerEvent(payload);
            PublishMessages(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload))
            return res.status(200).json(data);
            
        } catch (err) {
            next(err)
        }

    });

    app.get('/orders',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });
       
    
    app.get('/cart', UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        try {
            const { data } = await service.getCart(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
}