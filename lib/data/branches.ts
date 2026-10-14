export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  googleMapsUrl: string
  image?: string
  services: string[]
  landmark?: string
}

// Branch data from Lydia's Lechon
export const branches: Branch[] = [
  {
    id: "1",
    name: "Baclaran Branch",
    address: "Baclaran, Parañaque City, Metro Manila",
    phone: "0917 820 2989",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Baclaran",
    landmark: "Near Baclaran Church",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "2",
    name: "Timog Branch",
    address: "Timog Avenue, Quezon City, Metro Manila",
    phone: "0997 643 6150",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Timog",
    landmark: "Timog Avenue Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "3",
    name: "Roces Branch",
    address: "Roces Avenue, Quezon City, Metro Manila",
    phone: "0995 083 3532",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Roces",
    landmark: "Roces Avenue Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "4",
    name: "Fairview Branch",
    address: "Fairview, Quezon City, Metro Manila",
    phone: "0927 676 5710",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Fairview",
    landmark: "Fairview Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "5",
    name: "Marcos Highway Branch",
    address: "Marcos Highway, Antipolo City, Rizal",
    phone: "0995 069 2281",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Marcos+Highway",
    landmark: "Along Marcos Highway",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "6",
    name: "Pasig Branch",
    address: "Pasig City, Metro Manila",
    phone: "0936 979 1911",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Pasig",
    landmark: "Pasig City Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "7",
    name: "General Trias Branch",
    address: "General Trias, Cavite",
    phone: "0917 887 2168",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+General+Trias",
    landmark: "General Trias Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "8",
    name: "Calamba Branch",
    address: "Calamba City, Laguna",
    phone: "0960 200 8633",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Calamba",
    landmark: "Calamba City Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  },
  {
    id: "9",
    name: "Los Baños Branch",
    address: "Los Baños, Laguna",
    phone: "0921 200 4150",
    hours: "9:00 AM - 9:00 PM (Daily)",
    googleMapsUrl: "https://maps.google.com/?q=Lydia's+Lechon+Los+Baños",
    landmark: "Los Baños Area",
    services: ["Dine-in", "Take-out", "Delivery", "Catering"]
  }
]
