/**
 * Data structure for the user object.
 */
export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  emailVerified: boolean;
  activationToken?: string;
  website?: string;
  subscribeEmail?: boolean;
  createdAt: string;
  activatedAt?: string;
}
