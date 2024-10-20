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
  mutation DeleteAdmin($token: String!, $deleteId: ID!) {
    deleteAdminById(id: $deleteId, token: $token) {
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
      user {
        id
      }
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
  query GetAllBatchesByUserId($token: String!, $userId: ID!) {
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

      user {
        id,
        userName
      }
      updatedAt
      students {
        studentName
        aadhar_number

        createdAt
        updatedAt
        state
        id
        fingerprints {
          id
          image
          priority
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
        image
        name
        priority
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

        trainingProgram
      }
      createdAt

      aadhar_number
      batch {
        batchName
        id

        user {
          userName
          id
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
  query Root_Query($token: String!) {
    getAllBatchesByUserIdByUserToken(token: $token) {
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
      updatedAt
      students {
        studentName
        aadhar_number
        batch {
          id
        }
        createdAt
        updatedAt
        state
        id
        fingerprints {
          id
          image
          priority

          name
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

export const ADD_STUDENT_TO_BATCH_BY_USER_TOKEN = gql`
  mutation Root_Mutation(
    $token: String!
    $batchId: ID!
    $aadhar_number: String!
    $details: DetailsInput
    $studentName: String!
  ) {
    AddStudentByUserToken(
      token: $token
      batchId: $batchId
      aadhar_number: $aadhar_number
      details: $details
      studentName: $studentName
    ) {
      studentName
    }
  }
`;

export const ADD_MULTIPLE_STUDENTS_TO_BATCH_BY_USER_TOKEN = gql`
  mutation AddStudentsByUserToken(
    $token: String!
    $batchId: ID!
    $students: [StudentInputType!]
  ) {
    AddStudentsByUserToken(
      token: $token
      batchId: $batchId
      student: $students
    ) {
      studentName
    }
  }
`;

export const ADD_FINGERPRINTS_TO_STUDENT_BY_USER_TOKEN = gql`
  mutation AddFingerPrintsToStudentByStudentIdByUserToken(
    $token: String!
    $studentId: ID!
    $fingerPrints: [FingerPrintInput!]!
  ) {
    AddFingerPrintsToStudentByStudentIdByUserToken(
      token: $token
      id: $studentId
      fingerPrints: $fingerPrints
    ) {
      studentName
    }
  }
`;

export const DELETE_FINGERPRINT_BY_FINGERPRINT_ID_BY_USER_TOKEN = gql`
  mutation Root_Mutation($token: String!, $fingerprintId: ID!) {
    deleteFingerPrintOfStudentByFingerPrintIdByUserToken(
      token: $token
      id: $fingerprintId
    ) {
      name
    }
  }
`;

export const UPDATE_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN = gql`
  mutation UpdateStudentByStudentIdByUserToken(
    $token: String!
    $updateId: ID!
    $studentName: String!
    $aadhar_number: String!
  ) {
    updateStudentByStudentIdByUserToken(
      token: $token
      id: $updateId
      studentName: $studentName
      aadhar_number: $aadhar_number
    ) {
      studentName
    }
  }
`;

export const DELETE_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN = gql`
  mutation DeleteStudentByStudentIdByUserToken(
    $token: String!
    $deleteId: ID!
  ) {
    deleteStudentByStudentIdByUserToken(token: $token, id: $deleteId) {
      studentName
    }
  }
`;

export const ADD_DETAILS_TO_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN = gql`
  mutation Root_Mutation(
    $token: String!
    $studentId: ID!
    $details: DetailsInput!
  ) {
    addDetailsToStudentByStudentIdByUserToken(
      token: $token
      studentId: $studentId
      detail: $details
    ) {
      studentName
      details {
        dob
      }
    }
  }
`;

export const UPDATE_DETAILS_OF_STUDENT_BY_STUDENT_ID_BY_USER_TOKEN = gql`
  mutation Root_Mutation(
    $token: String!
    $detailsId: ID!
    $details: DetailsInput!
  ) {
    updateDetailsOfStudentByStudentIdByUserToken(
      token: $token
      detailId: $detailsId
      detail: $details
    ) {
      studentName
      details {
        dob
      }
    }
  }
`;

export const GET_ALL_STUDENTS_BY_USER_TOKEN = gql`
  query GetAllStudentsByUserToken($token: String!) {
    getAllStudentsByUserToken(token: $token) {
      updatedAt
      createdAt
      studentName
      state
      id
      fingerprints {
        id
        image
        name
        priority
      }

      batch {
        batchName
        id
        user {
          userName
          id
        }
      }
      aadhar_number
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

        trainingProgram
      }
    }
  }
`;
