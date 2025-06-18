// GHN API Types
export interface GHNProvince {
  ProvinceID: number;
  ProvinceName: string;
  Code: string;
}

export interface GHNDistrict {
  DistrictID: number;
  DistrictName: string;
  Code: string;
  ProvinceID: number;
}

export interface GHNWard {
  WardCode: string;
  WardName: string;
  DistrictID: number;
}

export interface GHNService {
  service_id: number;
  short_name: string;
  service_type_id: number;
}

export interface ShippingFeeRequest {
  from_district_id?: number;
  from_ward_code?: string;
  service_id: number;
  service_type_id?: number;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
  insurance_value?: number;
  cod_failed_amount?: number;
  coupon?: string;
  items?: Array<{
    name: string;
    quantity: number;
    height: number;
    weight: number;
    length: number;
    width: number;
  }>;
  cod_value?: number;
}

export interface ShippingFeeResponse {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
  document_return: number;
  double_check: number;
  cod_fee: number;
  pick_remote_areas_fee: number;
  deliver_remote_areas_fee: number;
  cod_failed_fee: number;
}

// API Response wrapper types
export interface GHNApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface GHNErrorResponse {
  error: string;
} 