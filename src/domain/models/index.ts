export type BranchId = 'mac-thi-buoi' | 'xuan-thuy';

export interface Branch {
  id: BranchId;
  name: string;
  shortName: string;
  address: string;
  legacyContactAddress: string;
  reservationOptionValue: string;
  hotline: string;
  hotlineTel: string;
  openingHours: string;
  mapEmbedUrl: string;
  menuRoute: string;
  spaceRoute: string;
  highlights: string[];
}

export type FeaturedItemCategory = 'signature' | 'drinks';

export interface FeaturedMenuItem {
  id: string;
  category: FeaturedItemCategory;
  nameVi: string;
  nameEnOrThai?: string;
  priceVnd: number;
  priceFormatted: string;
  description?: string;
  imageUrl?: string;
  isSpicy?: boolean;
  isBestSeller?: boolean;
}

export type MenuBookSection = 'food' | 'drinks' | 'promo';

export interface StandardizedImageMeta {
  format: 'webp' | 'jpeg' | 'png';
  quality: number;
  aspectRatio: '3:4' | '16:9' | '4:3';
  aspectRatioNumeric: number;
  width: number;
  height: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  fitMode: 'contain' | 'cover';
  backgroundHex: string;
}

export interface BranchMenuPageItem {
  id: string;
  branchId: BranchId;
  pageNumber: number;
  section: MenuBookSection;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  imageMeta?: StandardizedImageMeta;
}

export interface RawMenuReplacementInput {
  sourceUrlOrPath: string;
  section?: MenuBookSection;
  title?: string;
  sourceWidth?: number;
  sourceHeight?: number;
}

export interface MenuReplacementResult {
  branchId: BranchId;
  menuVersion: string;
  totalPages: number;
  replacedSection: MenuBookSection | 'all';
  pages: BranchMenuPageItem[];
  optimizationReport: {
    processedCount: number;
    standardSpec: StandardizedImageMeta;
    warnings: string[];
  };
}

export type GalleryCategory = 'home-featured' | 'space-mac-thi-buoi' | 'space-xuan-thuy';

export interface GalleryImage {
  id: string;
  category: GalleryCategory;
  branchId?: BranchId;
  title: string;
  caption?: string;
  imageUrl: string;
  thumbnailUrl: string;
  aspectRatio?: string;
}

export interface BlogContentBlock {
  type: 'paragraph' | 'image' | 'heading' | 'list';
  text?: string;
  items?: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageMeta?: StandardizedImageMeta;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  publishedDate: string;
  publishedIso: string;
  excerpt: string;
  thumbnailUrl: string;
  thumbnailMeta?: StandardizedImageMeta;
  contentParagraphs: BlogContentBlock[];
  relatedKeywords: string[];
  seoMeta?: {
    metaTitle: string;
    metaDescription: string;
    canonicalPath: string;
  };
}

export interface RawBlogDraftInput {
  title: string;
  rawContent: string | BlogContentBlock[];
  slug?: string;
  publishedDate?: string;
  excerpt?: string;
  thumbnailUrl?: string;
  relatedKeywords?: string[];
}

export interface PaginatedBlogResult {
  items: BlogPost[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ParallaxLayerConfig {
  speedFactor: number;
  maxOffsetPx?: number;
  direction?: 'vertical' | 'horizontal';
  reducedMotion?: boolean;
}

export interface ParallaxTransformResult {
  offsetX: number;
  offsetY: number;
  transformStyle: string;
}

export interface Tilt3DValues {
  rotateX: number;
  rotateY: number;
  scale: number;
  transformStyle: string;
}

export interface ReservationFormInput {
  fullname: string;
  email?: string;
  phone: string;
  title: string;
  date: string;
  time: string;
  quantity: number | string;
  message?: string;
  honeypot?: string;
  formOpenedAtMs?: number;
}

export type ReservationDeliveryChannel =
  | 'WEBHOOK_JSON'
  | 'EMAIL_RELAY'
  | 'CHAT_NOTIFICATION'
  | 'LEGACY_FORM_POST';

export interface ReservationDeliveryReceipt {
  channel: ReservationDeliveryChannel;
  delivered: boolean;
  recipientLabel: string;
  timestampIso: string;
  errorMessage?: string;
}

export type ReservationSyncStatus = 'SUBMITTED_ONLINE' | 'QUEUED_OFFLINE' | 'SYNCED_FROM_OFFLINE';

export interface ReservationRecord extends Omit<ReservationFormInput, 'honeypot' | 'formOpenedAtMs'> {
  id: string;
  branchId: BranchId;
  branchHotline: string;
  idempotencyKey: string;
  quantity: number;
  createdAtIso: string;
  status: ReservationSyncStatus;
  deliveryReceipts: ReservationDeliveryReceipt[];
  calendarIcsContent: string;
}

export interface RateLimitPolicy {
  maxRequestsPerWindow: number;
  windowDurationMs: number;
  cooldownDurationMs: number;
  dedupWindowMs: number;
  minFillTimeMs: number;
  maxOfflineQueueSize: number;
}
