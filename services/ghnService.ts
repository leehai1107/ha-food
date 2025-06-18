import axios from 'axios';

// GHN API Configuration
const GHN_API = process.env.GHN_API || 'https://online-gateway.ghn.vn';
const GHN_TOKEN = process.env.GHN_TOKEN || '8c48932f-57b4-11eb-a642-de5f02d31d84';
const GHN_SHOP_ID = process.env.GHN_SHOP_ID || '927928';

// Create axios instance for GHN API
const ghnApi = axios.create({
  baseURL: GHN_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Token': GHN_TOKEN,
  },
});

// Types for GHN API responses
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

// GHN Service functions
export const ghnService = {
  // Get all provinces
  async getProvinces(): Promise<GHNProvince[]> {
    try {
      const response = await ghnApi.get('/shiip/public-api/master-data/province');
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response format from GHN API');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching provinces:', error);
      throw new Error(`Failed to fetch provinces: ${error.message}`);
    }
  },

  // Get districts by province ID
  async getDistricts(provinceId: number): Promise<GHNDistrict[]> {
    try {
      const response = await ghnApi.get(`/shiip/public-api/master-data/district?province_id=${provinceId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Failed to fetch districts');
    }
  },

  // Get wards by district ID
  async getWards(districtId: number): Promise<GHNWard[]> {
    try {
      const response = await ghnApi.get(`/shiip/public-api/master-data/ward?district_id=${districtId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw new Error('Failed to fetch wards');
    }
  },

  // Get available services
  async getServices(fromDistrictId: number, toDistrictId: number): Promise<GHNService[]> {
    try {
      const response = await ghnApi.get(`/shiip/public-api/v2/shipping-order/available-services?shop_id=${GHN_SHOP_ID}&from_district=${fromDistrictId}&to_district=${toDistrictId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }
  },

  // Calculate shipping fee
  async calculateShippingFee(request: ShippingFeeRequest): Promise<ShippingFeeResponse> {
    try {
      console.log('Calculating shipping fee with request:', request);
      const response = await ghnApi.post('/shiip/public-api/v2/shipping-order/fee', request, {
        headers: {
          'ShopId': GHN_SHOP_ID,
        },
      });
      console.log('Shipping fee response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error calculating shipping fee:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(`Không thể tính phí vận chuyển: ${error.message}`);
    }
  },
};

export default ghnService; 