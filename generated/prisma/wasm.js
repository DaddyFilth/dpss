
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  password: 'password',
  image: 'image',
  role: 'role',
  stripeCustomerId: 'stripeCustomerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastLogin: 'lastLogin'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.SocialAccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  profile: 'profile',
  expiresAt: 'expiresAt',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SocialPostScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  accountId: 'accountId',
  platform: 'platform',
  content: 'content',
  imageUrl: 'imageUrl',
  status: 'status',
  externalId: 'externalId',
  metrics: 'metrics',
  scheduledAt: 'scheduledAt',
  postedAt: 'postedAt',
  error: 'error',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  comparePrice: 'comparePrice',
  image: 'image',
  images: 'images',
  category: 'category',
  tags: 'tags',
  stock: 'stock',
  sku: 'sku',
  featured: 'featured',
  rating: 'rating',
  reviewsCount: 'reviewsCount',
  aiScore: 'aiScore',
  aiTags: 'aiTags',
  customizable: 'customizable',
  customizationConfig: 'customizationConfig',
  categoryId: 'categoryId',
  printingSourceId: 'printingSourceId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  productId: 'productId',
  quantity: 'quantity'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  status: 'status',
  total: 'total',
  subtotal: 'subtotal',
  tax: 'tax',
  shipping: 'shipping',
  paymentMethod: 'paymentMethod',
  paymentId: 'paymentId',
  paymentStatus: 'paymentStatus',
  shippingName: 'shippingName',
  shippingEmail: 'shippingEmail',
  shippingPhone: 'shippingPhone',
  shippingAddress: 'shippingAddress',
  shippingCity: 'shippingCity',
  shippingState: 'shippingState',
  shippingZip: 'shippingZip',
  shippingCountry: 'shippingCountry',
  trackingNumber: 'trackingNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  quantity: 'quantity',
  price: 'price',
  customizationData: 'customizationData',
  customizationCost: 'customizationCost'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  rating: 'rating',
  comment: 'comment',
  verified: 'verified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistItemScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  details: 'details',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.PrintingSourceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  apiKey: 'apiKey',
  apiSecret: 'apiSecret',
  provider: 'provider',
  status: 'status',
  apiUrl: 'apiUrl',
  webhookUrl: 'webhookUrl',
  basePrice: 'basePrice',
  markup: 'markup',
  productionDays: 'productionDays',
  shippingDays: 'shippingDays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductCustomizationScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  name: 'name',
  type: 'type',
  options: 'options',
  required: 'required',
  maxChars: 'maxChars',
  maxFiles: 'maxFiles',
  price: 'price',
  template: 'template',
  previewImage: 'previewImage',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PrintOrderScalarFieldEnum = {
  id: 'id',
  orderItemId: 'orderItemId',
  printingSourceId: 'printingSourceId',
  printFileUrl: 'printFileUrl',
  printSpecs: 'printSpecs',
  status: 'status',
  trackingNumber: 'trackingNumber',
  estimatedDelivery: 'estimatedDelivery',
  errorMessage: 'errorMessage',
  retryCount: 'retryCount',
  lastRetryAt: 'lastRetryAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NewsletterSubscriptionScalarFieldEnum = {
  id: 'id',
  email: 'email',
  isActive: 'isActive',
  source: 'source',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponCodeScalarFieldEnum = {
  id: 'id',
  code: 'code',
  description: 'description',
  type: 'type',
  value: 'value',
  minOrderAmount: 'minOrderAmount',
  maxUses: 'maxUses',
  usedCount: 'usedCount',
  expiresAt: 'expiresAt',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AnalyticsEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventType: 'eventType',
  eventData: 'eventData',
  sessionId: 'sessionId',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

exports.SocialPostStatus = exports.$Enums.SocialPostStatus = {
  SCHEDULED: 'SCHEDULED',
  POSTED: 'POSTED',
  FAILED: 'FAILED',
  PENDING: 'PENDING'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.PrintSourceProvider = exports.$Enums.PrintSourceProvider = {
  PRINTFUL: 'PRINTFUL',
  GOOTEN: 'GOOTEN',
  PRINTIFY: 'PRINTIFY',
  CUSTOM: 'CUSTOM',
  LOCAL: 'LOCAL'
};

exports.PrintSourceStatus = exports.$Enums.PrintSourceStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE'
};

exports.PrintOrderStatus = exports.$Enums.PrintOrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PRINTED: 'PRINTED',
  SHIPPED: 'SHIPPED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.CouponType = exports.$Enums.CouponType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING'
};

exports.CouponStatus = exports.$Enums.CouponStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  DISABLED: 'DISABLED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken',
  SocialAccount: 'SocialAccount',
  SocialPost: 'SocialPost',
  Product: 'Product',
  Cart: 'Cart',
  CartItem: 'CartItem',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Review: 'Review',
  WishlistItem: 'WishlistItem',
  AuditLog: 'AuditLog',
  PrintingSource: 'PrintingSource',
  ProductCustomization: 'ProductCustomization',
  PrintOrder: 'PrintOrder',
  NewsletterSubscription: 'NewsletterSubscription',
  ProductCategory: 'ProductCategory',
  CouponCode: 'CouponCode',
  AnalyticsEvent: 'AnalyticsEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
