import { ResourceWithOptions } from "adminjs";
import { Delivery, License, User, Client } from "../../models"; 
import { userResourceOptions } from "./user";
import { deliveryResourceOptions } from "./delivery";
import { licenseResourceFeatures, licenseResourceOptions } from "./license";
import { clientResourceOptions } from "./client";

export const adminJsResources: ResourceWithOptions[] = [
  {
    resource: User,
    options: userResourceOptions
  },
  {
    resource: Delivery,
    options: deliveryResourceOptions
  },
  {
    resource: License,
    options: licenseResourceOptions,
    features: licenseResourceFeatures
  },
  {
    resource: Client,
    options: clientResourceOptions
  }
]