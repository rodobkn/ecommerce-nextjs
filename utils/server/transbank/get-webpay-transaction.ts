import "server-only";
import {
  WebpayPlus,
  Options,
  IntegrationApiKeys,
  Environment,
  IntegrationCommerceCodes
} from "transbank-sdk";

export const getWebpayTransaction = () => {

  // TODO: cambiar a la url productiva!
  if (process.env.ORIGIN_URL === "https://tuurldeproduccion.com" && process.env.TRANSBANK_COMMERCE_CODE && process.env.TRANSBANK_KEY) {
    return new WebpayPlus.Transaction(
      new Options(
        process.env.TRANSBANK_COMMERCE_CODE,
        process.env.TRANSBANK_KEY,
        Environment.Production
      )
    )
  }

  return new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    )
  )
}
