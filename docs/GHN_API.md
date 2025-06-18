# GHN API Integration

This document describes the GHN (Giao Hang Nhanh) API integration for address data and shipping fee calculation.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
GHN_API=https://dev-online-gateway.ghn.vn
GHN_TOKEN=xxxxx
GHN_SHOP_ID=xxxxx
```

## API Endpoints

### 1. Get Provinces

**GET** `/api/ghn?type=provinces`

Returns all available provinces in Vietnam.

**Response:**

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "ProvinceID": 201,
      "ProvinceName": "Hà Nội",
      "Code": "4"
    },
    {
      "ProvinceID": 202,
      "ProvinceName": "Hồ Chí Minh",
      "Code": "8"
    }
  ]
}
```

### 2. Get Districts

**GET** `/api/ghn?type=districts&province_id={provinceId}`

Returns districts for a specific province.

**Parameters:**

- `province_id` (required): The province ID

**Response:**

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "DistrictID": 1454,
      "DistrictName": "Quận Ba Đình",
      "Code": "001",
      "ProvinceID": 201
    }
  ]
}
```

### 3. Get Wards

**GET** `/api/ghn?type=wards&district_id={districtId}`

Returns wards for a specific district.

**Parameters:**

- `district_id` (required): The district ID

**Response:**

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "WardCode": "21211",
      "WardName": "Phường Phúc Xá",
      "DistrictID": 1454
    }
  ]
}
```

### 4. Get Available Services

**GET** `/api/ghn?type=services&from_district_id={fromDistrictId}&to_district_id={toDistrictId}`

Returns available shipping services between two districts.

**Parameters:**

- `from_district_id` (required): Source district ID
- `to_district_id` (required): Destination district ID

**Response:**

```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "service_id": 53320,
      "short_name": "Giao hàng tiết kiệm",
      "service_type_id": 2
    }
  ]
}
```

### 5. Calculate Shipping Fee

**POST** `/api/ghn?type=shipping-fee`

Calculates shipping fee based on package dimensions and destination.

**Request Body:**

```json
{
  "from_district_id": 1454,
  "from_ward_code": "21211",
  "service_id": 53320,
  "to_district_id": 1452,
  "to_ward_code": "21012",
  "height": 50,
  "length": 20,
  "weight": 200,
  "width": 20,
  "insurance_value": 10000,
  "cod_failed_amount": 2000,
  "items": [
    {
      "name": "Product Name",
      "quantity": 1,
      "height": 200,
      "weight": 1000,
      "length": 200,
      "width": 200
    }
  ]
}
```

**Required Fields:**

- `service_id`: Service ID from available services
- `to_district_id`: Destination district ID
- `to_ward_code`: Destination ward code
- `height`: Package height in cm
- `length`: Package length in cm
- `weight`: Package weight in grams
- `width`: Package width in cm

**Optional Fields:**

- `from_district_id`: Source district ID (uses shop default if not provided)
- `from_ward_code`: Source ward code (uses shop default if not provided)
- `service_type_id`: Service type ID
- `insurance_value`: Package insurance value (max 5,000,000)
- `cod_failed_amount`: COD failed amount
- `coupon`: Coupon code for discount
- `items`: Array of items in the package
- `cod_value`: Cash on delivery amount (max 5,000,000)

**Response:**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "total": 36300,
    "service_fee": 36300,
    "insurance_fee": 0,
    "pick_station_fee": 0,
    "coupon_value": 0,
    "r2s_fee": 0,
    "document_return": 0,
    "double_check": 0,
    "cod_fee": 0,
    "pick_remote_areas_fee": 0,
    "deliver_remote_areas_fee": 0,
    "cod_failed_fee": 0
  }
}
```

## Individual Endpoints

For convenience, you can also use individual endpoints:

- **GET** `/api/ghn/provinces` - Get all provinces
- **GET** `/api/ghn/districts?province_id={provinceId}` - Get districts by province
- **GET** `/api/ghn/wards?district_id={districtId}` - Get wards by district
- **GET** `/api/ghn/services?from_district_id={fromId}&to_district_id={toId}` - Get available services
- **POST** `/api/ghn/shipping-fee` - Calculate shipping fee

## Usage Examples

### Frontend Usage

```typescript
import { ghnService } from "@/services/ghnService";

// Get provinces
const provinces = await ghnService.getProvinces();

// Get districts for a province
const districts = await ghnService.getDistricts(201);

// Get wards for a district
const wards = await ghnService.getWards(1454);

// Get available services
const services = await ghnService.getServices(1454, 1452);

// Calculate shipping fee
const fee = await ghnService.calculateShippingFee({
  service_id: 53320,
  to_district_id: 1452,
  to_ward_code: "21012",
  height: 50,
  length: 20,
  weight: 200,
  width: 20,
});
```

### API Usage

```javascript
// Get provinces
const response = await fetch("/api/ghn?type=provinces");
const provinces = await response.json();

// Calculate shipping fee
const feeResponse = await fetch("/api/ghn?type=shipping-fee", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    service_id: 53320,
    to_district_id: 1452,
    to_ward_code: "21012",
    height: 50,
    length: 20,
    weight: 200,
    width: 20,
  }),
});
const fee = await feeResponse.json();
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing required parameters)
- `500`: Internal Server Error (GHN API error or network issue)

## Notes

1. The GHN API requires authentication via the `Token` header
2. The `ShopId` header is required for shipping fee calculations
3. All measurements should be in the correct units (cm for dimensions, grams for weight)
4. Insurance value and COD value have maximum limits of 5,000,000 VND
5. The API uses the development environment by default. For production, update the `GHN_API` environment variable
