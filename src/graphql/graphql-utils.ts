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
      createdAt
      id
      inTime
      outTime
      state
      userId
      user {
        userName
        id
      }
      students {
        studentName
      }
      updatedAt
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

export const GET_ALL_BATCHES_BY_USER_ID = gql`
  query GetAllBatchesByUserId($token: String!, $userId: String) {
    getAllBatchesByUserId(token: $token, id: $userId) {
      batchName
      createdAt
      id
      inTime
      outTime
      state
      students {
        studentName
      }
      updatedAt
    }
  }
`;

export const GET_USER_BY_USER_ID = gql`
  query GetUserByUserId($token: String!, $userId: ID!) {
    getUserByUserId(token: $token, id: $userId) {
      userName
      batches {
        batchName
      }
    }
  }
`;

export const GRT_BATCH_BY_BATCH_ID = gql`
  query GetBatchByBatchId($token: String!, $batchId: ID!) {
    getBatchByBatchId(token: $token, id: $batchId) {
      userName
      students {
        aadhar_number
        studentName
      }
    }
  }
`;

export const ASIGN_BATCH_TO_USER = gql`
  mutation AssignBatchToUser($token: String!, $userId: ID!, $batchId: ID!) {
    assignBatchToUser(token: $token, userId: $userId, batchId: $batchId) {
      batchName
    }
  }
`;

export const CHANGE_STATE_OF_BATCH = gql`
  mutation ChangeStateOfBatchByBatchIdByAdmin(
    $token: String!
    $state: Boolean!
    $batchId: ID!
  ) {
    changeStateOfBatchByBatchIdByAdmin(
      token: $token
      state: $state
      batchId: $batchId
    ) {
      batchName
      state
    }
  }
`;

export const GET_BATCH_BY_BATCH_ID = gql`
  query GetBatchByBatchId($token: String!, $batchId: ID!) {
    getBatchByBatchId(token: $token, id: $batchId) {
      batchName
      createdAt
      id
      inTime
      outTime
      state
      userId
      updatedAt
      students {
        studentName
        aadhar_number
        batchId
        createdAt
        updatedAt
        state
        id
        fingerprints {
          id
          image
          priority
          studentId
        }
        details {
          aadhar_number
          address
          castCategory
          disability
          disabilityType
          dob
          domicileDistrict
          domicileState
          email
          employed
          employmentDetails
          employmentStatus
          fatherGuardian
          gender
          id
          idType
          maritalStatus
          mobile
          motherGuardian
          religion
          studentId
          trainingProgram
        }
      }
    }
  }
`;

export const ASSIGN_BATCH_TO_STUDENT = gql`
  mutation AssignStudentToBatch(
    $batchId: ID!
    $studentId: ID!
    $token: String!
  ) {
    assignStudentToBatch(
      batchId: $batchId
      studentId: $studentId
      token: $token
    ) {
      batchName
    }
  }
`;

export const GET_ALL_STUDENTS_BY_ADMIN_TOKEN = gql`
  query GetAllStudentByAdminId($token: String!) {
    getAllStudentByAdminId(token: $token) {
      updatedAt
      studentName
      state
      id
      fingerprints {
        id
      }
      details {
        aadhar_number
      }
      createdAt
      batchId
      aadhar_number
      batch {
        user {
          userName
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUserByUserToken($token: String!) {
    getUserByUserToken(token: $token) {
      role
      userName
      updatedAt
      createdAt
      id
      adminId
      batches {
        batchName
        createdAt
        id
        inTime
        outTime
        state
        students {
          studentName
        }
        updatedAt
      }
    }
  }
`;

export const GET_BATCHES_BY_USER_TOKEN = gql`
  query Root_Query($token: String!, $userId: ID!) {
    getAllBatchesByUserIdByUserToken(token: $token, userId: $userId) {
      batchName
      createdAt
      id
      inTime
      outTime
      state
      students {
        studentName
      }
      updatedAt
      userId
      user {
        userName
      }
    }
  }
`;

export const CHANGE_STATE_OF_BATCH_BY_USER = gql`
  mutation Root_Mutation($token: String!, $state: Boolean!, $batchId: ID!) {
    changeStateOfBatchByBatchIdByUser(
      token: $token
      state: $state
      batchId: $batchId
    ) {
      batchName
    }
  }
`;

export const GET_BATCH_BY_BATCH_ID_BY_USER = gql`
  query Root_Query($token: String!, $batchId: ID!) {
    getBatchByBatchIdByUserToken(token: $token, id: $batchId) {
      batchName
      createdAt
      id
      inTime
      outTime
      state
      userId
      updatedAt
      students {
        studentName
        aadhar_number
        batchId
        createdAt
        updatedAt
        state
        id
        fingerprints {
          id
          image
          priority
          studentId
        }
        details {
          aadhar_number
          address
          castCategory
          disability
          disabilityType
          dob
          domicileDistrict
          domicileState
          email
          employed
          employmentDetails
          employmentStatus
          fatherGuardian
          gender
          id
          idType
          maritalStatus
          mobile
          motherGuardian
          religion
          studentId
          trainingProgram
        }
      }
    }
  }
`;

export const ASSIGN_BATCH_TO_STUDENT_BY_USER_TOKEN = gql`
  mutation Root_Mutation($token: String!, $studentId: ID!, $batchId: ID!) {
    assignBatchToStudentByUserToken(
      token: $token
      studentId: $studentId
      batchId: $batchId
    ) {
      batchName
    }
  }
`;

export const ADD_BATCH_BY_USER_TOKEN = gql`
  mutation AddBatchesByUserToken(
    $token: String!
    $inTime: String!
    $outTime: String!
    $batchName: String!
  ) {
    AddBatchesByUserToken(
      token: $token
      inTime: $inTime
      outTime: $outTime
      batchName: $batchName
    ) {
      batchName
    }
  }
`;

export const UPDATE_BATCH_BY_USER_TOKEN = gql`
  mutation UpdateBatchByBatchIdByUserToken(
    $token: String!
    $updateId: ID!
    $batchName: String
    $inTime: String
    $outTime: String
  ) {
    updateBatchByBatchIdByUserToken(
      token: $token
      id: $updateId
      batchName: $batchName
      inTime: $inTime
      outTime: $outTime
    ) {
      batchName
    }
  }
`;

export const DELETE_BATCH_BY_USER_TOKEN = gql`
  mutation DeleteBatchByBatchIdByUserToken($token: String!, $deleteId: ID!) {
    deleteBatchByBatchIdByUserToken(token: $token, id: $deleteId) {
      batchName
    }
  }
`;

export const ADD_STUDENTS_TO_BATCH_BY_USER_TOKEN = gql`
  mutation AddStudentsByUserToken(
    $token: String!
    $batchId: String!
    $aadharNumber: Int!
    $studentName: String
    $state: [String!]
    $details: DetailsInput
  ) {
    AddStudentsByUserToken(
      token: $token
      BatchId: $batchId
      aadhar_number: $aadharNumber
      studentName: $studentName
      state: $state
      details: $details
    ) {
      studentName
    }
  }
`;
