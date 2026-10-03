export interface NewDataEntity {
  key: string;
  label: string;
  route: string;
}

export const NEW_DATA_ENTITIES: NewDataEntity[] = [
  { key: "faq", label: "FAQ", route: "/faq" },
  { key: "disclaimer", label: "Disclaimer", route: "/disclaimer" },
  { key: "category", label: "Categories", route: "/categories" },
  { key: "booking", label: "Bookings", route: "/booking-management" },
  { key: "inquiries", label: "Inquiries", route: "/inquiries" },
  { key: "newsletter", label: "Newsletter Subscribers", route: "/newsletter-management" },
  { key: "customer", label: "Customers", route: "/user-management" },
  { key: "partner", label: "Partners", route: "/partner-management" },
  { key: "review", label: "Reviews", route: "/review" },
  { key: "blog", label: "Blog Posts", route: "/blog-management" },
  { key: "transportation", label: "Transportation Rides", route: "/transportation" },
  { key: "poa", label: "POA Consultations", route: "/poa" },
  { key: "revenue", label: "Transactions", route: "/transaction" },
  { key: "propertyListing", label: "Property Listings", route: "/property-management/listing" },
  { key: "propertyHotel", label: "Hotels", route: "/property-management/hotel" },
  { key: "advertisement", label: "Advertisements", route: "/advertisement-management" },
];
