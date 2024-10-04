import { gql } from "@apollo/client";

export const GET_ALL_ADMINS = gql`
  query getAllAdmins($token: String!) {
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
    $token: String!
  ) {
    addAdminBySuperId(userName: $userName, password: $password, token: $token) {
      userName
    }
  }
`;

export const UPDATE_ADMIN = gql`
  mutation updateAdminById(
    $updateId: ID!
    $token: String!
    $userName: String!
    $password: String!
  ) {
    updateAdminById(
      id: $updateId
      token: $token
      userName: $userName
      password: $password
    ) {
      userName
    }
  }
`;

export const DELETE_ADMIN = gql`
  mutation DeleteAdmin($token: String!, $adminId: ID!) {
    deleteAdminById(id: $adminId, token: $token) {
      userName
    }
  }
`;

export const GET_ADMIN = gql`
  query getAdmin($token: String!) {
    getAdminByAdminToken(token: $token) {
      id
      createdAt
      role
      updatedAt
      userName
    }
  }
`;

export const GET_ALL_USERS_BY_ADMIN = gql`
  query getAllUsersByAdminToken($token: String!) {
    getAllUsersByAdminToken(token: $token) {
      batches {
        batchName
        students {
          studentName
        }
      }
      createdAt
      id
      updatedAt
      userName
    }
  }
`;

export const GET_ALL_BATCHES_BY_ADMIN = gql`
  query getAllBatchesByAdmin($token: String!) {
    getAllBatchesByAdminId(token: $token) {
      batchName
    }
  }
`;

export const GET_ALL_STUDENTS_BY_ADMIN = gql`
  query getAllStudentsByAdmin($token: String!) {
    getAllStudentByAdminId(token: $token) {
      studentName
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUsersByAdminToken(
    $userName: String!
    $password: String!
    $token: String!
  ) {
    addUsersByAdminToken(
      userName: $userName
      password: $password
      token: $token
    ) {
      userName
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUsersByAdminToken(
    $userName: String!
    $password: String!
    $token: String!
    $updateId: ID!
  ) {
    updateUsersByAdminToken(
      userName: $userName
      password: $password
      token: $token
      id: $updateId
    ) {
      userName
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUsersByAdminToken($token: String!, $deleteId: ID!) {
    deleteUsersByAdminToken(token: $token, id: $deleteId) {
      userName
    }
  }
`;
