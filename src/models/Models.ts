export interface AuthReq extends CommonAnyObject {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope: string;
  clientKey: string;
  impersonatorToken?: string;
}

export interface AuthRes {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
  error_description?: string;
  expireTime?: string;
}

export interface Premission_old {
  grantedPermissions?: string[];
  userId?: string | null;
}

export interface UserInfo {
  createdOn?: string;
  currentTenantId?: string;
  currentUnitId?: string;
  currentUnitName?: string;
  domainName?: string;
  firstName?: string;
  id?: string;
  isSystem?: boolean;
  lastName?: string;
  name?: string;
  password?: string;
}
export interface CommonAnyObject {
  [propertyName: string]: any;
}

export interface AssignedRoles {
  roleId: 0;
  roleType: 0;
  roleName: string;
  associatedEntityId: string;
  associatedEntityName: string;
}

export interface Premissions {
  name: string;
  userName: string;
  assignedRoles: AssignedRoles[];
  permission: string[];
  isImpersonatedLogin: true;
  companyName: string;
  companyId: string;
  serviceCenterName: string;
  serviceCenterId: string;
  regionName: string;
  regionId: string;
  regionOwner: string;
  id: string;
}

export interface CompanyInfo {
  address?: string;
  id?: string;
  name?: string;
  no?: string;
  primaryContactName?: string;
  primaryContactTel?: string;
  country?: string;
  province?: string;
  city?: string;
  county?: string;
  email?: string;
  fax?: string;
  [property: string]: any;
}

export interface PortalUserInfo {
  name: string;
  userName: string;
  assignedRoles: AssignedRoles[];
  permission: string[];
  isImpersonatedLogin: boolean;
  companyName: string;
  companyId: string;
  serviceCenterName: string;
  serviceCenterId: string;
  regionName: string;
  regionId: string;
  regionOwner: string;
  id: string;
}

export interface UserInfoNew {
  lonsidUserId: string;
  name: string;
  tenantId: number;
  unitId: string;
  companyId: string;
  distributorId: string;
  domainName: string;
  systemUserId: string;
  id: string;
}

export interface Code {
  token: string;
}
