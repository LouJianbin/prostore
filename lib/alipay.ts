import { AlipaySdk } from "alipay-sdk";
import { SERVER_URL } from "./constants";

const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID!,
  privateKey: process.env.ALIPAY_PRIVATE_KEY!,
  gateway: process.env.ALIPAY_GAYTEWAY!,
  signType: "RSA2",
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
});

const alipay = {
  createUrl: async function (orderId: string, price: number) {
    const bizContent = {
      out_trade_no: orderId,
      product_code: "FAST_INSTANT_TRADE_PAY",
      subject: "abc",
      body: "234",
      total_amount: price.toString(),
    };

    const result = await alipaySdk.pageExecute("alipay.trade.page.pay", "GET", {
      bizContent,
      returnUrl: `${SERVER_URL}/order/${orderId}`,
    });

    return result;
  },

  queryOrder: async function (orderId: string) {
    const result = await alipaySdk.exec("alipay.trade.query", {
      bizContent: {
        out_trade_no: orderId,
      },
    });

    return result;
  },
};

export default alipay;
