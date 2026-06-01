import Stripe from "stripe";
import config from "./config";

if (!config.stripe.secretKey) {
  console.warn("[STRIPE] Missing Stripe Secret Key");
}

export const stripe = new Stripe(config.stripe.secretKey || "", {
  apiVersion: "2022-11-15",
});

export default stripe;
