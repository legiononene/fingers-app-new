import { gql } from "@apollo/client";

export const GET_ALL_ADMINS = gql`
  query getAllAdmins($token: String) {
    getAllAdmins(token: $token) {
      createdAt
      id
      role
      updatedAt
      userName
    }
  }
`;

export const ADD_ADMIN = gql`
  mutation AddAdminBySuperId(
    $userName: String!
    $password: String!
    $token: String
  ) {
    addAdminBySuperId(userName: $userName, password: $password, token: $token) {
      userName
    }
  }
`;

export const UPDATE_ADMIN = gql`
  mutation UpdateAdmin(
    $updateAdminId: ID
    $token: String
    $userName: String
    $password: String
  ) {
    updateAdmin(
      id: $updateAdminId
      token: $token
      userName: $userName
      password: $password
    ) {
      userName
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation DeleteAdmin($token: String, $adminId: ID!) {
    deleteAdmin(id: $adminId, token: $token) {
      userName
    }
  }
`;
