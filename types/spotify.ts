interface Image {
  height: number | null;
  width: number | null;
  url: string;
}

interface Track {
  id: string;
  name: string;
  album: {
    images: Image[];
  };
  artists: Artist[];
  external_urls: {
    spotify: string;
  };
  uri: string;
  duration: string;
}

interface Artist {
  name: string;
  id: string;
  images: Image[];
}

interface WebApiResponse<T> {
  items: T[];
  limit: number;
  next: string | null;
  offset: number;
  total: number;
  href: string;
  error?: ErrorResponse;
}

interface ErrorResponse {
  status: number;
  message: string;
}

export type { Image, Track, Artist, WebApiResponse, ErrorResponse };
