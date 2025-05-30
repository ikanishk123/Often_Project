const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface CreateInviteRequest {
  name: string;
  cover_image_media: File | null;
  nights: number;
  start_datetime: string;
  location_name: string;
  location_lat: string;
  location_lng: string;
  place_id: string;
  category_id: string;
  description: string;
  soft_delete: boolean;
  countries: {
    start: string;
    end: string;
  };
  tags: string[];
  config: {
    capacity: number;
    enable_waitlist: boolean;
    guest_approval: boolean;
    is_public: boolean;
    password_key: string;
    status: string;
    is_ticker: boolean;
    ticker_text: string;
    place_name: string;
    rules: string[];
  };
  custom_links: Array<{
    emoji: string;
    label: string;
    url: string;
  }>;
}

export interface InviteResponse {
  host_id: string;
  name: string;
  cover_image_media: string | null;
  start_datetime: string;
  nights: number;
  location_name: string;
  location_lat: string;
  location_lng: string;
  place_id: string;
  category_id: string;
  description: string;
  soft_delete: boolean;
  countries: {
    countries: any;
  };
  tags: string[];
  id: string;
  created_at: string;
  updated_at: string;
  host: {
    name: string;
    email: string;
    id: string;
    often_user_id: number;
    created_at: string;
    updated_at: string;
  };
  config: {
    invite_id: string;
    capacity: number;
    enable_waitlist: boolean;
    guest_approval: boolean;
    is_public: boolean;
    password_key: string;
    status: string;
    is_ticker: boolean;
    ticker_text: string;
    place_name: string;
    rules: string[];
  };
  category: {
    name: string;
    id: string;
  };
  custom_links: Array<{
    emoji: string;
    label: string;
    url: string;
  }>;
  draft: any;
}

export async function createInvite(data: CreateInviteRequest): Promise<InviteResponse> {
  const formData = new FormData();

  const createData = {
    name: data.name,
    cover_image_media: null,
    nights: data.nights,
    start_datetime: data.start_datetime,
    location_name: data.location_name,
    location_lat: data.location_lat,
    location_lng: data.location_lng,
    place_id: data.place_id,
    category_id: data.category_id,
    description: data.description,
    soft_delete: false,
    countries: data.countries,
    tags: data.tags,
    config: data.config,
    custom_links: data.custom_links,
  };

  formData.append("data", JSON.stringify(createData));

  if (data.cover_image_media) {
    formData.append("cover_image", data.cover_image_media);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/invites`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create invite: ${response.statusText}`);
    }

    const result = (await response.json()) as InviteResponse;
    return result;
  } catch (error) {
    console.error("Error creating invite:", error);
    throw new Error("Failed to create invite");
  }
}

export async function getInvite(id: string): Promise<InviteResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/invites/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch invite: ${response.statusText}`);
    }

    const invite = (await response.json()) as InviteResponse;
    return invite;
  } catch (error) {
    console.error("Error fetching invite:", error);
    throw new Error("Failed to fetch invite");
  }
}

// Utility for generating IDs (optional)
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
