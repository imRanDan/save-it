'use server'

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig} from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite"
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
    const { databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])],
    )

    return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message)
    throw error
}

const sendEmailOTP = async ({ email}: {email: string}) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email)

        console.log(session)
        return session.userId
    } catch (error) {
        handleError(error, "Failed to send email OTP")
    }
}

const createAccount = async ({ 
    fullName, email}: {
        fullName: string, 
        email: string;
    }) => {
        const existingUser = await getUserByEmail(email)

        const accountId = await sendEmailOTP({ email });
        if(!accountId) throw new Error("Failed to send an OTP")

        if(!existingUser) {
            const {databases} = await createAdminClient()

            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                ID.unique(),
                {
                    fullName,
                    email,
                    avatar:
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
                    accountId,
                },
            )
        }

        return parseStringify({ accountId })
}