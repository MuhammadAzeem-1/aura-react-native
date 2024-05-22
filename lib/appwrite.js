import { ID, Account, Client, Avatars, Databases, Query } from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.azeem.auroapp",
  projectId: "6649c5730026c47421fa",
  databaseId: "6649c882000eea47bff2",
  userCollectionId: "6649c924000c31341128",
  videoCollectionId: "6649c94d00242192f8e1",
  storageId: "6649d451003ae7b32f9a",
};

const client = new Client();
client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if(!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl
        }
    )

    return newUser
  } catch (error) {
    throw new Error(error)
  }
};

export const signIn = async (email, password) =>{ 
    try {
        const session = await account.createEmailPasswordSession(email, password)

        return session
    } catch (error) {
        throw new Error(error)
    }
}

export const getAccount = async () => {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount()

    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if(!currentUser) throw Error;

    return currentUser.documents[0]
  } catch (error) {
    console.log(error);
  }
}
// Get all video Posts
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}


export const signOut = async () => {
   try {
    const session = await account.deleteSession("current")
     return session
   } catch (error) {
    throw new Error(error)
   }
}